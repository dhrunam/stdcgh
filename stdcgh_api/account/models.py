# from turtle import update
from django.db import models
from django.contrib.auth.models import User
from stdcgh_api.configuration.models import (
    Property
)

# Create your models here.
class UserProfile(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='related_profile')

    property = models.ForeignKey(
        Property, on_delete=models.SET_NULL, null=True, related_name='user_of_property', blank=True)

    contact_number = models.CharField(max_length=12, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)