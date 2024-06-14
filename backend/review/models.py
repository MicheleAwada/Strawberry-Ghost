from django.db import models

class Review(models.Model):
    body = models.CharField(max_length=3000)
    user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="reviews")
    variant = models.ForeignKey("products.Variant", on_delete=models.CASCADE, related_name="reviews")
    rating = models.DecimalField(max_digits=2, decimal_places=1)

    created_on = models.DateTimeField(auto_now_add=True)
    purchase_date = models.DateField(null=True, blank=True)

    class Meta:
        unique_together = ("user", "variant")