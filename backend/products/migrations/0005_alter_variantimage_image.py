# Generated by Django 5.0.1 on 2024-01-13 08:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0004_product_price'),
    ]

    operations = [
        migrations.AlterField(
            model_name='variantimage',
            name='image',
            field=models.CharField(max_length=8),
        ),
    ]