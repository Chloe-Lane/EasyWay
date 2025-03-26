from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Message  # Ensure you import the Message model


class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ['id', 'name']

class PolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = Policy
        fields = ['id', 'name']

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = CustomUser
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin', 'role']
    
    def get__id(self, obj):
        return obj.id
    
    def get_isAdmin(self, obj):
        return obj.is_staff
    
    def get_name(self, obj):
        name = obj.username
        if name == '':
            name = obj.email
        return name
    
    def get_role(self, obj):
        return obj.role

class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CustomUser  # ✅ Use CustomUser here too
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin', 'role', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)
        
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data

        for k, v in serializer.items():
            data[k] = v

        
        return data
    

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(many=False, read_only=True)  # Assuming you have a UserSerializer defined
    room = serializers.PrimaryKeyRelatedField(read_only=True)  # Or use a serializer for the room if needed

    class Meta:
        model = Message
        fields = '__all__'  # Or specify the fields you want to include


class RoomSerializer(serializers.ModelSerializer):
    lister = UserSerializer(read_only=True)
    amenities = AmenitySerializer(many=True, read_only=True)
    policies = PolicySerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = '__all__'  # Includes amenities
    
    # Booking Serializer
class BookingSerializer(serializers.ModelSerializer):
    room_name = serializers.CharField(source="room.name", read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'

class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = '__all__'