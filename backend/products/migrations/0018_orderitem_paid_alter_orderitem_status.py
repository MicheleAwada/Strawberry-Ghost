# Generated by Django 5.0.1 on 2024-01-31 11:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0017_alter_orderproductitem_unique_together_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderitem',
            name='paid',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='orderitem',
            name='status',
            field=models.CharField(blank=True, default='designing', max_length=100),
        ),
    ]