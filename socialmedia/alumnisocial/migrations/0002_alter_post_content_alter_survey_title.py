# Generated by Django 5.0.6 on 2024-06-17 15:23

import ckeditor.fields
import ckeditor_uploader.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('alumnisocial', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='content',
            field=ckeditor.fields.RichTextField(),
        ),
        migrations.AlterField(
            model_name='survey',
            name='title',
            field=ckeditor_uploader.fields.RichTextUploadingField(null=True),
        ),
    ]
