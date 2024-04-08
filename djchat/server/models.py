from django.conf import settings
from django.db import models
from django.dispatch import receiver
from django.shortcuts import get_object_or_404
from server.validators import validate_icon_image_size, validate_image_file_extension


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


def server_icon_upload_path(instance, filename):
    return f"server/{instance.id}/icon/{filename}"


def server_banner_upload_path(instance, filename):
    return f"server/{instance.id}/banner/{filename}"


class Server(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=250, null=True)

    banner = models.ImageField(
        upload_to=server_banner_upload_path, null=True, blank=True, validators=(validate_image_file_extension,)
    )
    icon = models.ImageField(
        upload_to=server_icon_upload_path,
        null=True,
        blank=True,
        validators=(validate_icon_image_size, validate_image_file_extension),
    )

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="server_owner")
    category = models.ManyToManyField(Category)
    member = models.ManyToManyField(settings.AUTH_USER_MODEL)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.id:
            existing_object = get_object_or_404(Server, id=self.id)
            if existing_object.icon:
                existing_object.icon.delete(save=False)
            if existing_object.banner:
                existing_object.banner.delete(save=False)
        super().save(*args, **kwargs)

    @receiver(models.signals.post_delete, sender="server.Server")
    def category_delete_icon(sender, instance, **kwargs):
        for field in instance._meta.fields:
            if field.name == "icon" or field.name == "banner":
                file = getattr(instance, field.name)
                if file:
                    file.delete(save=False)


class Channel(models.Model):
    name = models.CharField(max_length=100)
    topic = models.CharField(max_length=100)

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="channel_owner")
    server = models.ForeignKey(Server, on_delete=models.CASCADE, related_name="channel_server")

    def __str__(self):
        return self.name
