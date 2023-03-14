import datetime
from rest_framework import serializers
from stdcgh_api.account import models as acc_model
from django.contrib.auth.models import (User, Group)
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction, connection
from stdcgh_api.operation import models
from stdcgh_api.configuration import models as conf_model
from stdcgh_api.configuration import serializers as conf_serializers

class HelperRoomSearchSerializer(serializers.ModelSerializer):
    related_category = conf_serializers.RoomCategorySerializer(source='room_category', read_only=True)
    class Meta:
        model = conf_model.Room
        fields = [
                    'id', 
                    'property', 
                    'room_category',
                    'room_no',
                    'occupancy',
                    'description',
                    'is_operational',
                    'related_category',

                ]

class MiscellaneousServiceChargeDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model= models.MiscellaneousServiceChargeDetails
        fields=[
            'reservation',
            'particular',
            'cost',
            'start_date',
            'end_date',
            'cgst_rate',
            'sgst_rate',
            'other_cess_rate',
            'remarks'

        ]
class ReservationRoomDetailsSerializer(serializers.ModelSerializer):
    related_room=conf_serializers.LeanRoomSerializer(source='room',read_only=True)
    class Meta:
        model = models.ReservationRoomDetails
        fields = [
                    'id', 
                    'reservation', 
                    'property',
                    'room',
                    'room_rate',
                    'checkin_date',
                    'checkout_date',
                    'no_adult',
                    'no_child',
                    'cgst_rate',
                    'sgst_rate',
                    'other_cess_rate',
                    'status',
                    'related_room',

                ]


class HelperCheckInCheckOutSerializer(serializers.ModelSerializer):
    # related_property = conf_serializers.HelperPropertySerializer(source='property', read_only=True)
    # related_category = conf_serializers.RoomCategorySerializer(source='room_category', read_only=True)
    # cost = serializers.DecimalField(max_digits=8, decimal_places=2,  read_only=True)
    related_room = HelperRoomSearchSerializer(source='room', read_only=True)
    class Meta:
        model = models.GuestCheckInCheckOutDetails
        fields = [
                    'id', 
                    'reservation',
                    'property',
                    'room',
                    'lead_guest',
                    'no_adult',
                    'no_child',
                    'address',
                    'contact_no',
                    'checkin_date',
                    'checkout_date',
                    'remarks',
                    'related_room',


                ]




class ReservationDetailsSerializer(serializers.ModelSerializer):
    reservation_room_details = ReservationRoomDetailsSerializer(source='reservation_room_details.all', many=True,read_only=True)
    related_property= conf_serializers.LeanPropertySerializer(source='property', read_only=True)
    # model2s = Model2Serializer(source='model3s.all.model2', many=True)
    related_services = MiscellaneousServiceChargeDetailsSerializer(source='miscellaneous_service_charge.all', many=True,read_only=True)
    related_checkin_rooms=HelperCheckInCheckOutSerializer(source='guest_checkin_check_out.all', many=True,read_only=True)
    
    class Meta:
        model = models.ReservationDetails
        fields = [
                    'id', 
                    'property',
                    'reservation_no', 
                    'lead_guest_name',
                    'reservation_for',
                    'reservation_from',
                    'address',
                    'contact_no',
                    'remarks',
                    'checkin_date',
                    'checkout_date',
                    'total_room_cost',
                    'discount',
                    'is_bill_generated',
                    'is_payment_received',
                    'status',
                    'created_at',
                    'reservation_room_details',
                    'related_property',
                    'related_services',
                    'related_checkin_rooms'

                ]
        
    def validate(self, attrs):
        today=datetime.date.today()
        if 'checkin_date' in attrs and 'checkout_date' in attrs:

            if attrs['checkin_date'] > attrs['checkout_date']:
                raise serializers.ValidationError(
                    {"checkin_date": "Checkin date  cannot be greater than Checkout date."})

            if attrs['checkin_date'] < today:
                raise serializers.ValidationError(
                    {"checkin_date": "Checkin date  cannot be less than today's date."})

        return attrs 
    
    def partial_update(self, instance, validated_data):
        # remove the required fields from the validated data
        for field in self.Meta.required_fields:
            if field in validated_data:
                del validated_data[field]
        return super().partial_update(instance, validated_data)





class RoomSearchSerializer(serializers.ModelSerializer):
    related_property = conf_serializers.HelperPropertySerializer(source='property', read_only=True)
    related_category = conf_serializers.RoomCategorySerializer(source='room_category', read_only=True)
    cost = serializers.DecimalField(max_digits=8, decimal_places=2,  read_only=True)
    class Meta:
        model = conf_model.Room
        fields = [
                    'id', 
                    'property', 
                    'room_category',
                    'room_no',
                    'occupancy',
                    'description',
                    'is_operational',
                    'related_property',
                    'related_category',
                    'cost'

                ]

class CheckInCheckOutSerializer(serializers.ModelSerializer):
    # related_property = conf_serializers.HelperPropertySerializer(source='property', read_only=True)
    # related_category = conf_serializers.RoomCategorySerializer(source='room_category', read_only=True)
    # related_room = RoomSearchSerializer(source='room', read_only=True)
    class Meta:
        model = models.GuestCheckInCheckOutDetails
        fields = [
                    'id', 
                    'reservation',
                    'property',
                    'room',
                    'lead_guest',
                    'no_adult',
                    'no_child',
                    'address',
                    'contact_no',
                    'checkin_date',
                    'checkout_date',
                    'remarks',


                ]



class ReservationBillSerializer(serializers.ModelSerializer):
    related_reservarion=ReservationDetailsSerializer(source='reservation', read_only=True)
    class Meta:
        model= models.ReservationBillDetails
        fields=[
            'bill_no',
            'reservation',
            'property',
            'total_room_cost',
            'total_service_cost',
            'discount',
            'refund',
            'cgst_rate',
            'sgst_rate',
            'other_cess_rate',
            'remarks',
            'related_reservarion'

        ]
    
    def validate(self, attrs):

        reservation = models.ReservationDetails.objects.get(pk=attrs['reservation'].id)

        if reservation.is_bill_generated:
            raise serializers.ValidationError(
                {"reservation": "Bill already generated for this reservation."})

        return attrs
