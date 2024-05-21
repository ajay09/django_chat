from typing import Any, Dict

from django.conf import settings
from rest_framework.serializers import ModelSerializer, ValidationError
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer

from .models import Account


class RegisterSerializer(ModelSerializer):
    class Meta:
        model = Account
        fields = ("username", "password")

    def validate(self, attrs):
        try:
            Account.objects.get(username=attrs["username"])
            raise ValidationError("username already exists")
        except Account.DoesNotExist:
            pass

        return super().validate(attrs)

    def create(self, validated_data):
        return Account.objects.create_user(**validated_data)


class AccountSerializer(ModelSerializer):
    class Meta:
        model = Account
        fields = ("username",)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def get_token(self, user):
        token = super().get_token(user)

        token["example"] = "custom_field"

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        data["user_id"] = self.user.id

        return data


class JWTCookieTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = None

    def validate(self, attrs):
        attrs["refresh"] = self.context["request"].COOKIES.get(settings.SIMPLE_JWT["REFRESH_TOKEN_NAME"])

        if attrs["refresh"]:
            return super().validate(attrs)
        else:
            raise InvalidToken("No valid refresh token found.")
