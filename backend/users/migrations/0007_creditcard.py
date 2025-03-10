# Generated by Django 5.1.5 on 2025-02-26 11:12

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_organizer'),
    ]

    operations = [
        migrations.CreateModel(
            name='CreditCard',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('stripe_customer_id', models.CharField(max_length=255, unique=True)),
                ('last4', models.CharField(max_length=4)),
                ('exp_month', models.IntegerField()),
                ('exp_year', models.IntegerField()),
                ('brand', models.CharField(max_length=50)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='creditcard', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
