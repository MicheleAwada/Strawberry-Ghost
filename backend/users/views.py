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
from PIL import Image
from django.core.mail import send_mail

from django.conf import settings
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from . import permissions

from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from rest_framework import generics
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from django.core.files.base import ContentFile
import requests

UserModel = get_user_model()
ProductModel = apps.get_model('products', 'Product')

def return_user_data(user, request):
    # Token.objects.get_or_create(user=user)
    userdata = serializers.MyUserSerializer(user, context={'request': request})
    return Response(userdata.data)
@api_view(['POST'])
def delete_user(request):
    if not request.user.is_authenticated:
        raise ValidationError("Not authenticated")
    serializer = serializers.CheckPasswordUserSerializer(instance=request.user, data=request.data, partial=False)
    serializer.is_valid(raise_exception=True)
    request.user.delete()
    return Response(status=204)

class UserViewSet(mixins.CreateModelMixin, mixins.UpdateModelMixin, mixins.ListModelMixin, GenericViewSet):
    serializer_class = serializers.MyUserSerializer
    queryset = UserModel.objects.all()
    permission_classes = [IsAuthenticated, permissions.IsUserOrNone]
    def list(self, request, *args, **kwargs):
        instance = request.user
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return return_user_data(user, request)
    # def update(self, request, *args, **kwargs):
    #     # partial = kwargs.pop('partial', False)
    #     # instance = request.user
    #     # serializer = self.get_serializer(instance, data=request.data, partial=partial)
    #     # serializer.is_valid(raise_exception=True)
    #     # user = serializer.save()
    #     return return_user_data(user)
    def get_serializer_class(self):
        if self.action == 'create':
            return serializers.CreateUserSerializer
        if self.action == 'destroy':
            return serializers.CheckPasswordUserSerializer
        return super().get_serializer_class()
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.NotAuthenticated()]
        return super().get_permissions()

class EmailVerificationViewSet(mixins.CreateModelMixin, GenericViewSet):
    serializer_class = serializers.EmailVerificationSerializer
    queryset = models.EmailVerification.objects.all()

@api_view(['POST'])
def login(request):
    def wrong_email_or_password():
        return Response({"non_field_errors": ["Wrong email or password."]}, status=HTTP_400_BAD_REQUEST)
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        user = get_object_or_404(UserModel, email=email)
    except:
        return wrong_email_or_password()
    if not user.check_password(password): return wrong_email_or_password()
    return return_user_data(user, request)



GOOGLE_CLIENT_ID = settings.GOOGLE_CLIENT_ID
def add_image_from_url(obj, image_field_name, image_url):
    response = requests.get(image_url)

    if response.status_code != 200:
        return False
    image_content = ContentFile(response.content)
    try:
        img = Image.open(image_content)
        img.verify()
    except:
        return False


    # Save the image to the image field
    image_field = getattr(obj, image_field_name)
    image_field.save(
        'google user image.png',
        image_content,
        save=True
    )
class GoogleAuth(APIView):
    def post(self, request):
        data = request.data
        token = data.get('credential')
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
                return Response({"status": "Google's email not verified"}, status=400)
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

                picture_url = idinfo.get("picture", None)
                if picture_url is not None:
                    add_image_from_url(user, "avatar", picture_url)
            return return_user_data(user, request)



@api_view(['PUT'])
def reset_password(request):
    user = get_object_or_404(UserModel, email=request.data.get('email'))
    serializer = serializers.ResetPasswordSerializer(instance=user, data=request.data, partial=False,
                                                     context={"request": request})
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    return return_user_data(user, request)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated, permissions.IsUserOrNone]


    def put(self, request):
        user = request.user
        serializer = serializers.ChangePasswordSerializer(instance=user, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return return_user_data(user, request)
class ChangeEmailView(APIView):
    permission_classes = [IsAuthenticated, permissions.IsUserOrNone]
    def put(self, request):
        user = request.user
        serializer = serializers.ChangeEmailSerializer(instance=user, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return return_user_data(user, request)