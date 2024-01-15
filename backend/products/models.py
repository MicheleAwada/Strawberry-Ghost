from django.db import models

# Create your models here.
class Product(models.Model):
    title = models.CharField(max_length=750)
    description = models.TextField()
    thumbnail = models.ImageField()
    frequentlyBoughtTogether = models.ManyToManyField("self", blank=True)
    price = models.DecimalField(decimal_places=2, max_digits=20)
    slug = models.SlugField(max_length=100, unique=True, blank=False)

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

class AbstractOrderItem(models.Model):
    quantity = models.IntegerField()
    product = models.ForeignKey("products.Product", on_delete=models.CASCADE)
    variant = models.ForeignKey("products.Variant", on_delete=models.CASCADE)
    user = models.ForeignKey("users.User", on_delete=models.CASCADE)


    class Meta:
        abstract = True
        unique_together = [["user", "variant"]]

class CartItem(AbstractOrderItem):
    saveForLater = models.BooleanField(default=False, blank=True)


class OrderProductItem(AbstractOrderItem):
    order = models.ForeignKey("products.OrderItem", on_delete=models.CASCADE)

class OrderItem(models.Model):
    time_created = models.DateTimeField(auto_now_add=True)
    status = models.CharField(default="designing", blank=True, max_length=100)
    def get_user(self):
        return self.order_set.first().user

