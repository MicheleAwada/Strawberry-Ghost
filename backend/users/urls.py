from django.urls import path,include
from . import views
from rest_framework import routers


router = routers.SimpleRouter()
router.register(r'user', views.UserViewSet)
router.register(r'verification', views.EmailVerificationViewSet)


urlpatterns = [
    path("login/", views.login.as_view()),
]

urlpatterns += router.urls