from django.contrib import admin
from .models import Contact

# Register your models here.
class ContactAdmin(admin.ModelAdmin):
    list_display = ("title", "email", "name")
    list_filter = ("title", "email", "name")
    list_display_links = ("title", "email", "name")

admin.site.register(Contact, ContactAdmin)