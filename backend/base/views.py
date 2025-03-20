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

@api_view(['GET'])
def getRoutes(request):

    routes = [
        '/api/products/',
        '/api/products/create/',
        '/api/products/upload/',
        '/api/products/<id>/reviews/',
        '/api/products/top/',
        '/api/products/<id>/',
        '/api/products/delete/<id>/',
        '/api/products/update/<id>/',
    ]
    return Response(routes)

@api_view(['GET'])
def getRooms(request):
    rooms = Room.objects.all()
    serializer = RoomSerializer(rooms, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getRoom(request, pk):
    room = Room.objects.get(_id=pk)
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
    query = request.GET.get('q', '').strip()  # Get and clean the search query
    
    if query:
        # Search for rooms where 'name' or 'location' contains the query (case-insensitive)
        rooms = Room.objects.filter(Q(name__icontains=query) | Q(location__icontains=query))

        results = [
            {
                "id": room._id,
                "name": room.name,
                "image": room.image.url if room.image else None,
                "price": room.price,
                "location": room.location,
                "rating": room.rating,
                "numReviews": room.numReviews,
            }
            for room in rooms
        ]
        return Response(results)
    
    return Response([])  # Return an empty list if no query is provided