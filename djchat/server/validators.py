import os

from django.core.exceptions import ValidationError
from PIL import Image


def validate_icon_image_size(image):
    if image:
        with Image.open(image) as img:
            if img.width > 70 or img.height > 70:
                raise ValidationError("The maximum allowed dimension is 70x70.")


def validate_image_file_extension(value):
    ext = os.path.splittext(value.name)[1]
    valid_extensions = (".jpg", ".jpeg", "gif", "png")
    if not ext.lower() in valid_extensions:
        raise ValidationError(f"Unsupported file extension. Please use one of the following files {valid_extensions}")
