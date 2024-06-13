# Generated by Django 5.0.1 on 2024-02-07 18:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0020_product_thumbnail_alt_alter_variantimage_alt'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='orderitem',
            options={'ordering': ['-time_created', '-id']},
        ),
        migrations.AddField(
            model_name='orderitem',
            name='info',
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='product',
            name='recommended_products',
            field=models.ManyToManyField(blank=True, editable=False, to='products.product'),
        ),
        migrations.AlterField(
            model_name='orderitem',
            name='paid',
            field=models.BooleanField(blank=True, default=False),
        ),
        migrations.AlterField(
            model_name='product',
            name='removed',
            field=models.BooleanField(blank=True, default=False),
        ),
        migrations.AlterField(
            model_name='product',
            name='thumbnail_alt',
            field=models.CharField(blank=True, default='Thumbnail Image', max_length=250),
        ),
        migrations.AlterField(
            model_name='variant',
            name='removed',
            field=models.BooleanField(blank=True, default=False),
        ),
        migrations.AlterField(
            model_name='variant',
            name='stock',
            field=models.IntegerField(blank=True, default=0),
        ),
        migrations.AlterField(
            model_name='variantimage',
            name='alt',
            field=models.CharField(blank=True, max_length=250),
        ),
    ]
