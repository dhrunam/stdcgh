import datetime

from django.conf import settings
from django.db import connection, transaction
from durin.auth import TokenAuthentication
from rest_framework import generics, pagination
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from stdcgh_api.configuration import models as conf_models
from stdcgh_api.operation import models as op_models
from stdcgh_api.operation import serializers
from stdcgh_api.operation.utility.calculator import Calculator
from stdcgh_api.operation.utility.custom_id_manager import IDManager

import json

def generate_bill(self, request):
    reservation= op_models.ReservationDetails.objects.get(pk=request.data['reservation'])

    reservation_rooms=op_models.ReservationRoomDetails.objects.filter(reservation=request.data['reservation'])
        
    if(reservation_rooms) and reservation:
            no_of_days = Calculator.get_number_of_days(reservation.checkin_date.strftime('%Y-%m-%d'), reservation.checkout_date.strftime('%Y-%m-%d'))
            request.data['total_room_cost'] =Calculator.calculate_total_room_cost(self,reservation_rooms, no_of_days )
        
    service_details=op_models.MiscellaneousServiceChargeDetails.objects.filter(reservation=request.data['reservation'])
    if(service_details):
        request.data['total_service_cost'] = Calculator.calculate_total_service_cost(self, service_details)

        request.data['bill_no'] =IDManager.generate_bill_no(self,request.data)
        
        request.data['created_by'] = self.request.user.id

    op_models.ReservationBillDetails.objects.create(
        reservation = reservation,
        property = conf_models.Property.objects.get(id = reservation.property.id),
        total_service_cost = request.data.get('total_service_cost',0),
        total_room_cost = request.data.get('total_room_cost',0),
        discount = request.data.get('discount',0),
        refund=request.data.get('refund',0),
        created_by= request.user
    )
    if(reservation):
            reservation.is_bill_generated = True
            reservation.save()

class GuestCheckInCheckOutDetailsList(generics.ListCreateAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)
    queryset = op_models.GuestCheckInCheckOutDetails.objects.all()
    serializer_class = serializers.CheckInCheckOutSerializer
    # pagination.PageNumberPagination.page_size = 100
    # @transaction.atomic
    def post(self, request, *args, **kwargs):
        rooms = json.loads(request.data['rooms'])
        if(rooms):

            reservation= op_models.ReservationDetails.objects.get(pk=rooms[0]['reservation'])
            with transaction.atomic():
                request.data._mutable = True
               
                for element in rooms:
                    
                    if(reservation):
                        
                        if 'lead_guest' not in element:
                            request.data['lead_guest']=reservation.lead_guest_name

                        if  'address' not in element :
                            request.data['address']=reservation.address
                        
                        if  'contact_no' not in element :
                            request.data['contact_no']=reservation.contact_no
                    
                    request.data['created_by'] = request.user.id
                    print(element['checkin_date'])
                    request.data['checkin_date'] = element['checkin_date']
                    request.data['reservation'] = element['reservation']
                    request.data['property'] = element['property']
                    request.data['room'] = element['room']
                    reservation_details = self.create(request, *args, **kwargs)
                    reservation_room = op_models.ReservationRoomDetails.objects.filter(
                    reservation=element['reservation'], property=element['property'], room=element['room']).last()
                    if(reservation_room):
                        reservation_room.checkin_date = element['checkin_date']
                        reservation_room.status= status=settings.BOOKING_STATUS['checkin']
                        reservation_room.save()

                request.data._mutable = False
            transaction.commit()

            with transaction.atomic():
                request.data._mutable = True
                reservation_rooms = op_models.ReservationRoomDetails.objects.filter(
                reservation=reservation.id, status=settings.BOOKING_STATUS['booked'])
                    
                if(reservation_rooms):

                    if reservation:
                        reservation.status=settings.BOOKING_STATUS['booked']
                        reservation.save()
                else:
                    if reservation:
                        reservation.status=settings.BOOKING_STATUS['checkin']
                        reservation.save()
                    
                request.data._mutable = False
            transaction.commit()
        return self.get(request, *args, **kwargs)
    
    def get_queryset(self):
        """
        This view should return a list of all the purchases item  received
        for the specified order .
        """
        if self.request.method == "POST":
            reservation_id=self.request.data['reservation']
            if(reservation_id):
                return op_models.GuestCheckInCheckOutDetails.objects.filter(reservation=reservation_id)
        # order_number = self.request.data['order_no']
        # reservation_no = self.request.query_params.get('reservation_no')
        # reservation_for= self.request.query_params.get('reservation_for')
        # if(reservation_no):
        #     return op_models.ReservationDetails.objects.filter(reservation_no=reservation_no)
        # if(reservation_for):
        #     return op_models.ReservationDetails.objects.filter(reservation_for=reservation_for)
        # else:
        return op_models.GuestCheckInCheckOutDetails.objects.all()


