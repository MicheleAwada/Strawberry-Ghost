from django.urls import path, include

from rest_framework.routers import SimpleRouter
from .views import ProductViewSet, CartViewSet

router = SimpleRouter()
router.register(r"product", ProductViewSet)
router.register(r"cart", CartViewSet)


urlpatterns = [
]

urlpatterns += router.urls