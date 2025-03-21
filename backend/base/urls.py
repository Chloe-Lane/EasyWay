from django.urls import path
from . import views
from rest_framework_simplejwt.views import (TokenObtainPairView,)

urlpatterns = [
    path('rooms/', views.getRooms, name="rooms"),
    path('rooms/<str:pk>', views.getRoom, name="room"),
    path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/profile/', views.getUserProfile, name="user-profile"),
    path('users/', views.getUsers, name='users'),
    path('users/register', views.registerUser, name="register-user"),
    path('rooms/search/', views.search_rooms, name='search-rooms'),
]