# Generated by Django 5.0.4 on 2024-04-13 09:34

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
                ('role', models.CharField(choices=[('manager', 'manager'), ('member', 'member')], max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('task_id', models.AutoField(primary_key=True, serialize=False)),
                ('task_name', models.CharField(max_length=100)),
                ('deadline', models.DateTimeField()),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='taskapp.project')),
            ],
        ),
        migrations.CreateModel(
            name='Subtask',
            fields=[
                ('subtask_id', models.AutoField(primary_key=True, serialize=False)),
                ('description', models.TextField()),
                ('status', models.CharField(choices=[('completed', 'Completed'), ('ongoing', 'Ongoing')], max_length=20)),
                ('task', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='taskapp.task')),
            ],
        ),
        migrations.AddField(
            model_name='project',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='taskapp.user'),
        ),
        migrations.CreateModel(
            name='UserSubtask',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subtask', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='taskapp.subtask')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='taskapp.user')),
            ],
            options={
                'unique_together': {('user', 'subtask')},
            },
        ),
    ]