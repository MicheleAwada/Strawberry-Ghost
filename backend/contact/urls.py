from django.urls import path
from .views import CreateContact

urlpatterns = [
    path("contact/", CreateContact.as_view(), name="contact"),
]