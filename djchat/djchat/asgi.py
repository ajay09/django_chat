"""
ASGI config for djchat project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "djchat.settings")
django_application = get_asgi_application()

from . import urls  # noqa isort:skip
from chat.middleware import JWTAuthMiddleware  # noqa isort:skip

application = ProtocolTypeRouter(
    {
        "http": django_application,
        "websocket": JWTAuthMiddleware(URLRouter(urls.websocket_urlpatterns)),
    }
)


# uvicorn djchat.asgi:application --port 8000 --workers 4 --log-level debug --reload
