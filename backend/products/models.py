from django.db import models

# Create your models here.
class Product(models.Model):
    title = models.CharField(max_length=750)
    description = models.TextField()
    thumbnail = models.ImageField()
    frequentlyBoughtTogether = models.ManyToManyField("self", blank=True)
    price = models.DecimalField(decimal_places=2, max_digits=20)


    def is_in_cart(self, user):
        return user.cart.filter(product=self).exists()
