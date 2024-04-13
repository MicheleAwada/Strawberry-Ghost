from django.db.models.signals import post_save
from django.dispatch import receiver
from . import models

@receiver(post_save, sender=models.Product)
def my_signal_handler(sender, instance, created, **kwargs):
    if created:
        products_len = len(models.Product.objects.all())
        number_of_products = max(4, min(products_len/3, 24))
        instance.recommended_products.set(models.Product.objects.order_by('?')[:number_of_products])
    if instance.removed:
        models.CartItem.objects.filter(product=instance).delete()
        instance.__class__.objects.all().filter(frequentlyBoughtTogether__in=[instance]).delete()