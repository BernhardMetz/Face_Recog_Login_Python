from django.db import models

# Create your models here.
class Man(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, null=False)
    password = models.CharField(max_length=128, null=False)
    time = models.DateTimeField(auto_now=True)

