# Generated by Django 5.1.5 on 2025-02-27 07:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_creditcard_is_default'),
    ]

    operations = [
        migrations.AddField(
            model_name='creditcard',
            name='stripe_payment_method',
            field=models.CharField(default=1, max_length=255, unique=True),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='creditcard',
            name='stripe_customer_id',
            field=models.CharField(max_length=255),
        ),
    ]
