from django.urls import re_path
from base.consumers import ChatConsumer

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_id>\d+_\d+)/$', ChatConsumer.as_asgi()),
]