from django.contrib.auth import get_user_model
from django.db import models


class ChannelConversation(models.Model):
    channel_id = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)


class Message(models.Model):
    conversation = models.ForeignKey(ChannelConversation, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
