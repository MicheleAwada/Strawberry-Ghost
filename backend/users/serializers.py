from rest_framework import serializers
from django.apps import apps
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from . import models
from django.core.mail import send_mail

from rest_framework.exceptions import ValidationError

from django.core.validators import validate_email

CartItemModel = apps.get_model('products', 'CartItem')
UserModel = get_user_model()
from django.contrib.auth.models import Group
class SimpleCartSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItemModel
        fields = ("id", "quantity", "variant", "product")


class MyUserSerializer(serializers.ModelSerializer):
    cartitem_set = SimpleCartSerializer(many=True, read_only=True)
    class Meta:
        model = UserModel
        fields = ("id", "email", "first_name", "last_name", "cartitem_set", "auth_token")
class CreateUserSerializer(serializers.ModelSerializer):
    email_verification_code = serializers.CharField(max_length=100, required=True)
    class Meta:
        model = UserModel
        fields = ["email", "first_name", "last_name", "password", "email_verification_code"]
    def validate(self, attrs):
        email = attrs["email"]
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
        10
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