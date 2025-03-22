from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAdminUser, IsAuthenticated, IsAuthenticatedOrReadOnly
from django.contrib.auth.hashers import make_password
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from .models import *
from .serializers import *
import json
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.models import User

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
    
@api_view(['POST'])
def create_booking(request):
    data = request.data
    if "payment_status" not in data or data["payment_status"] != "Completed":
        return Response({"message": "Payment required before booking."}, status=400)
    
    serializer = BookingSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    
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
def pending_bookings(request):
    pending = Booking.objects.filter(payment_status="Pending")
    serializer = BookingSerializer(pending, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def booking_history(request):
    email = request.query_params.get("email")
    if not email:
        return Response({"message": "Email is required to fetch booking history."}, status=400)
    
    bookings = Booking.objects.filter(email=email)
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)