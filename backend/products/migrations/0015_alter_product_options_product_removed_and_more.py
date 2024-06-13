# Generated by Django 5.0.1 on 2024-01-23 15:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0014_product_created_on'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='product',
            options={'ordering': ['-created_on', 'title', '-id']},
        ),
        migrations.AddField(
            model_name='product',
            name='removed',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='variant',
            name='removed',
            field=models.BooleanField(default=False),
        ),
    ]
