from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from .models import ChannelConversation
from .schema import list_message_docs
from .serializers import MessageSerializer


class MessageViewSet(ViewSet):

    @list_message_docs
    def list(Self, request):
        channel_id = request.query_params.get("channel_id")
        conversation = ChannelConversation.objects.get(channel_id=channel_id)
        messages = conversation.messages.all()

        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
