from django.db.models.signals import pre_save
from django.dispatch import receiver
from . import models
@receiver(pre_save, sender=models.Review)
def my_signal_handler(instance, *args, **kwargs):
    if not instance.purchase_date:
        try:
            purchase_date = instance.user.orderitem_set.aggregate(first_bought_on=models.Min("order_product_items__time_payed"))["first_bought_on"]
        except:
            purchase_date = None
        return purchase_date