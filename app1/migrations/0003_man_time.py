# Generated by Django 2.1.11 on 2019-08-27 01:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app1', '0002_auto_20190826_2148'),
    ]

    operations = [
        migrations.AddField(
            model_name='man',
            name='time',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
