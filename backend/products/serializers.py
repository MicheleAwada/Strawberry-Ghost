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
    image_crop_x = serializers.IntegerField(write_only=True)
    image_crop_y = serializers.IntegerField(write_only=True)
    image_crop_width = serializers.IntegerField(write_only=True)
    image_crop_height = serializers.IntegerField(write_only=True)
    for_update_id = serializers.IntegerField(write_only=True, required=False)
    class Meta:
        fields = ["id", "for_update_id", "image", "alt", "image_crop_x", "image_crop_y", "image_crop_width", "image_crop_height"]
        model = models.VariantImage
    def create(self, validated_data):
        #img crop
        oldImage = validated_data.get("image")
        x = validated_data.pop("image_crop_x")
        y = validated_data.pop("image_crop_y")
        width = validated_data.pop("image_crop_width")
        height = validated_data.pop("image_crop_height")

        img = Image.open(oldImage)
        newImage = img.crop((x, y, x + width, y + height))
        newImageFormat = img.format.lower()

        buffer = io.BytesIO()
        newImage.save(buffer, format=newImageFormat)
        buffer.seek(0)

        validated_data["image"].file = buffer
        return super().create(validated_data)

class VariantSerializer(serializers.ModelSerializer):
    images = VariantImageSerializer(many=True, read_only=False)

    for_update_id = serializers.IntegerField(write_only=True, required=False)
    class Meta:
        fields = ["id", "for_update_id", "color", "name", "images"]
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

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images')
        instance = super().update(instance, validated_data)

        existing_images_ids = [image.id for image in instance.images.all()]

        new_added_images_id = []


        for image_data in images_data:
            image_id = image_data.get('for_update_id', None)
            if image_id in existing_images_ids:
                image = instance.images.get(id=image_id)

                image_serializer = VariantImageSerializer(image, data=image_data, partial=True)
            else:
                image_serializer = VariantImageSerializer(data=image_data)

            image_serializer.is_valid(raise_exception=True)
            new_instance = image_serializer.save(variant=instance)
            new_added_images_id.append(new_instance.id)


        for image in instance.images.all():
            if image.id not in new_added_images_id:
                image.delete()


        return instance
class ProductSerializer(serializers.ModelSerializer):
    variants = VariantSerializer(many=True, read_only=False)
    class Meta:
        fields = ["id", "slug", "title", "frequentlyBoughtTogether", "description", "price", "variants", "thumbnail", "thumbnail_crop_x", "thumbnail_crop_y", "thumbnail_crop_width", "thumbnail_crop_height"]
        model = models.Product
    def validate_variants(self, value):
        if not (len(value) > 0):
            raise serializers.ValidationError("Number of variants must be more than 0.")
        return value
    def validate(self, attrs):
        attrs = super().validate(attrs)
        #img crop
        oldThumbnail = attrs.get("thumbnail", None)
        if oldThumbnail is None:
            return attrs
        x = attrs.pop("thumbnail_crop_x")
        y = attrs.pop("thumbnail_crop_y")
        width = attrs.pop("thumbnail_crop_width")
        height = attrs.pop("thumbnail_crop_height")

        img = Image.open(oldThumbnail)
        newThumbnail = img.crop((x, y, x + width, y + height))
        newThumbnailFormat = img.format.lower()

        buffer = io.BytesIO()
        newThumbnail.save(buffer, format=newThumbnailFormat)
        buffer.seek(0)

        attrs["thumbnail"].file = buffer

        return attrs

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

