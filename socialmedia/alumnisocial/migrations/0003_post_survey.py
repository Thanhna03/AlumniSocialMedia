# Generated by Django 5.0.6 on 2024-06-17 15:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('alumnisocial', '0002_alter_post_content_alter_survey_title'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='survey',
            field=models.ManyToManyField(to='alumnisocial.survey'),
        ),
    ]