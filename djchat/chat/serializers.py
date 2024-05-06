import ast

from rest_framework import serializers

from .models import Message


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.StringRelatedField()

    class Meta:
        model = Message
        fields = "__all__"

    def to_representation(self, instance):
        message = super().to_representation(instance)
        message["content"] = ast.literal_eval(message["content"])
        return message
