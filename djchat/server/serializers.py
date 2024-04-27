from typing import Optional

from rest_framework import serializers
from server.models import Category, Channel, Server


class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = "__all__"


class ServerSerializer(serializers.ModelSerializer):
    num_members = serializers.SerializerMethodField()
    # same as the related name
    channel_server = ChannelSerializer(many=True)
    category = serializers.StringRelatedField(many=True)

    class Meta:
        model = Server
        exclude = ("member",)

    def get_num_members(self, obj) -> Optional[int]:
        if hasattr(obj, "num_members"):
            return obj.num_members
        return None

    def to_representation(self, instance):
        output = super().to_representation(instance)
        if not self.context.get("with_num_members", False):
            output.pop("num_members")
        return output


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = "__all__"
