# Generated by Django 5.0.1 on 2024-02-06 11:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0012_alter_user_last_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='payment_info',
        ),
        migrations.DeleteModel(
            name='UserPayment',
        ),
    ]
