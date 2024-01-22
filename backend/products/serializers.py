from rest_framework import serializers
from . import models
from django.apps import apps

CartItemModel = apps.get_model('products', 'CartItem')
class CartSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    def validate(self, attrs):
        variant = attrs.get("variant")
        product = attrs.get("product")

        if variant not in product.variants.all():
            raise serializers.ValidationError("Variant does not belong to product.")
        return attrs


    class Meta:
        model = CartItemModel
        fields = ("id", "quantity", "user", "variant", "product")
class VariantImageSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ["id", "image", "alt"]
        model = models.VariantImage

class VariantSerializer(serializers.ModelSerializer):
    images = VariantImageSerializer(many=True, read_only=False)

    class Meta:
        fields = ["id", "color", "name", "default", "images"]
        model = models.Variant

    def validate_images(self, value):
        if not (len(value) > 0):
            raise serializers.ValidationError("Number of images must be more than 0.")
        return value

    def create(self, validated_data):
        images_data = validated_data.pop('images')
        variant = models.Variant.objects.create(**validated_data)
        image_serializer = VariantImageSerializer(data=images_data, many=True)
        image_serializer.is_valid(raise_exception=True)
        image_serializer.save(variant=variant)
        return variant

class ProductSerializer(serializers.ModelSerializer):
    variants = VariantSerializer(many=True, read_only=False)
    class Meta:
        fields = ["id", "slug", "title", "description", "price", "thumbnail", "variants", "frequentlyBoughtTogether"]
        model = models.Product
    def validate_variants(self, value):
        if not (len(value) > 0):
            raise serializers.ValidationError("Number of variants must be more than 0.")
        return value

    def create(self, validated_data):
        variants_data = validated_data.pop('variants')
        frequentlyBoughtTogether_data = validated_data.pop('frequentlyBoughtTogether', [])
        product = models.Product.objects.create(**validated_data)
        for product_fbt in frequentlyBoughtTogether_data:
            product.frequentlyBoughtTogether.add(product_fbt)

        variant_serializer = VariantSerializer(data=variants_data, many=True)
        variant_serializer.is_valid(raise_exception=True)
        variant_serializer.save(product=product)
        return product
    def update(self, instance, validated_data):
        variants_data = validated_data.pop('variants', [])
        instance = super().update(instance, validated_data)

        existing_variant_ids = [variant.id for variant in instance.variants.all()]

        new_added_variant_id = []

        for variant_data in variants_data:
            variant_id = variant_data.get('for_update_id', None)

            if variant_id in existing_variant_ids:
                variant = instance.variants.get(id=variant_id)

                variant_serializer = VariantSerializer(variant, data=variant_data, partial=True)
            else:
                variant_serializer = VariantSerializer(data=variant_data)

            variant_serializer.is_valid(raise_exception=True)
            variant_serializer.save(product=instance)

        for variant in instance.variants.all():
            if variant.id not in new_added_variant_id:
                variant.delete()


        return instance

