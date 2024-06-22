from django.urls import path
from .views import ReviewViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"reviews", ReviewViewSet)

urlpatterns = []
urlpatterns += router.urls