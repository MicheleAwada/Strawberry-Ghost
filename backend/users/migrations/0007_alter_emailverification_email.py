# Generated by Django 5.0.1 on 2024-01-16 09:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_alter_emailverification_email'),
    ]

    operations = [
        migrations.AlterField(
            model_name='emailverification',
            name='email',
            field=models.EmailField(max_length=254, unique=True),
        ),
    ]
