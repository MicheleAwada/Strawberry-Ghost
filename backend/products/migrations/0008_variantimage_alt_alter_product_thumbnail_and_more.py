# Generated by Django 5.0.1 on 2024-01-13 09:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0007_product_thumbnail'),
    ]

    operations = [
        migrations.AddField(
            model_name='variantimage',
            name='alt',
            field=models.CharField(default=1, max_length=100),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='product',
            name='thumbnail',
            field=models.ImageField(default=1, upload_to=''),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='variantimage',
            name='image',
            field=models.ImageField(upload_to=''),
        ),
    ]
