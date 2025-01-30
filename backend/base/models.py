from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.

User = get_user_model()

class Room(models.Model):
    _id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    image = models.CharField(max_length=200, null=True, blank=True)
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True)
    location = models.CharField(max_length=200, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    rating = models.DecimalField(max_digits=7, decimal_places=2, null=True)
    numReviews = models.IntegerField(null=True, blank=True, default=0)

    def __str__(self):
        return self.name
