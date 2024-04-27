from django.contrib import admin

from .models import ChannelConversation, Message

admin.site.register(ChannelConversation)
admin.site.register(Message)
