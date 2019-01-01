# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-10-18 16:12
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Medium',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url', models.URLField(max_length=300)),
                ('type', models.CharField(choices=[('photo', 'Photo'), ('video', 'Video')], max_length=50)),
                ('mimetype', models.CharField(max_length=30)),
                ('deleted_at', models.DateTimeField(default=None, null=True)),
            ],
        ),
    ]