from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Contact
from .serializers import ContactSerializer
class CreateContact(APIView):
    def post(self, request):
        serializer = ContactSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Contact created successfully"}, status=201)