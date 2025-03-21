from django.http import JsonResponse
from base.rooms import rooms
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Room
from .serializers import *
from  .models import *
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from django.contrib.auth.hashers import make_password
from rest_framework import status
from .serializers import RoomSerializer
from django.shortcuts import get_object_or_404

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
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def registerUser(request):
    data = request.data

    try:
        user = User.objects.create(
            first_name=data['name'],
            username=data['name'],
            email=data['email'],
            password=make_password(data['password'])
        )
        serializer = UserSerializerWithToken(user, many = False)
        return Response(serializer.data)
    except:
        message = {'detail': 'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    

    
from django.db.models import Q

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

    serializer = RoomSerializer(rooms.distinct(), many=True)  # Use `.distinct()` to avoid duplicates
    return Response(serializer.data)