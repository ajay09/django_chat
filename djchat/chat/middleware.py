import jwt
from channels.db import database_sync_to_async
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser


@database_sync_to_async
def get_user(scope):
    token = scope.get("token", None)
    if token is None:
        return AnonymousUser()
    User = get_user_model()
    try:
        user_id = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])["user_id"]
        return User.objects.get(id=user_id)
    except (jwt.exceptions.DecodeError, User.DoesNotExist):
        return AnonymousUser()


class JWTAuthMiddleware:

    #  The app is the asgi/wsgi app instance
    def __init__(self, app) -> None:
        self.app = app

    async def __call__(self, scope, recieve, send):
        headers = dict(scope["headers"])
        cookies_str = headers.get(b"cookie", b"").decode()
        cookies = {cookie.split("=")[0].strip(): cookie.split("=")[1].strip() for cookie in cookies_str.split(";")}
        access_token = cookies.get(settings.SIMPLE_JWT["ACCESS_TOKEN_NAME"])

        scope["token"] = access_token
        scope["user"] = await get_user(scope)

        return await self.app(scope, recieve, send)
