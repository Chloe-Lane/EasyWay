from django.urls import path, re_path
from rest_framework.routers import DefaultRouter
from base import views

router = DefaultRouter()
router.register(r'bookings', views.BookingViewSet, basename='booking')

urlpatterns = [
    # Authentication & Users
    path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/register/', views.registerUser, name="register-user"),
    path('users/profile/', views.getUserProfile, name="user-profile"),
    path('users/profile/update/', views.updateUserProfile, name='user-profile-update'),
    path('users/', views.getUsers, name='users'),

    # Rooms
    path('rooms/', views.getRooms, name="rooms"),
    path('room/<str:pk>/', views.getRoom, name="room"),
    path('rooms/search/', views.search_rooms, name='search-rooms'),
    path('room/create/', views.createRoom, name='create-room'),
    path('room/<str:room_id>/update/', views.update_room, name='update-room'),
    path('rooms/amenities/', views.get_amenities, name='amenities'),
    path('rooms/policies/', views.get_policies, name='policies'),

    # Chat
    path('chats/', views.user_chat_rooms, name='get-all-chats'),
    path('chat/<str:room_id>/', views.get_chat_messages, name='get-user-chats'),

    # Bookings
    path('booking/create/', views.create_booking, name="create-booking"),
    path('bookings/history/', views.booking_history, name="booking-history"),
    path('bookings/<str:booking_id>/pay/', views.PayBooking, name='pay-booking'),
    path('bookings/mybookings/', views.getBookings, name='user-bookings'),
    path('booking/<str:booking_id>/', views.getBooking, name='booking-details'),
    
    # Payments
    path('payment/', views.process_payment, name="process-payment"),

    path('/booking/update-payment/', views.update_payment_status, name="update-payment"),

]

# Include router URLs
urlpatterns += router.urls
