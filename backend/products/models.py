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
    product = models.ForeignKey("products.Product", on_delete=models.CASCADE, related_name="variants")
    removed = models.BooleanField(default=False, blank=True)
    stock = models.IntegerField(default=0, blank=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.removed:
            CartItem.objects.filter(variant=self).delete()
        else:
            CartItem.objects.all().filter(variant__stock__lt=models.F("quantity")).delete()

class VariantImage(models.Model):
    image = models.ImageField(upload_to="variants_images/%Y/%m/%d")
    alt = models.CharField(max_length=250, blank=True)
    variant = models.ForeignKey("products.Variant", on_delete=models.CASCADE, related_name="images")

class AbstractOrderItem(models.Model):
    quantity = models.IntegerField()
    product = models.ForeignKey("products.Product", on_delete=models.CASCADE)
    variant = models.ForeignKey("products.Variant", on_delete=models.CASCADE)
    user = models.ForeignKey("users.User", on_delete=models.CASCADE)

    @property
    def author(self):
        return self.user
    class Meta:
        abstract = True
        unique_together = [["user", "variant"]]

class CartItem(AbstractOrderItem):
    saveForLater = models.BooleanField(default=False, blank=True)


class OrderProductItem(AbstractOrderItem):
    order = models.ForeignKey("products.OrderItem", on_delete=models.CASCADE, related_name="order_product_items")

class OrderItem(models.Model):
    time_created = models.DateTimeField(auto_now_add=True)
    time_payed = models.DateTimeField(null=True, blank=True)
    status = models.CharField(default="unpaid", blank=True, max_length=100)
    paid = models.BooleanField(default=False, blank=True)
    info = models.JSONField(null=True, blank=True)
    user = models.ForeignKey("users.User", on_delete=models.CASCADE)

    @property
    def author(self):
        return self.user
    def money_paid(self, info):
        self.status = "designing"
        self.paid = True
        self.time_payed = timezone.now()
        self.info = info
        self.save()
        user = self.user
        user.cartitem_set.all().delete()
    def total_cost(self):
        cost = 0
        for order_product_item in self.order_product_items.all():
            cost += order_product_item.quantity * order_product_item.product.price
        return int(cost*100)/100

    class Meta:
        ordering = ["-time_created", "-id"]


