from django.contrib import admin
from . import models


admin.site.register(models.Product)
admin.site.register(models.CartItem)
admin.site.register(models.OrderProductItem)
admin.site.register(models.OrderItem)
admin.site.register(models.VariantImage)
admin.site.register(models.Variant)