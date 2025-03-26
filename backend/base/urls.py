from django.urls import path
from . import views
from rest_framework_simplejwt.views import (TokenObtainPairView,)
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import create_booking, BookingViewSet, booking_history

router = DefaultRouter()
router.register(r'bookings', BookingViewSet, basename='booking')

urlpatterns = [
    path('rooms/', views.getRooms, name="rooms"),
    path('rooms/<str:pk>', views.getRoom, name="room"),
    path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/profile/', views.getUserProfile, name="user-profile"),
    path('users/', views.getUsers, name='users'),
    path('users/register', views.registerUser, name="register-user"),
    path('rooms/search/', views.search_rooms, name='search-rooms'),
    path('rooms/create/', views.createRoom, name='create-room'),
    path('rooms/amenities/', views.get_amenities, name='amenities'),
    path('rooms/policies/', views.get_policies, name='policies'),
    path('bookings/', create_booking, name="create-booking"),
    path("bookings/history/", booking_history, name="booking-history"),
    path('api/', include(router.urls)),
]