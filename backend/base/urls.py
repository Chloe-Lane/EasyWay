from django.urls import path
from . import views, rooms

urlpatterns = [
    path('', views.getRoutes, name="routes"),
    path('rooms/', views.getRooms, name="rooms"),
    path('rooms/<str:pk>', views.getRoom, name="room"),
]
