# Generated by Django 5.0.1 on 2024-01-13 13:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0008_variantimage_alt_alter_product_thumbnail_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='variantimage',
            name='image',
            field=models.CharField(max_length=100),
        ),
    ]
