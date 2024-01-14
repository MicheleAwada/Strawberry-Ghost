from rest_framework import serializers
from django.apps import apps
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

CartItemModel = apps.get_model('products', 'CartItem')
UserModel = get_user_model()
from django.contrib.auth.models import Group
class CartSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    class Meta:
        model = CartItemModel
        fields = ("id", "quantity", "user", "variant", "product")


class MyUserSerializer(serializers.ModelSerializer):
    cartitem_set = CartSerializer(many=True, read_only=True)
    class Meta:
        model = UserModel
        fields = ("id", "email", "first_name", "last_name", "cartitem_set", "auth_token")
class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ["email", "first_name", "last_name", "password"]
    def create(self, validated_data):
        user = UserModel.objects.create_user(**validated_data)
        Token.objects.get_or_create(user=user)
        return user