from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from .models import Account
from .schema import user_list_docs
from .serializers import AccountSerializer


class AccountViewset(ViewSet):
    queryset = Account.objects.all()

    @user_list_docs
    def list(self, request):
        user_id = request.query_params.get("user_id")
        queryset = self.queryset.get(id=user_id)
        serializer = AccountSerializer(queryset)
        return Response(serializer.data)
