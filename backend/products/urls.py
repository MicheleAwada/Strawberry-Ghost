from django.urls import path, include

from rest_framework.routers import SimpleRouter
from .views import ProductViewSet, CartViewSet, OrderViewSet

router = SimpleRouter()
router.register(r"product", ProductViewSet)
router.register(r"cart", CartViewSet)



urlpatterns = [
    path("orders/", OrderViewSet.as_view()),
]

urlpatterns += router.urls