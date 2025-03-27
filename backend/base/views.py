from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAdminUser, IsAuthenticated, IsAuthenticatedOrReadOnly
from django.contrib.auth.hashers import make_password
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status, generics
from .models import *
from .serializers import *
import json
from rest_framework.parsers import MultiPartParser, FormParser
from base import views
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.models import User
from rest_framework import status, viewsets
from django.contrib.auth.hashers import make_password
import traceback




@api_view(['GET'])
def getRooms(request):
    rooms = Room.objects.all()
    serializer = RoomSerializer(rooms, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getRoom(request, pk):
    room = get_object_or_404(Room, _id=pk)
    serializer = RoomSerializer(room, many=False)
    return Response(serializer.data)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = CustomUser.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def registerUser(request):
    data = request.data
    role = data.get('role', 'user')  # Default role is 'user'

    try:
        user = CustomUser.objects.create(
            username=data['username'],
            email=data['email'],
            role=role,
            password=make_password(data['password'])
        )
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)

    except Exception as e:
        print("Registration Error:", e)
        message = {'detail': 'User with this email or username already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def search_rooms(request):
    query = request.GET.get('q', '').strip()
    amenities = request.GET.getlist('amenities[]')

    rooms = Room.objects.all()

    if query:
        rooms = rooms.filter(Q(name__icontains=query) | Q(location__icontains=query))

    if amenities:
        amenity_filters = Q()
        for amenity in amenities:
            amenity_filters |= Q(amenities__name__icontains=amenity)  # OR condition
        rooms = rooms.filter(amenity_filters)

    serializer = RoomSerializer(rooms.distinct(), many=True)  # Avoid duplicates
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def get_amenities(request):
    amenities = Amenity.objects.all()
    serializer = AmenitySerializer(amenities, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def get_policies(request):
    policies = Policy.objects.all()
    serializer = PolicySerializer(policies, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def createRoom(request):
    user = request.user
    data = request.data

    try:
        room = Room.objects.create(
            user=user,
            name=data['name'],
            price=data['price'],
            location=data['location'],
            description=data['description'],
            rating=data.get('rating', 0),
            numReviews=data.get('numReviews', 0),
            latitude=data.get('latitude'),
            longitude=data.get('longitude'),
        )

        # Safe JSON loading with fallback
        selected_amenities = json.loads(data.get('selected_amenities') or '[]')
        for amenity_id in selected_amenities:
            if str(amenity_id).strip() == '':
                continue  # Skip empty strings
            try:
                amenity = Amenity.objects.get(id=int(amenity_id))
                room.amenities.add(amenity)
            except Amenity.DoesNotExist:
                continue
        
        new_amenities = json.loads(data.get('new_amenities') or '[]')
        for amenity_name in new_amenities:
            amenity, _ = Amenity.objects.get_or_create(name=amenity_name)
            room.amenities.add(amenity)

        selected_policies = json.loads(data.get('selected_policies') or '[]')
        for policy_id in selected_policies:
            if str(policy_id).strip() == '':
                continue
            try:
                policy = Policy.objects.get(id=int(policy_id))
                room.policies.add(policy)
            except Policy.DoesNotExist:
                continue

        new_policies = json.loads(data.get('new_policies') or '[]')
        for policy_name in new_policies:
            policy, _ = Policy.objects.get_or_create(name=policy_name)
            room.policies.add(policy)

        # Image Handling ✅
        if 'image' in request.FILES:
            room.image = request.FILES['image']
            room.save()

        serializer = RoomSerializer(room, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        print(str(e))  # Good for debugging during development
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_room(request, room_id):
    try:
        room = Room.objects.get(_id=room_id)

        # ✅ Restrict access: Only the room owner or an admin can update
        if request.user != room.lister:
            return Response(
                {"detail": "Not authorized to update this room"},
                status=status.HTTP_403_FORBIDDEN
            )

        data = request.data

        print(f"Logged-in User: {request.user.id}, Room Owner: {room.lister.id}")


        # Update basic fields
        room.name = data.get('name', room.name)
        room.price = data.get('price', room.price)
        room.location = data.get('location', room.location)
        room.description = data.get('description', room.description)
        room.rating = data.get('rating', room.rating)
        room.numReviews = data.get('numReviews', room.numReviews)
        room.latitude = data.get('latitude', room.latitude)
        room.longitude = data.get('longitude', room.longitude)

        # Update Amenities (safe JSON handling)
        if 'selected_amenities' in data:
            room.amenities.clear()
            selected_amenities = json.loads(data.get('selected_amenities', '[]'))
            for amenity_id in selected_amenities:
                try:
                    amenity = Amenity.objects.get(id=int(amenity_id))
                    room.amenities.add(amenity)
                except Amenity.DoesNotExist:
                    continue

        if 'new_amenities' in data:
            new_amenities = json.loads(data.get('new_amenities', '[]'))
            for amenity_name in new_amenities:
                amenity, _ = Amenity.objects.get_or_create(name=amenity_name)
                room.amenities.add(amenity)

        # Update Policies
        if 'selected_policies' in data:
            room.policies.clear()
            selected_policies = json.loads(data.get('selected_policies', '[]'))
            for policy_id in selected_policies:
                try:
                    policy = Policy.objects.get(id=int(policy_id))
                    room.policies.add(policy)
                except Policy.DoesNotExist:
                    continue

        if 'new_policies' in data:
            new_policies = json.loads(data.get('new_policies', '[]'))
            for policy_name in new_policies:
                policy, _ = Policy.objects.get_or_create(name=policy_name)
                room.policies.add(policy)

        # Handle Image Update
        if 'image' in request.FILES:
            room.image = request.FILES['image']

        room.save()

        serializer = RoomSerializer(room, many=False)
        return Response(serializer.data)

    except Room.DoesNotExist:
        return Response({"detail": "Room not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
class MessageListView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        room_id = self.kwargs["room_id"]
        return Message.objects.filter(room_id=room_id).order_by("timestamp")
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_messages(request, room_id):
    try:
        user_id, host_id = map(int, room_id.split('_'))

        # Check both combinations (user-host and host-user)
        chat_room = ChatRoom.objects.filter(user_id=user_id, host_id=host_id).first()
        if not chat_room:
            chat_room = ChatRoom.objects.filter(user_id=host_id, host_id=user_id).first()

        if not chat_room:
            return Response({'detail': 'Chat room does not exist.'}, status=404)

        messages = chat_room.messages.all().order_by('timestamp')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    except Exception as e:
        print(f"❌ Error fetching messages: {e}")
        return Response({'detail': 'Invalid room or server error.'}, status=400)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_chat_rooms(request):
    user = request.user
    # ✅ Get all rooms where the user is either user or host
    chat_rooms = ChatRoom.objects.filter(models.Q(user=user) | models.Q(host=user))
    serializer = ChatRoomSerializer(chat_rooms, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_booking(request):
    data = request.data
    print("Received booking data:", data)  # 🔍 Debugging output
    
    if "payment_status" not in data or data["payment_status"] != "Completed":
        print("❌ Payment not completed!")  # 🔍 Debugging
        return Response({"message": "Payment required before booking."}, status=400)

    serializer = BookingSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        print("✅ Booking created successfully!")  # 🔍 Debugging
        return Response(serializer.data, status=201)
    
    print("❌ Serializer Errors:", serializer.errors)  # 🔍 Debugging
    return Response(serializer.errors, status=400)


class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = PolicySerializer
    
    def get_queryset(self):
        email = self.request.query_params.get("email")
        if email:
            return Booking.objects.filter(email=email)
        return Booking.objects.all()

@api_view(['POST'])
def process_payment(request):
    return Response({"message": "Payment successful!"}, status=status.HTTP_200_OK)

@api_view(['GET'])
def user_bookings(request, email):
    bookings = Booking.objects.filter(email=email).order_by('-created_at')
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def booking_history(request):
    email = request.query_params.get("email")
    if not email:
        return Response({"message": "Email is required to fetch booking history."}, status=400)
    
    bookings = Booking.objects.filter(email=email)
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)
    data = request.data
    print(data)
    user.first_name = data['name']
    user.email = data['email']
    

    if data['password'] != '':
        user.password = make_password(data['password'])
    user.save()
    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_booking(request):
    try:
        data = request.data
        print("Received Data:", json.dumps(data, indent=2))  # Debugging

        # Ensure payment status is present
        if "payment_status" not in data:
            return Response({"message": "Payment status is required."}, status=400)

        # Assign the authenticated user to the booking
        data["user"] = request.user.id  # Add the user's ID to the request data

        # Pass the request context to the serializer
        serializer = BookingSerializer(data=data, context={"request": request})
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors, status=400)

    except Exception as e:
        print("Error:", str(e))
        traceback.print_exc()  # Print full traceback for debugging
        return Response({"error": str(e)}, status=500)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def PayBooking(request, booking_id):
    try:
        # Change 'id' to '_id' in the query
        booking = Booking.objects.get(_id=booking_id)
        
        booking.payment_status = "Completed"
        booking.save()
        
        return Response({"message": "Payment successful!"}, status=200)
    except Booking.DoesNotExist:
        return Response({"error": "Booking not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getBookings(request):
    try:
        user = request.user
        bookings = Booking.objects.filter(user=user)
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getBooking(request, booking_id):
    try:
        print(f"Received request for booking {booking_id}")
        booking = Booking.objects.get(_id=booking_id)
        serializer = BookingSerializer(booking)
        return Response(serializer.data)
    except Booking.DoesNotExist:
        return Response({"error": "Booking not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(['POST'])
def update_payment_status(request):
    data = request.data
    try:
        booking = Booking.objects.get(email=data['email'], check_in=data['check_in'], check_out=data['check_out'])
        booking.payment_status = data['payment_status']
        booking.save()
        return Response({"message": "Payment status updated successfully"}, status=200)
    except Booking.DoesNotExist:
        return Response({"error": "Booking not found"}, status=404)
