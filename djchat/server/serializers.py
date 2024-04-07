from rest_framework import serializers
from server.models import Category, Channel, Server


class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = "__all__"


class ServerSerializer(serializers.ModelSerializer):
    # same as the related name
    channel_server = ChannelSerializer(many=True)

    class Meta:
        model = Server
        fields = "__all__"
