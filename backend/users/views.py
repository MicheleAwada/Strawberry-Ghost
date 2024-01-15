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







class login(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        userdata = serializers.MyUserSerializer(user)
        # userdata.is_valid(raise_exception=True)
        return Response(userdata.data)


# google_client_id = settings.GOOGLE_CLIENT_ID
# google_secret = settings.GOOGLE_CLIENT_SECRET
google_client_id = "batata"
google_secret = "batata"
class GoogleAuth(APIView):
    def post(self, request):
        data = request.data
        token = data.get('credential')
        try:
            idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), google_client_id)

            if not (idinfo["aud"] == google_client_id == data.get("clientId")):
                raise ValidationError("Invalid client ID.")
        except:
            # Invalid token
            return Response({"status": "invalid token"}, status=400)
        else:
            userid = str(idinfo['sub'])
            email = idinfo.get('email')
            name = idinfo.get("name")
            google_users_group, created = Group.objects.get_or_create(name="google_users")


            user = google_users_group.user_set.filter(google_id=userid)
            user_exists = user.exists()
            if user_exists:# login account
                user = user.first()
            else: # create account
                user = UserModel.objects.create_user(email=email, name=name, password="",)
            return return_user_data(user)