class GuestCheckOutDetailsList(generics.ListCreateAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)
    queryset = op_models.GuestCheckInCheckOutDetails.objects.all()
    serializer_class = serializers.CheckInCheckOutSerializer
    # pagination.PageNumberPagination.page_size = 100
    # @transaction.atomic
    def post(self, request, *args, **kwargs):
        rooms = json.loads(request.data['rooms'])
        if(rooms):

            reservation= op_models.ReservationDetails.objects.get(pk=rooms[0]['reservation'])
            with transaction.atomic():
                request.data._mutable = True
               
                for element in rooms:

                    guest_checkin_checkout_details =op_models.GuestCheckInCheckOutDetails.objects.filter(reservation= element['reservation'],
                    property=element['property'], room=element['room']).last()
                    if(guest_checkin_checkout_details):
                        guest_checkin_checkout_details.checkout_date=element['checkout_date']
                        guest_checkin_checkout_details.save() 


                    reservation_room = op_models.ReservationRoomDetails.objects.filter(
                    reservation=element['reservation'], property=element['property'], room=element['room']).last()
                    if(reservation_room):
                        reservation_room.checkout_date = element['checkout_date']
                        reservation_room.status= status=settings.BOOKING_STATUS['checkout']
                        reservation_room.save()

                request.data._mutable = False
            transaction.commit()

            with transaction.atomic():
                request.data._mutable = True
                reservation_rooms = op_models.ReservationRoomDetails.objects.filter(
                reservation=reservation.id, status=settings.BOOKING_STATUS['checkin'])
                    
                if(reservation_rooms):

                    if reservation:
                            pass
                else:
                    if reservation:
                        reservation.status=settings.BOOKING_STATUS['checkout']
                        reservation.save()

                generate_bill(self,request)
                    
                request.data._mutable = False
            transaction.commit()
        return self.get(request, *args, **kwargs)
    
    def get_queryset(self):
        """
        This view should return a list of all the purchases item  received
        for the specified order .
        """
        if self.request.method == "POST":
            reservation_id=self.request.data['reservation']
            if(reservation_id):
                return op_models.GuestCheckInCheckOutDetails.objects.filter(reservation=reservation_id)
        # order_number = self.request.data['order_no']
        # reservation_no = self.request.query_params.get('reservation_no')
        # reservation_for= self.request.query_params.get('reservation_for')
        # if(reservation_no):
        #     return op_models.ReservationDetails.objects.filter(reservation_no=reservation_no)
        # if(reservation_for):
        #     return op_models.ReservationDetails.objects.filter(reservation_for=reservation_for)
        # else:
        return op_models.GuestCheckInCheckOutDetails.objects.all()


