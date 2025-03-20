from django.db import models
from django.contrib.auth import get_user_model
import os, random

# Create your models here.

def get_filename_ext(filepath):
    base_name = os.path.basename(filepath)
    name, ext = os.path.splitext(base_name)
    return name, ext

def upload_image_path(instance, filename):
    new_filename = random.randint(1, 2541781232)
    name, ext = get_filename_ext(filename)
    final_filename = f"{new_filename}{ext}"
    return "img/{new_filename}/{final_filename}".format(new_filename=new_filename, final_filename=final_filename)

User = get_user_model()

class Room(models.Model):
    _id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    image = models.ImageField(upload_to=upload_image_path,null=True, blank=True)
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True)
    location = models.CharField(max_length=200, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    rating = models.DecimalField(max_digits=7, decimal_places=2, null=True)
    numReviews = models.IntegerField(null=True, blank=True, default=0)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.name
