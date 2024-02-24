import io
import math
from rest_framework import serializers
from . import models
from django.apps import apps
from PIL import Image
import os.path
from io import StringIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.conf import settings
from review.serializers import ReadReviewSerializer
from .models import CartItem, OrderItem, OrderProductItem
from django.db import models as django_db_models
from .utils import editImage
from .serializers_fields import FullUrlImageField
UserModel = get_user_model()

MEDIA_ROOT = settings.MEDIA_ROOT

CartItemModel = apps.get_model('products', 'CartItem')
class OrderProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderProductItem
        fields = ["product", "variant", "quantity"]
class OrderSerializer(serializers.ModelSerializer):
    order_product_items = OrderProductSerializer(many=True, required=False)
    time_created = serializers.DateTimeField(format="%B %d %Y")
    price = serializers.SerializerMethodField()
    def get_price(self, obj):
        return obj.total_cost()
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['order_product_items'] = [d for d in data['order_product_items'] if not ((variant:=models.Variant.objects.get(id=d['variant'])).removed or variant.product.removed)]
        return data

    class Meta:
        model = OrderItem
        fields = ["status", "paid", "price", "time_created", "order_product_items"]
class CartSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        model = CartItemModel
        fields = ("id", "quantity", "user", "variant", "product", "saveForLater")
    def validate_variant(self, variant):
        if variant.removed or variant.product.removed: raise serializers.ValidationError("removed")
        return variant
    def validate(self, attrs):
        super().validate(attrs)
        instance = self.instance
        variant = attrs.get("variant", getattr(instance, "variant", None))
        product = attrs.get("product", getattr(instance, "product", None))
        quantity = attrs.get("quantity", getattr(instance, "quantity", None))
        if variant is None or product is None or quantity is None: raise serializers.ValidationError("variant, product and quantity are required")
        if variant.product != product:
            raise serializers.ValidationError("variant must belong to product")
        if variant.stock < quantity: raise serializers.ValidationError("not enough stock")
        if quantity <= 0: raise serializers.ValidationError("quantity must be greater than 0")
        return attrs
# class UpdateCartSerializer(serializers.ModelSerializer):
#
#     class Meta:
#         model = CartItemModel
#         fields = ("id", "quantity", "saveForLater")


# base_image_operation = lambda size: lambda image: image.resize((w:=(int(min(size, image.width))), int(w/(4/3)) ))
# variant_image_operation = base_image_operation(2600)
# thumbnail_image_operation = base_image_operation(400)

def base_image_operation(size):
    def upper_operation(cropInfo):
        def nested_operation(image):
            image = image.convert("RGB")
            image = image.crop(cropInfo)
            min_size = (int(min(size, image.width)))
            image = image.resize((min_size, int(min_size / (4 / 3))))
            return image

        return nested_operation
    return upper_operation


variant_image_operation = base_image_operation(2600)

thumbnail_image_operation = base_image_operation(400)

class VariantImageSerializer(serializers.ModelSerializer):
    image_crop_x = serializers.IntegerField(write_only=True)
    image_crop_y = serializers.IntegerField(write_only=True)
    image_crop_width = serializers.IntegerField(write_only=True)
    image_crop_height = serializers.IntegerField(write_only=True)

    for_update_id = serializers.IntegerField(write_only=True, required=False)
    image = FullUrlImageField()
    class Meta:
        fields = ["id", "for_update_id", "image", "alt", "image_crop_x", "image_crop_y", "image_crop_width", "image_crop_height"]
        model = models.VariantImage
    def create(self, validated_data):
        cropInfo = [validated_data.pop(f'image_crop_{v}', None) for v in ["x", "y", "width", "height"]]
        cropInfoExists = not any(x is None for x in cropInfo)
        image_exists = validated_data.get("image") is not None
        if cropInfoExists != image_exists:
            raise serializers.ValidationError("image and crop info must match")
        instance = super().create(validated_data)
        if image_exists and cropInfoExists:
            cropInfo[2] += cropInfo[0]
            cropInfo[3] += cropInfo[1]
            editImage(instance.image, variant_image_operation(cropInfo))
        return instance
    def update(self, instance, validated_data):
        cropInfo = [validated_data.pop(f'image_crop_{v}', None) for v in ["x", "y", "width", "height"]]
        cropInfoExists = not any(x is None for x in cropInfo)
        image_exists = validated_data.get("image") is not None
        if cropInfoExists != image_exists:
            raise serializers.ValidationError("image and crop info must match")

        instance = super().update(instance, validated_data)
        if image_exists and cropInfoExists:
            cropInfo[2] += cropInfo[0]
            cropInfo[3] += cropInfo[1]
            editImage(instance.image, variant_image_operation(cropInfo))
        return instance

class VariantSerializer(serializers.ModelSerializer):
    images = VariantImageSerializer(many=True, read_only=False, required=True, partial=True)

    for_update_id = serializers.IntegerField(write_only=True, required=False)

    # average_rating = serializers.SerializerMethodField(read_only=True)
    #
    # def get_average_rating(self, obj):
    #     return obj.reviews.aggregate(average_rating=django_db_models.Avg("rating"))["average_rating"]

    posted_review = serializers.SerializerMethodField(read_only=True)

    def get_posted_review(self, obj):
        user = self.context["request"].user
        if not user.is_authenticated: return None
        review = user.reviews.filter(variant=obj)
        if review.exists():
            review = review.first()
            review = ReadReviewSerializer(review)
            return review.data
        return None

    can_review = serializers.SerializerMethodField(read_only=True)
    def get_can_review(self, obj):
        user = self.context["request"].user
        has_bought = user.is_authenticated and user.has_bought_variant(obj)
        has_reviewed = user.is_authenticated and user.has_reviewed_variant(obj)
        #PROD
        # return (has_bought and not )
        return not has_reviewed
    class Meta:
        fields = ["id", "removed", "stock", "for_update_id", "posted_review", "can_review", "color", "name", "images"]
        model = models.Variant

    def validate_images(self, images):
        if not (len(images) > 0):
            raise serializers.ValidationError("Number of images must be more than 0.")
        # if self.context["request"].method != "POST": #updating product
        #     for image in images:
        #         if id:=image.get("for_update_id") is not None:
        #             instance = models.VariantImage.objects.get(pk=id)
        #             serializer = VariantImageSerializer(instance, data=image, partial=True)
        #         else:
        #             serializer = VariantImageSerializer(data=image)
        #         serializer.is_valid(raise_exception=True)
        return images

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
                if image.variant != instance:
                    raise serializers.ValidationError("Image must belong to the same variant")
                image_serializer = VariantImageSerializer(image, data=image_data, partial=True)
            else:
                image_serializer = VariantImageSerializer(data=image_data)

            image_serializer.is_valid(raise_exception=True)
            new_instance = image_serializer.save(variant=instance)
            new_added_images_id.append(new_instance.id)


        for image in instance.images.all():
            if image.id not in new_added_images_id:
                image.delete()

        CartItem.objects.all().filter(variant__stock__lte=0).delete()

        return instance




class ProductSerializer(serializers.ModelSerializer):
    variants = VariantSerializer(many=True, read_only=False, required=True)
    thumbnail_crop_x = serializers.IntegerField(write_only=True)
    thumbnail_crop_y = serializers.IntegerField(write_only=True)
    thumbnail_crop_width = serializers.IntegerField(write_only=True)
    thumbnail_crop_height = serializers.IntegerField(write_only=True)


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