class GuesNoShowDetailsList(generics.ListCreateAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)
    queryset = op_models.GuestCheckInCheckOutDetails.objects.all()
    serializer_class = serializers.CheckInCheckOutSerializer
    # pagination.PageNumberPagination.page_size = 100
    # @transaction.atomic
    def post(self, request, *args, **kwargs):
        rooms = json.loads(request.data['rooms'])
        if(rooms):

            reservation= op_models.ReservationDetails.objects.get(pk=rooms[0]['reservation'])
            with transaction.atomic():
                request.data._mutable = True
               
                for element in rooms:

                    reservation_room = op_models.ReservationRoomDetails.objects.filter(
                    reservation=element['reservation'], property=element['property'], room=element['room']).last()
                    if(reservation_room):

                        reservation_room.status= status=settings.BOOKING_STATUS['noshow']
                        reservation_room.save()

                request.data._mutable = False
            transaction.commit()

            with transaction.atomic():
                reservation_rooms = op_models.ReservationRoomDetails.objects.filter(
                reservation=reservation.id).filter(Q(status=settings.BOOKING_STATUS['checkin']) 
                | Q(status=settings.BOOKING_STATUS['checkout']))
                    
                if(reservation_rooms):

                    if reservation:
                            pass
                else:
                    if reservation:
                        reservation.status=settings.BOOKING_STATUS['noshow']
                        reservation.save()
                    
            
            transaction.commit()
        return self.get(request, *args, **kwargs)
    
    def get_queryset(self):
        """
        This view should return a list of all the purchases item  received
        for the specified order .
        """
        if self.request.method == "POST":
            reservation_id=self.request.data['reservation']
            if(reservation_id):
                return op_models.GuestCheckInCheckOutDetails.objects.filter(reservation=reservation_id)
        # order_number = self.request.data['order_no']
        # reservation_no = self.request.query_params.get('reservation_no')
        # reservation_for= self.request.query_params.get('reservation_for')
        # if(reservation_no):
        #     return op_models.ReservationDetails.objects.filter(reservation_no=reservation_no)
        # if(reservation_for):
        #     return op_models.ReservationDetails.objects.filter(reservation_for=reservation_for)
        # else:
        return op_models.GuestCheckInCheckOutDetails.objects.all()



class GuestCheckInCheckOutDetailsDetails(generics.RetrieveUpdateDestroyAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)
    queryset = op_models.GuestCheckInCheckOutDetails.objects.all()
    serializer_class = serializers.CheckInCheckOutSerializer
    # pagination.PageNumberPagination.page_size = 100
    @transaction.atomic
    def put(self, request, *args, **kwargs):
        request.data._mutable = True

        request.data['created_by'] = request.user.id


        request.data._mutable = False
        reservation_details = self.update(request, *args, **kwargs)
                
        reservation_room = op_models.ReservationRoomDetails.objects.filter(
        reservation=request.data['reservation'], property=request.data['property'], room=request.data['room'])
        if(reservation_room):
            print('check out date:')
            print(reservation_room[0].checkout_date)
            reservation_room[0].checkout_date = request.data['checkout_date']
            reservation_room[0].status = settings.BOOKING_STATUS['checkout']
            reservation_room[0].save()

        return self.get(request, *args, **kwargs)
    
    # @transaction.atomic
    def patch(self, request, *args, **kwargs):
        with transaction.atomic():
            request.data._mutable = True

            request.data['created_by'] = request.user.id
            request.data._mutable = False
            reservation_details = self.partial_update(request, *args, **kwargs)
                    
            reservation_room = op_models.ReservationRoomDetails.objects.filter(
            reservation=request.data['reservation'], property=request.data['property'], room=request.data['room'])
            if(reservation_room):
                
                if 'checkin_date' in request.data:

                    reservation_room[0].checkin_date = request.data['checkin_date']
                    reservation_room[0].status = settings.BOOKING_STATUS['checkin']

                if 'checkout_date' in request.data:

                    reservation_room[0].checkout_date = request.data['checkout_date']
                    reservation_room[0].status = settings.BOOKING_STATUS['checkout']
                    
                reservation_room[0].save()

        transaction.commit()
        with transaction.atomic():
            if 'checkout_date' in request.data:
                reservation_rooms = op_models.ReservationRoomDetails.objects.filter(
                reservation=request.data['reservation'], status=settings.BOOKING_STATUS['checkin'])

                reservation = op_models.ReservationDetails.objects.get(
                        pk=request.data['reservation'])
                    
                if(reservation_rooms):

                    pass

                else:
                    if reservation:
                        reservation.status=settings.BOOKING_STATUS['checkout']
                        reservation.save()
                
        
        transaction.commit()

        return self.get(request, *args, **kwargs)

        # return self.partial_update(request, *args, **kwargs)


# ===