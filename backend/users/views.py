from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.apps import apps
from rest_framework import mixins
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from . import serializers
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
UserModel = get_user_model()
ProductModel = apps.get_model('products', 'Product')
from django.conf import settings
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated

from google.auth.transport import requests as google_requests
from google.oauth2 import id_token

class CartViewSet(mixins.CreateModelMixin, mixins.DestroyModelMixin, GenericViewSet):
    serializer_class = serializers.CartSerializer

class UserViewSet(mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.ListModelMixin, GenericViewSet):
    serializer_class = serializers.MyUserSerializer
    queryset = UserModel.objects.all()
    permission_classes = [IsAuthenticated]


    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        userdata = serializers.MyUserSerializer(user)
        return Response(userdata.data)


    def get_serializer_class(self, *args, **kwargs):
        if self.action == 'create':
            return serializers.CreateUserSerializer
        return self.serializer_class
    def get_permissions(self):
        if self.action == 'create':
            return []
        return super().get_permissions()





