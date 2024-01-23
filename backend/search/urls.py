from django.urls import path
from . import views

urlpatterns = [
    path("search/<str:query>/", views.search, name="search"),
]