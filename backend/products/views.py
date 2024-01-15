from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .serializers import ProductSerializer
from .models import Product
from drf_nested_forms.utils import NestedForm

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