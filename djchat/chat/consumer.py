import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer
from django.conf import settings
from django.contrib.auth import get_user_model

from .models import ChannelConversation, Message

User = get_user_model()


class ChatConsumer(JsonWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.channel_id = None
        self.user = None

    def connect(self):
        # Called on connection.
        # To accept the connection call:
        self.accept()
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            self.close(code=4001)
            return

        self.channel_id = self.scope.get("url_route")["kwargs"]["channel_id"]
        self.user = User.objects.get(id=1)

        async_to_sync(self.channel_layer.group_add)(
            self.channel_id,
            self.channel_name,
        )

    def receive_json(self, content):
        conversation, _ = ChannelConversation.objects.get_or_create(channel_id=self.channel_id)
        msg = Message.objects.create(
            conversation=conversation,
            sender=self.user,
            content=content,
        )

        async_to_sync(self.channel_layer.group_send)(
            self.channel_id,
            {
                "type": "chat.message",
                "new_message": {
                    "id": msg.id,
                    "sender": msg.sender.username,
                    "content": msg.content,
                    "timestamp": msg.created_at.isoformat(),
                },
            },
        )

    def chat_message(self, event):
        self.send_json(event)

    def disconnect(self, close_code):
        try:
            async_to_sync(self.channel_layer.group_discard)(self.channel_id, self.channel_name)
        except TypeError:
            pass
        super().disconnect(close_code)
