from rest_framework import mixins
from rest_framework.response import Response
from django.db.models import Q
from .models import Review
from . import serializers
from .utils import is_valid_rating
from rest_framework.exceptions import ValidationError
from . import permissions
from rest_framework.viewsets import GenericViewSet

class ReviewViewSet(mixins.UpdateModelMixin,
                    mixins.CreateModelMixin,
                    mixins.ListModelMixin,
                    mixins.DestroyModelMixin,
                    GenericViewSet
                ):
    permission_classes = [permissions.IsUserOrReadOnly]
    serializer_class = serializers.ReviewSerializer
    queryset = Review.objects.all()
    def filter_queryset(self, queryset):
        params = self.request.query_params
        queryset = super().filter_queryset(queryset)
        if self.action != "list": return queryset
        variantid = params.get('variantid')
        productslug = params.get('productslug')
        ratinglte = params.get('ratinglte')
        ratinggte = params.get('ratinggte')
        if productslug is None and variantid is None:
            raise ValidationError("product is required")
        filter_query = Q()
        if variantid:
            variantid = int(variantid)
            filter_query &= Q(variant=variantid)
        else:
            filter_query &= Q(variant__product__slug=productslug)
        validate_rating = lambda rating: is_valid_rating(rating, errorToRaise=ValidationError)
        if ratinglte:
            ratinglte = float(ratinglte)
            validate_rating(ratinglte)
            filter_query &= Q(rating__lte=ratinglte)
        if ratinggte:
            ratinggte = float(ratinggte)
            validate_rating(ratinggte)
            filter_query &= Q(rating__gte=ratinggte)
        return (super().filter_queryset(queryset)).filter(filter_query)
    def get_serializer_class(self):
        if self.action == "list":
            return serializers.ReadReviewSerializer
        return super().get_serializer_class()