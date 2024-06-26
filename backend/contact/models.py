from django.db import models

class Contact(models.Model):
    title = models.CharField(max_length=255)
    body = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    name = models.CharField(max_length=100)

    user = models.ForeignKey("users.User", on_delete=models.CASCADE, blank=True, null=True)