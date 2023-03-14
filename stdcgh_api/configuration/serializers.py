import datetime
from rest_framework import serializers
from stdcgh_api.account import models as acc_model
from django.contrib.auth.models import (User, Group)
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction, connection
from stdcgh_api.configuration import models

class RoomCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.RoomCategory
        fields = [
                    'id', 
                    'name', 

                ]

class HelperPropertySerializer(serializers.ModelSerializer):
    # related_room = HelperRoomSerializer(source='rooms.all', many=True,read_only=True)
  

    class Meta:
        model = models.Property
        fields = [
                    'id', 
                    'name', 
                    'short_name',
                    'code',
                    'address',
                    'description',
                    'is_operational'
                    # 'related_room'

                ]


class RoomSerializer(serializers.ModelSerializer):
    related_property = HelperPropertySerializer(source='property', read_only=True)
    related_category = RoomCategorySerializer(source='room_category', read_only=True)
    class Meta:
        model = models.Room
        fields = [
                    'id', 
                    'property', 
                    'room_category',
                    'room_no',
                    'occupancy',
                    'description',
                    'is_operational',
                    'related_property',
                    'related_category'

                ]
class LeanRoomSerializer(serializers.ModelSerializer):
    
    related_category = RoomCategorySerializer(source='room_category', read_only=True)
    class Meta:
        model = models.Room
        fields = [
                    'id', 
                    'property', 
                    'room_category',
                    'room_no',
                    'occupancy',
                    'description',
                    'is_operational',

                    'related_category'

                ]
class HelperRoomSerializer(serializers.ModelSerializer):
    # related_property = PropertySerializer(source='property', read_only=True)
    related_category = RoomCategorySerializer(source='room_category', read_only=True)
    class Meta:
        model = models.Room
        fields = [
                    'id', 
                    'property', 
                    'room_category',
                    'room_no',
                    'occupancy',
                    'description',
                    'is_operational',
                    # 'related_property',
                    'related_category'

                ]
class PropertySerializer(serializers.ModelSerializer):
    related_room = HelperRoomSerializer(source='rooms.all', many=True,read_only=True)
  

    class Meta:
        model = models.Property
        fields = [
                    'id', 
                    'name', 
                    'short_name',
                    'code',
                    'address',
                    'description',
                    'is_operational',
                    'related_room'

                ]

class LeanPropertySerializer(serializers.ModelSerializer):
    

    class Meta:
        model = models.Property
        fields = [
                    'id', 
                    'name', 
                    'short_name',
                    'code',
                    'address',
                    'description',
                    'is_operational',


                ]


class RoomRateSerializer(serializers.ModelSerializer):
    related_property = PropertySerializer(source='property', read_only=True)
    related_room = RoomSerializer(source='room', read_only=True)
    class Meta:
        model = models.RoomRate
        fields = [
                    'id', 
                    'property', 
                    'room',
                    'cost',
                    'start_date',
                    'end_date',
                    'related_property',
                    'related_room'

                ]
    def validate(self, attrs):


        today=datetime.date.today()
        if attrs['start_date'] > attrs['end_date']:
            raise serializers.ValidationError(
                {"start_date": "Start date  cannot be greater than End date."})

        if attrs['start_date'] < today:
            raise serializers.ValidationError(
                {"start_date": "Start date  cannot be less than today's date."})

        if attrs['end_date'] < today:
            raise serializers.ValidationError(
                {"end_date": "End date  cannot be less than today's date."})

        room_rates=models.RoomRate.objects.filter(property=attrs['property'],room=attrs['room'],start_date__lte=attrs['start_date'], end_date__gte=attrs['start_date'])
        
        if room_rates and room_rates.count()>0:

            raise serializers.ValidationError(
                {"start_date": "Rate already configured in this date range."})

        room_rates=models.RoomRate.objects.filter(property=attrs['property'],room=attrs['room'], start_date__lte=attrs['end_date'], end_date__gte=attrs['end_date'])
        
        if room_rates and room_rates.count()>0:

            raise serializers.ValidationError(
                {"end_date": "Rate already configured in this date range."})

        room_rates=models.RoomRate.objects.filter(property=attrs['property'],room=attrs['room'], start_date__gte=attrs['start_date'], end_date__lte=attrs['end_date'])
        
        if room_rates and room_rates.count()>0:

            raise serializers.ValidationError(
                {
                    "start_date": "Rate already configured in this date range.",
                    "end_date": "Rate already configured in this date range."
                    
                })

        

        return attrs

    

class ApplicableTaxDetailsSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = models.ApplicableTaxDetails
        fields = [
                    'id', 
                    'lower_limit', 
                    'upper_limit',
                    'cgst_percentage',
                    'sgst_percentage',
                    'service_tax_percentage',
                    'start_date',
                    'end_date',
                    'is_applicable',

                ]
    
    
    
    def validate(self, attrs):


        today=datetime.date.today()
        if attrs['lower_limit'] > attrs['uppler_limit']:
            raise serializers.ValidationError(
                {"lower_limit": "Lower Limit  cannot be greater than Upper Limit."})

        if attrs['start_date'] > attrs['end_date']:
            raise serializers.ValidationError(
                {"start_date": "Start date  cannot be greater than End date."})

        if attrs['start_date'] < today:
            raise serializers.ValidationError(
                {"start_date": "Start date  cannot be less than today's date."})

        if attrs['end_date'] < today:
            raise serializers.ValidationError(
                {"end_date": "End date  cannot be less than today's date."})

        applicable_tax=models.ApplicableTaxDetails.objects.filter(start_date__lte=attrs['start_date'],
            end_date__gte=attrs['start_date']).filter(lower_limit__lte=attrs['lower_limit'],
            upper_limit__gte=attrs['lower_limit'])

        
        if applicable_tax and applicable_tax.count()>0:

            raise serializers.ValidationError(
                {"start_date": "Rate already configured in this date range."})

        applicable_tax=models.ApplicableTaxDetails.objects.filter(start_date__lte=attrs['end_date'], 
            end_date__gte=attrs['end_date']).filter(lower_limit__lte=attrs['uppler_limit'], 
            upper_limit__gte=attrs['upper_limit'])
        
        if applicable_tax and applicable_tax.count()>0:

            raise serializers.ValidationError(
                {"end_date": "Rate already configured in this date range."})

        applicable_tax=models.ApplicableTaxDetails.objects.filter( start_date__gte=attrs['start_date'],
            end_date__lte=attrs['end_date']).filter(lower_limit__gte=attrs['lower_limit'],
            upper_limit__lte=attrs['upper_limit'])
        
        if applicable_tax and applicable_tax.count()>0:

            raise serializers.ValidationError(
                {
                    "start_date": "Rate already configured in this date range.",
                    "end_date": "Rate already configured in this date range."
                    
                })

        

        return attrs

    