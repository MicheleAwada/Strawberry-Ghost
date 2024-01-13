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

class Variant(models.Model):
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7, default=None, null=True, blank=True)
    default = models.BooleanField(default=False, blank=True)
    product = models.ForeignKey("products.Product", on_delete=models.CASCADE, related_name="variants")


class VariantImage(models.Model):
    image = models.ImageField()
    alt = models.CharField(max_length=100, default="Image for Variant", blank=True)
    variant = models.ForeignKey("products.Variant", on_delete=models.CASCADE, related_name="images")

