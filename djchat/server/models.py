from django.conf import settings
from django.db import models
from django.dispatch import receiver
from django.shortcuts import get_object_or_404


def category_icon_upload_path(instance, filename):
    return f"category/{instance.id}/icon/{filename}"


class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    icon = models.FileField(upload_to=category_icon_upload_path, null=True, blank=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.id:
            existing_object = get_object_or_404(Category, id=self.id)
            if existing_object.icon:
                existing_object.icon.delete(save=False)
        super().save(*args, **kwargs)

    @receiver(models.signals.post_delete, sender="server.Category")
    def category_delete_icon(sender, instance, **kwargs):
        for field in instance._meta.fields:
            if field.name == "icon":
                file = getattr(instance, field.name)
                if file:
                    file.delete(save=False)


class Server(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=250, null=True)

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="server_owner")
    category = models.ManyToManyField(Category)
    member = models.ManyToManyField(settings.AUTH_USER_MODEL)

    def __str__(self):
        return self.name


class Channel(models.Model):
    name = models.CharField(max_length=100)
    topic = models.CharField(max_length=100)

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="channel_owner")
    server = models.ForeignKey(Server, on_delete=models.CASCADE, related_name="channel_server")

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.name = self.name.lower()
        super().save(*args, **kwargs)
