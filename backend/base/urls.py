from django.urls import path, re_path
from . import views



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
    path('rooms/<str:room_id>/update/', views.update_room, name='update-room'),
    path('chats/', views.user_chat_rooms, name='get-all-chats'),
    path('chat/<str:room_id>/', views.get_chat_messages, name='get-user-chats')	
]
