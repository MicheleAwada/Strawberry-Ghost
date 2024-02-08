from rest_framework import serializers
from django.apps import apps
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from . import models
from django.core.mail import send_mail

from rest_framework.exceptions import ValidationError

from django.core.validators import validate_email
from django.contrib.auth.password_validation import validate_password

CartItemModel = apps.get_model('products', 'CartItem')
UserModel = get_user_model()
from django.contrib.auth.models import Group
class SimpleCartSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItemModel
        fields = ("id", "quantity", "variant", "product")


class MyUserSerializer(serializers.ModelSerializer):
    cartitem_set = SimpleCartSerializer(many=True, read_only=True)

    avatar_crop_data_x = serializers.IntegerField(min_value=0, max_value=2<<14, write_only=True)
    avatar_crop_data_y = serializers.IntegerField(min_value=0, max_value=2<<14, write_only=True)
    avatar_crop_data_w = serializers.IntegerField(min_value=0, max_value=2<<14, write_only=True)
    avatar_crop_data_h = serializers.IntegerField(min_value=0, max_value=2<<14, write_only=True)
    avatar = FullUrlImageField()
    def validate(self, attrs):
        attrs = super().validate(attrs)
        avatar_crop_data = [attrs.pop(f"avatar_crop_data_{x}", None) for x in ["x", "y", "w", "h"]]
        avatar_crop_data_exists = avatar_crop_data is not None and all((x is not None) for x in avatar_crop_data)
        if avatar_crop_data_exists:
            avatar_crop_data[2] += avatar_crop_data[0]
            avatar_crop_data[3] += avatar_crop_data[1]
        attrs["avatar_crop_data"] = avatar_crop_data
        image = attrs.get(f"avatar", None)
        image_exists = image is not None
        if image_exists != avatar_crop_data_exists:
            raise serializers.ValidationError("avatar_crop_data is required if avatar is provided and vice versa")
        return attrs

    def update(self, instance, validated_data):
        avatar_crop_data = validated_data.pop(f"avatar_crop_data")
        image = validated_data.get("avatar", None)
        image_exists = image is not None
        if image_exists: instance.avatar.delete(save=False)
        instance = super().update(instance, validated_data)
        if image_exists:
            def smaller_image(image):
                image = image.convert("RGB")
                image = image.crop(avatar_crop_data)
                min_size = min(image.height, image.width)
                image = image.crop((0, 0, min_size, min_size))
                min_size = min(min_size, 400)
                image = image.resize((min_size, min_size))
                return image
            editImage(instance.avatar, smaller_image)
        return instance
    def to_representation(self, instance):
        # Token.objects.get_or_create(user=self.instance)
        ret = super().to_representation(instance)
        return ret
    class Meta:
        model = UserModel
        fields = ("id", "email", "first_name", "last_name", "cartitem_set", "auth_token")
class CreateUserSerializer(serializers.ModelSerializer):
    email_verification_code = serializers.CharField(max_length=100, required=True)
    agreed_to_terms = serializers.BooleanField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    def validate_agreed_to_terms(self, value):
        if not value:
            raise serializers.ValidationError("You must agree to the terms and conditions")
        return value
    class Meta:
        model = UserModel
        fields = ["email", "first_name", "agreed_to_terms", "last_name", "password", "email_verification_code"]
    def validate(self, attrs):
        email = attrs["email"]
        assert attrs.pop("agreed_to_terms", False) == True
        email_verification_code = attrs.pop("email_verification_code")
        email_validation = models.EmailVerification.objects.get(email=email)
        if not email_validation.is_valid(token=email_verification_code):
            raise ValidationError("Invalid verification code")
        return attrs
    def create(self, validated_data):
        user = UserModel.objects.create_user(**validated_data)
        Token.objects.get_or_create(user=user)
        return user


def get_old_emails_attempts(email, remove=True):
    prev_attempts = 0
    for oldobj in models.EmailVerification.objects.filter(email=email):
        prev_attempts += oldobj.attempts
        oldobj.delete()
    return prev_attempts

class EmailVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.EmailVerification
        fields = ["email"]
    def validate(self, attrs):
        email = attrs["email"]
        if get_old_emails_attempts(email)>30:
            raise ValidationError("Too many attempts, please contact us")
        return attrs
    def create(self, validated_data):
        email = validated_data["email"]
        prev_attempts = get_old_emails_attempts(email)

        object = models.EmailVerification.objects.create(email=email, attempts=prev_attempts)
        token = object.generate_token()
        object.save()
        object.is_valid_to_mail()
        send_mail(
            "Strawberry Ghost verification code",
            f"Your 6 digit verification code for strawberry ghost is {token}, psst don't share this with anyone",
            "info@strawberryghost.com",
            [email],
            fail_silently=False,
        )
        return object

class ResetPasswordSerializer(serializers.ModelSerializer):
    email_verification_code = serializers.CharField(max_length=100, required=True)
    class Meta:
        model = models.User
        fields = ["email", "password", "email_verification_code"]
    def validate(self, attrs):
        email = attrs["email"]
        email_verification_code = attrs.pop("email_verification_code")
        email_validation = models.EmailVerification.objects.get(email=email)
        if not email_validation.is_valid(token=email_verification_code):
            raise ValidationError("Invalid verification code")
        return attrs
    def update(self, instance, validated_data):
        instance.set_password(validated_data["password"])
        instance.save()
        return instance



class ChangePasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    old_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = UserModel
        fields = ('old_password', 'password', 'password2')


    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError({"old_password": "Old password is not correct"})
        return value

    def update(self, instance, validated_data):

        instance.set_password(validated_data['password'])
        instance.save()

        return instance