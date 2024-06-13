# Generated by Django 5.0.1 on 2024-01-31 10:14

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0016_variant_stock'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='orderproductitem',
            unique_together=set(),
        ),
        migrations.AlterField(
            model_name='orderitem',
            name='status',
            field=models.CharField(blank=True, default='unpaid', max_length=100),
        ),
        migrations.AlterField(
            model_name='orderproductitem',
            name='order',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='order_product_items', to='products.orderitem'),
        ),
    ]
