from django.urls import path,include
from . import views
from rest_framework import routers


router = routers.SimpleRouter()
router.register(r'user', views.UserViewSet)
router.register(r'verification', views.EmailVerificationViewSet)


urlpatterns = [
    path("login/", views.login),
    path("reset_password/", views.reset_password),
    path("google_login/", views.GoogleAuth.as_view()),
    path("change_password/", views.ChangePasswordView.as_view()),
    path("change_email/", views.ChangeEmailView.as_view()),
    path("delete_user/", views.delete_user),
]

urlpatterns += router.urls