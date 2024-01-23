from django.contrib.postgres.search import SearchRank, SearchQuery, SearchVector
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from django.apps import apps
from django.db.models import Q
Product = apps.get_model("products", "Product")

search_niche = settings.SEARCH_NICHE

@api_view(["GET"])
def search(request, query, *args, **kwargs):
        def to_pk_list(queryset):
            return Response(list(queryset.values_list("pk", flat=True)))
        if not query:
            return to_pk_list(Product.objects.none())
        search_vector = SearchVector("title", weight="A") + SearchVector("description", "variants__name", weight="B") + SearchVector("thumbnail_alt", "variants__images__alt", weight="D")
        search_query = SearchQuery(query)
        search_rank = SearchRank(search_vector, search_query)
        search_products = Product.objects.annotate(rank=search_rank).filter(rank__gte=search_niche).order_by("-rank")

        params = request.query_params
        #filters
        price_range = params.get("price_range")
        price_range = price_range.split(",") if price_range else None
        review_range = params.get("review_range")
        review_range = review_range.split(",") if review_range else None
        filter_query = Q()
        if price_range:
                filter_query &= Q(price__range=price_range)
        if review_range:
                filter_query &= Q(average_reviews_range=review_range)
        if filter_query:
                search_products = search_products.filter(filter_query)
        #sorting
        sorted = []
        def get_sort(field_name, queryname, query):
                sort = params.get(queryname, "false") == "true"
                sort = field_name if sort else None
                if sort:
                        if len(sorted) > 1:
                                raise
                        query = query.order_by(sort)
                return query
        quick_get_sort = lambda a, b: get_sort(a, b, search_products)
        search_products = quick_get_sort("-price", "price_high_to_low")
        search_products = quick_get_sort("price", "price_low_to_high")
        search_products = quick_get_sort("-variants__reviews__rating", "reviews_high_to_low")
        search_products = quick_get_sort("-created_on", "latest")

        return to_pk_list(search_products)

