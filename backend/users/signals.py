from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
UserModel = get_user_model()
@receiver(post_save, sender=UserModel)
def my_signal_handler(instance, *args, **kwargs):
    Token.objects.get_or_create(user=instance)