from rest_framework import serializers
from . import models


class VariantImageSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ["id", "image", "alt"]
        model = models.VariantImage

class VariantSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ["id", "color", "name", "default", "images"]
        model = models.Variant

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ["id", "title", "description", "price", "thumbnail"]
        model = models.Product