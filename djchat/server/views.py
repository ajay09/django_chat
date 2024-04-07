from django.db.models import Count
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from server.models import Server
from server.schema import server_list_docs
from server.serializers import ServerSerializer


@server_list_docs
class ServerListViewSet(ViewSet):
    queryset = Server.objects.all()
    serializer_class = ServerSerializer

    def list(self, request):
        category = request.query_params.get("category", None)
        qty = request.query_params.get("qty", None)
        by_user = request.query_params.get("by_user", "").lower() == "true"
        id = request.query_params.get("id", None)
        with_num_members = request.query_params.get("with_num_members", "").lower() == "true"

        if by_user or id and not request.user.is_authenticated:
            raise AuthenticationFailed("You must login first.")

        if category:
            self.queryset = self.queryset.filter(category__name=category)

        if by_user:
            self.queryset = self.queryset.filter(member=request.user)

        if id:
            try:
                self.queryset = self.queryset.filter(id=id)
                if not self.queryset.exists():
                    raise ValidationError(detail=f"Server with id, {id}, not found.")
            except ValueError:
                raise ValidationError(detail=f"Invalid id: {id}")

        if with_num_members:
            self.queryset = self.queryset.annotate(num_members=Count("member"))

        if qty and isinstance(int(qty), int):
            self.queryset = self.queryset[: int(qty)]

        serializer = ServerSerializer(self.queryset, many=True, context={"with_num_members": with_num_members})
        return Response(serializer.data)
