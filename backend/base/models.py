from django.db import models
import os, random
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
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

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, role='user', password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        if not username:
            raise ValueError("The Username field must be set")
        
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('role', 'admin')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, username, password=password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('host', 'Host'),
        ('user', 'User'),
    ]

    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return f"{self.username} ({self.role})"
    
class Amenity(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Policy(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Room(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    _id = models.AutoField(primary_key=True)
    name = models.CharField(max_length= 200, null=True, blank=True)
    amenities = models.ManyToManyField(Amenity, related_name='rooms', blank=True)
    image = models.ImageField(upload_to=upload_image_path,null=True, blank=True)
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True)
    location = models.CharField(max_length=200, null=True, blank=True)
    policies = models.ManyToManyField(Policy, related_name='rooms', blank=True)
    description = models.TextField(null=True, blank=True)
    rating = models.DecimalField(max_digits=7, decimal_places=2, null=True)
    numReviews = models.IntegerField(null=True, blank=True, default=0)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.name

# Booking model
class Booking(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Completed", "Completed"),
        ("Cancelled", "Cancelled"),
    ]

    _id = models.AutoField(primary_key=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    email = models.EmailField()
    check_in = models.DateField()
    check_out = models.DateField()
    guests = models.PositiveIntegerField()
    payment_status = models.CharField(
        max_length=10, choices=PAYMENT_STATUS_CHOICES, default="Completed"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking {self._id} for {self.room.name} - {self.payment_status}"