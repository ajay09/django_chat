from django.conf import settings
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import Account
from .schema import user_list_docs
from .serializers import AccountSerializer, RegisterSerializer


class RegisterAPIView(APIView):
    def post(self, request, format=None):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            username = serializer.validated_data["username"]

            forbidden_usernames = "admin,root,superuser".split(",")

            if username in forbidden_usernames:
                return Response({"error": "Username not allowed"}, status=status.HTTP_409_CONFLICT)

            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            errors = serializer.errors
            if "username" in errors and "non_field_errors" not in errors:
                return Response({"error": "Username already exists"}, status=status.HTTP_409_CONFLICT)

            return Response(errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutAPIView(APIView):
    def post(self, request, format=None):
        response = Response("Logged out successfully!")

        response.set_cookie(settings.SIMPLE_JWT["ACCESS_TOKEN_NAME"], "", expires=0)
        response.set_cookie(settings.SIMPLE_JWT["REFRESH_TOKEN_NAME"], "", expires=0)

        return response


class AccountViewset(ViewSet):
    queryset = Account.objects.all()
    permission_classes = [IsAuthenticated]

    @user_list_docs
    def list(self, request):
        user_id = request.query_params.get("user_id")
        queryset = self.queryset.get(id=user_id)
        serializer = AccountSerializer(queryset)
        return Response(serializer.data)


class JWTSetCookieMixin:

    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get("access"):
            response.set_cookie(
                settings.SIMPLE_JWT["ACCESS_TOKEN_NAME"],
                response.data.get("access"),
                max_age=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
                httponly=True,
                samesite=settings.SIMPLE_JWT["JWT_COOKIE_SAMESITE"],
            )
            del response.data["access"]

        if response.data.get("refresh"):
            response.set_cookie(
                settings.SIMPLE_JWT["REFRESH_TOKEN_NAME"],
                response.data.get("refresh"),
                max_age=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
                httponly=True,
                samesite=settings.SIMPLE_JWT["JWT_COOKIE_SAMESITE"],
            )
            del response.data["refresh"]

        return super().finalize_response(request, response, *args, **kwargs)


class JWTCookieTokenRefreshView(JWTSetCookieMixin, TokenRefreshView):

    pass


class JWTCookieTokenObtainPairView(JWTSetCookieMixin, TokenObtainPairView):

    pass
