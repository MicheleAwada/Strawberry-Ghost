from django.contrib import admin
from . import models


admin.site.register(models.Product)
admin.site.register(models.CartItem)

class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("time_created", "status", "paid")
    list_filter = ("time_created", "status", "paid")
    search_fields = ("status",)

admin.site.register(models.OrderItem, OrderItemAdmin)
admin.site.register(models.OrderProductItem)



admin.site.register(models.VariantImage)
admin.site.register(models.Variant)