from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .serializers import ProductSerializer
from .models import Product
from drf_nested_forms.utils import NestedForm

from rest_framework import mixins
from rest_framework.viewsets import GenericViewSet
from . import serializers, permissions
from rest_framework import permissions as drf_permissions
from django.apps import apps

from users.serializers import MyUserSerializer


CartItemModel = apps.get_model('products', 'CartItem')

class CartViewSet(viewsets.ModelViewSet):
    queryset = CartItemModel.objects.all()
    serializer_class = serializers.CartSerializer
    permission_classes = [drf_permissions.IsAuthenticated, permissions.IsAuthorOrNone]
    def filter_queryset(self, queryset):
        if self.action == "list":
            return queryset.filter(user=self.request.user)
        return super().filter_queryset(queryset)
    def create(self, request, *args, **kwargs):
        super().create(request, *args, **kwargs)
        userdata = MyUserSerializer(request.user)
        return Response(userdata.data, status=status.HTTP_201_CREATED)
    def update(self, request, *args, **kwargs):
        super().update(request, *args, **kwargs)
        userdata = MyUserSerializer(request.user)
        return Response(userdata.data, status=status.HTTP_200_OK)
    def partial_update(self, request, *args, **kwargs):
        super().partial_update(request, *args, **kwargs)
        userdata = MyUserSerializer(request.user)
        return Response(userdata.data, status=status.HTTP_200_OK)
    def destroy(self, request, *args, **kwargs):
        super().destroy(request, *args, **kwargs)
        userdata = MyUserSerializer(request.user)
        return Response(userdata.data, status=status.HTTP_200_OK)

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()
    permission_classes = [permissions.IsStaffOrReadOnly]
    lookup_field = "slug"
    def create(self, request, *args, **kwargs):

        form = NestedForm(request.data)
        form.is_nested(raise_exception=True)
        form.data["variants"][0]["images"][0]["image"] = request.data.get("variants[0][images][0][image]")

        serializer = self.get_serializer(data=form.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)