import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import CustomUser, ChatRoom, Message
from channels.db import database_sync_to_async
from django.utils import timezone

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']  
        self.room_group_name = f"chat_{self.room_id}"

        print(f"🔗 Connecting to room: {self.room_id}")

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        print(f"🔌 Disconnecting from room: {self.room_id}")
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message')
        sender_id = data.get('sender_id')

        if not message or not sender_id:
            print("❌ Error: Missing message or sender_id")
            return

        sender = await self.get_sender(sender_id)

        if not sender:
            print("❌ Error: Sender not found")
            return

        chat_room = await self.get_or_create_chat_room()

        if not chat_room:
            print("❌ Error: ChatRoom could not be retrieved/created")
            return

        await self.save_message(chat_room, sender, message)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender_id': sender.id,
                'sender_username': sender.username,
                'timestamp': timezone.now().isoformat(),
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender_id': event['sender_id'],
            'sender_username': event['sender_username'],
            'timestamp': event['timestamp'],
        }))

    @database_sync_to_async
    def get_sender(self, sender_id):
        return CustomUser.objects.filter(id=sender_id).first()

    @database_sync_to_async
    def get_or_create_chat_room(self):
        """Retrieve or create a chat room based on the user-host pair in self.room_id."""
        try:
            id1, id2 = map(int, self.room_id.split('_'))
            user1 = CustomUser.objects.get(id=id1)
            user2 = CustomUser.objects.get(id=id2)

            if user1.role == 'user' and user2.role == 'host':
                user, host = user1, user2
            elif user2.role == 'user' and user1.role == 'host':
                user, host = user2, user1
            else:
                print("❌ Invalid chat room: Requires one User and one Host")
                return None

            chat_room, created = ChatRoom.objects.get_or_create(user=user, host=host)
            return chat_room

        except CustomUser.DoesNotExist:
            print("❌ Error: User or Host not found")
            return None
        except ValueError:
            print("❌ Error: Invalid room_id format")
            return None

    @database_sync_to_async
    def save_message(self, chat_room, sender, message):
        """Save the chat message to the database."""
        try:
            Message.objects.create(room=chat_room, sender=sender, content=message)
            print(f"✅ Message saved to room {chat_room.id}")
        except Exception as e:
            print(f"❌ Error saving message: {e}")
