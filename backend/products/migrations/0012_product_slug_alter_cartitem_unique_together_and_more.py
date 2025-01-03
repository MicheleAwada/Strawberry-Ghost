# Generated by Django 5.0.1 on 2024-01-15 15:37

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0011_alter_cartitem_saveforlater_alter_orderitem_status_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='slug',
            field=models.SlugField(default='batata', max_length=100, unique=True),
            preserve_default=False,
        ),
        migrations.AlterUniqueTogether(
            name='cartitem',
            unique_together={('user', 'variant')},
        ),
        migrations.AlterUniqueTogether(
            name='orderproductitem',
            unique_together={('user', 'variant')},
        ),
    ]
