from rest_framework import serializers
from django.conf import settings
BACKEND_URL = settings.BACKEND_URL
class FullUrlImageField(serializers.ImageField):
    def to_representation(self, value):
        if not value:
            return None

        try:
            url = value.url
            full_url = BACKEND_URL + url
            return full_url
        except AttributeError:
            return None