from django.conf import settings
from django.db import models
from stdcgh_api.configuration import models as conf_models
from django.contrib.auth.models import User
# Create your models here.
class ReservationDetails(models.Model):

    property=models.ForeignKey(conf_models.Property, null=True, on_delete=models.SET_NULL, related_name='reservation_details')
    reservation_no=models.CharField(max_length=15,blank=False)
    lead_guest_name=models.CharField(max_length=128, blank=True)
    reservation_for=models.CharField(max_length=128, blank=False)
    reservation_from=models.CharField(max_length=128, blank=False)
    address=models.CharField(max_length=1024, blank=False)
    contact_no=models.CharField(max_length=12,blank=True, null=True)
    remarks=models.CharField(max_length=1024,blank=True, null=True)
    checkin_date=models.DateField(auto_now=False, auto_now_add=False)
    checkout_date=models.DateField(auto_now=False, auto_now_add=False)
    total_room_cost= models.DecimalField(max_digits=8, decimal_places=2, default=0)
    discount= models.DecimalField(max_digits=8, decimal_places=2, default=0)
    
    is_bill_generated=models.BooleanField(default=False, null=False)
    is_payment_received=models.BooleanField(default=False, null=False)
    status = models.CharField(max_length=10, default=settings.BOOKING_STATUS['booked'])
    created_by=models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='reservation_by_user')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return super().__str__()


class ReservationRoomDetails(models.Model): 
    reservation=models.ForeignKey(ReservationDetails, null=True, on_delete=models.SET_NULL, related_name='reservation_room_details')
    property=models.ForeignKey(conf_models.Property, null=True, on_delete=models.SET_NULL, related_name='reservation_room_details')
    room=models.ForeignKey(conf_models.Room, null=True, on_delete=models.SET_NULL, related_name='reservation_room_details')
    room_rate=models.DecimalField(max_digits=8, decimal_places=2)
    
    no_adult=models.IntegerField( default=0)
    no_child=models.IntegerField( default=0)
    cgst_rate=models.DecimalField(max_digits=8, decimal_places=2, default=0)
    sgst_rate=models.DecimalField(max_digits=8, decimal_places=2, default=0)
    other_cess_rate=models.DecimalField(max_digits=8, decimal_places=2, default=0)
    
    checkin_date=models.DateField(auto_now=False, auto_now_add=False)
    checkout_date=models.DateField(auto_now=False, auto_now_add=False)
    status = models.CharField(max_length=10, default=settings.BOOKING_STATUS['booked'])

    def __str__(self) -> str:
        return super().__str__()


class GuestCheckInCheckOutDetails(models.Model): 
    reservation=models.ForeignKey(ReservationDetails, null=True, on_delete=models.SET_NULL, related_name='guest_checkin_check_out')
    property=models.ForeignKey(conf_models.Property, null=True, on_delete=models.SET_NULL, related_name='guest_checkin_check_out')
    room=models.ForeignKey(conf_models.Room, null=True, on_delete=models.SET_NULL, related_name='guest_checkin_check_out')
    lead_guest=models.CharField(max_length=1024, blank=True, null=True)
    no_adult=models.IntegerField( default=0)
    no_child=models.IntegerField( default=0)
    address=models.CharField(max_length=1024, blank=True, null=True)
    contact_no=models.CharField(max_length=12, blank=True, null=True)
    checkin_date=models.DateField(auto_now=False, auto_now_add=False, null=False)
    checkout_date=models.DateField(auto_now=False, auto_now_add=False, null=True)
    remarks=models.CharField(max_length=2048, null=True, blank=True)
    created_by=models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='guest_checkin_check_out')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    def __str__(self) -> str:
        return super().__str__()


class MiscellaneousServiceChargeDetails(models.Model): 
    reservation=models.ForeignKey(ReservationDetails, null=True, on_delete=models.SET_NULL, related_name='miscellaneous_service_charge')
    particular=models.CharField(max_length=1024, null=False, blank=False)
    cost=models.DecimalField(max_digits=8, decimal_places=2)
    start_date = models.DateField(auto_now_add=False, null=False, blank=False)
    end_date = models.DateField(auto_now_add=False, null=False, blank=False)
    
    cgst_rate=models.DecimalField(max_digits=8, decimal_places=2, default=0)
    sgst_rate=models.DecimalField(max_digits=8, decimal_places=2, default=0)
    other_cess_rate=models.DecimalField(max_digits=8, decimal_places=2, default=0)
    
    remarks=models.CharField(max_length=2048, null=True, blank=True)
    created_by=models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='miscellaneous_service_charge')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    def __str__(self) -> str:
        return super().__str__()

class ReservationBillDetails(models.Model): 
    bill_no=models.CharField(max_length=20, null=False)
    reservation=models.ForeignKey(ReservationDetails, null=True, on_delete=models.SET_NULL, related_name='reservation_bill_details')
    property=models.ForeignKey(conf_models.Property, null=True, on_delete=models.SET_NULL, related_name='reservation_bill_details')
    total_room_cost=models.DecimalField(max_digits=8, decimal_places=2)
    total_service_cost=models.DecimalField(max_digits=8, decimal_places=2, default=0)
    discount= models.DecimalField(max_digits=8, decimal_places=2, default=0)
    refund= models.DecimalField(max_digits=8, decimal_places=2, default=0)
    cgst_rate=models.DecimalField(max_digits=8, decimal_places=2, default=0)
    sgst_rate=models.DecimalField(max_digits=8, decimal_places=2, default=0)
    other_cess_rate=models.DecimalField(max_digits=8, decimal_places=2, default=0)
    
    remarks=models.CharField(max_length=2048, null=True, blank=True)
    created_by=models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='reservation_bill_details')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    def __str__(self) -> str:
        return super().__str__()