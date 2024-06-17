from rest_framework import serializers
from .models import Review
from django.apps import apps
from django.contrib.auth import get_user_model
from .utils import is_valid_rating


UserModel = get_user_model()
Variant = apps.get_model("products", "Variant")

class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ["avatar", "first_name", "last_name"]

class ReadReviewSerializer(serializers.ModelSerializer):
    user = SimpleUserSerializer(read_only=True)
    class Meta:
        model = Review
        fields = "__all__"
class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    def validate_variant(self, variant):
        user = self.context["request"].user

        #PROD
        # if not user.has_bought_variant(variant):
        #     raise serializers.ValidationError("You need to buy this product to review it")
        return variant
    def validate_rating(self, rating):
        return is_valid_rating(rating, errorToRaise=serializers.ValidationError)
    def validate(self, attrs):
        print(attrs)
        return super().validate(attrs)
    class Meta:
        model = Review
        fields = "__all__"