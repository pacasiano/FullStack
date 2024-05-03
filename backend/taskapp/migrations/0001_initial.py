# Generated by Django 5.0.4 on 2024-05-02 01:05

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('project_id', models.AutoField(primary_key=True, serialize=False)),
                ('project_name', models.CharField(max_length=100)),
                ('background', models.CharField(default='#000000', max_length=255)),
                ('isStarred', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Subtask',
            fields=[
                ('subtask_id', models.AutoField(primary_key=True, serialize=False)),
                ('subtask_name', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('end_date', models.DateTimeField()),
                ('start_date', models.DateTimeField()),
                ('order_num', models.SmallIntegerField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('user_id', models.AutoField(primary_key=True, serialize=False)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('username', models.CharField(max_length=50, unique=True)),
                ('password', models.CharField(max_length=100)),
                ('first_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Label',
            fields=[
                ('label_id', models.AutoField(primary_key=True, serialize=False)),
                ('label_name', models.CharField(max_length=100)),
                ('color', models.CharField(max_length=7)),
                ('subtask_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='taskapp.subtask')),
            ],
        ),
        migrations.CreateModel(
            name='Attachment',
            fields=[
                ('attachment_id', models.AutoField(primary_key=True, serialize=False)),
                ('filename', models.CharField(max_length=255)),
                ('subtask_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='taskapp.subtask')),
            ],
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('task_id', models.AutoField(primary_key=True, serialize=False)),
                ('task_name', models.CharField(max_length=100)),
                ('color', models.CharField(max_length=7)),
                ('order_num', models.SmallIntegerField(blank=True, null=True)),
                ('project_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='taskapp.project')),
            ],
        ),
        migrations.AddField(
            model_name='subtask',
            name='task_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='taskapp.task'),
        ),
        migrations.CreateModel(
            name='UserProject',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role', models.CharField(choices=[('manager', 'manager'), ('member', 'member')], max_length=50)),
                ('project_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='taskapp.project')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='taskapp.user')),
            ],
        ),
        migrations.CreateModel(
            name='UserSubtask',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subtask_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='taskapp.subtask')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='taskapp.user')),
            ],
            options={
                'unique_together': {('user_id', 'subtask_id')},
            },
        ),
    ]
