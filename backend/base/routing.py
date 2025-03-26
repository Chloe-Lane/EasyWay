from django.urls import re_path
from .consumers import ChatConsumer
import base.routing

websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<room_name>[a-zA-Z0-9_]+)/$", ChatConsumer.as_asgi()),
]
