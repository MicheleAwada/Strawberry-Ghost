from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.apps import apps
from rest_framework import mixins
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from . import serializers
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
from . import models
from rest_framework.authtoken.models import Token

from django.core.mail import send_mail

from django.conf import settings
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated

from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from rest_framework import generics

UserModel = get_user_model()
ProductModel = apps.get_model('products', 'Product')

def return_user_data(user):
    Token.objects.get_or_create(user=user)
    userdata = serializers.MyUserSerializer(user)
    return Response(userdata.data)
class UserViewSet(mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.ListModelMixin, GenericViewSet):
    serializer_class = serializers.MyUserSerializer
    queryset = UserModel.objects.all()
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        return return_user_data(request.user)
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return return_user_data(user)


    def get_serializer_class(self, *args, **kwargs):
        if self.action == 'create':
            return serializers.CreateUserSerializer
        return self.serializer_class
    def get_permissions(self):
        if self.action == 'create':
            return []
        return super().get_permissions()

class EmailVerificationViewSet(mixins.CreateModelMixin, GenericViewSet):
    serializer_class = serializers.EmailVerificationSerializer
    queryset = models.EmailVerification.objects.all()


class login(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        Token.objects.get_or_create(user=user)
        userdata = serializers.MyUserSerializer(user)
        return Response(userdata.data)


GOOGLE_CLIENT_ID = settings.GOOGLE_CLIENT_ID

class GoogleAuth(APIView):
    def post(self, request):
        data = request.data
        token = data.get('credential')
        print("new request")
        print(token)
        try:
            idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)

            if not (idinfo["aud"] == GOOGLE_CLIENT_ID == data.get("clientId")):
                raise ValidationError("Invalid client ID.")
        except:
            # Invalid token
            return Response({"status": "invalid token"}, status=400)
        else:
            userid = str(idinfo['sub'])
            email = idinfo.get('email')
            name = idinfo.get('name').split(" ")
            first_name = name[0] or ""
            last_name = name[1] or ""
            email_verified = idinfo.get('email_verified', False)
            if email_verified==False:
                return Response({"status": "email not verified"}, status=400)
            google_users_group, created = Group.objects.get_or_create(name="google_users")


            user = google_users_group.user_set.filter(google_id=userid)
            user_exists = user.exists()
            if user_exists:# login account
                user = user.first()
            else: # create account
                if UserModel.objects.filter(email=email).exists():
                    return Response({"status": "Email already exists (for a non google account)"}, status=400)
                user = UserModel.objects.create_user(email=email, password="", first_name=first_name, last_name=last_name, google_id=userid) # empty "" password is never equal to a password
                user.groups.add(google_users_group)
            return return_user_data(user)



@api_view(['PUT'])
def reset_password(request):
    user = get_object_or_404(UserModel, email=request.data.get('email'))
    serializer = serializers.ResetPasswordSerializer(instance=user, data=request.data, partial=False)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    return return_user_data(user)




class ChangePasswordView(APIView):
    def post(self, request):
        user = request.user
        serializer = serializers.ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            if not user.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=HTTP_400_BAD_REQUEST)
            user.set_password(serializer.data.get("password"))
            user.save()
            return Response({"status": "success"}, status=HTTP_200_OK)

        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)