from django.conf import settings
from rest_framework import generics, pagination
from rest_framework.permissions import IsAuthenticated
from django.db import transaction, connection
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q

from stdcgh_api.operation import models as op_models
from stdcgh_api.account import models as acc_models
from stdcgh_api.configuration import models as conf_models
from stdcgh_api.operation.utility.calculator import Calculator
from stdcgh_api.operation import serializers
from durin.auth import TokenAuthentication
import datetime
import json


def generate_reservation_no(self, data):

    latest_record = op_models.ReservationDetails.objects.filter(property=data['property']).last()
    property = conf_models.Property.objects.get(pk=data['property'])
    date_object = datetime.datetime.strptime(data['checkin_date'], '%Y-%m-%d')

    reservation_year =date_object.strftime('%Y')
    sl_no = 1
    if latest_record and property:
        reservation_no = latest_record.reservation_no

        if reservation_no:

            year = reservation_no[-9:-5]
            
            sl_no = int(reservation_no[-5:])

            if reservation_year == year:
                sl_no = sl_no+1
            else:
                sl_no = 1

            return property.short_name+str(reservation_year)+f"{sl_no:05d}"

        return property.short_name+str(reservation_year)+f"{sl_no:05d}"

    return property.short_name+str(reservation_year)+f"{sl_no:05d}"

# def calculate_total_room_cost(self, rooms):
#     total_room_cost=0
#     if(rooms):
#             for element in rooms:
#                 total_room_cost+=element['room_rate']
                       
#     return total_room_cost

class ReservationDetailsList(generics.ListCreateAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)
    queryset = op_models.ReservationDetails.objects.all()
    serializer_class = serializers.ReservationDetailsSerializer
    # pagination.PageNumberPagination.page_size = 100
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        rooms = json.loads(request.data['rooms'])
        request.data._mutable = True

        request.data['created_by'] = request.user.id

        request.data['reservation_no'] = generate_reservation_no(
            self, request.data)
        if rooms:
            
            no_of_days=Calculator.get_number_of_days(request.data['checkin_date'], request.data['checkout_date'])
            request.data['total_room_cost']=Calculator.calculate_total_room_cost(self, rooms, no_of_days)

        request.data['status']=settings.BOOKING_STATUS['booked']

        reservation_details = self.create(request, *args, **kwargs)


        if(rooms):
            for element in rooms:

                tax_details=Calculator.get_applicable_tax_details(self, element['room_rate'])

                reservation_room=op_models.ReservationRoomDetails.objects.create(
                        reservation = op_models.ReservationDetails.objects.get(id=reservation_details.data['id']),
                        property = conf_models.Property.objects.get(id = request.data['property']),
                        room = conf_models.Room.objects.get(id=element['room']),
                        room_rate = element['room_rate'],
                        cgst_rate=tax_details['cgst_rate'],
                        sgst_rate=tax_details['sgst_rate'],
                        other_cess_rate=tax_details['other_cess_rate'],
                        checkin_date = request.data['checkin_date'],
                        checkout_date = request.data['checkout_date'],
                        status=settings.BOOKING_STATUS['booked']
                    )
                
        request.data._mutable = False
        return self.get(request, *args, **kwargs)
    
    def get_queryset(self):
        """
        This view should return a list of all the purchases item  received
        for the specified order .
        """

        queryset = op_models.ReservationDetails.objects.all()
        property=acc_models.UserProfile.objects.filter(user=self.request.user.id).last()
        if property:
            queryset = queryset.filter(property=property.property)

        if self.request.method == "POST":
            reservation_no=self.request.data['reservation_no']
            if(reservation_no):
                queryset= queryset.filter(reservation_no=reservation_no)
        # order_number = self.request.data['order_no']
        reservation_no = self.request.query_params.get('reservation_no')
        reservation_for= self.request.query_params.get('reservation_for')
        checkin_date= self.request.query_params.get('checkin_date')
        checkout_date= self.request.query_params.get('checkout_date')
        room_number = self.request.query_params.get('room_no')
        search_text = self.request.query_params.get('search_text')
        operation = self.request.query_params.get('operation')
        if(reservation_no):
            queryset= queryset.filter(reservation_no=reservation_no)
        if(reservation_for):
            queryset= queryset.filter(reservation_for__icontains=reservation_for)
        if(checkin_date):

            queryset= queryset.filter(checkin_date__lte=checkin_date,checkout_date__gte=checkin_date,status = settings.BOOKING_STATUS['booked'] )
        
        if(checkout_date):

            queryset= queryset.filter(checkin_date__lte=checkout_date, checkout_date__gte=checkout_date,status = settings.BOOKING_STATUS['checkin'] )
        
        if(room_number):

            today=datetime.datetime.today().date()
            reservation=op_models.ReservationRoomDetails.objects.filter(checkin_date__lte=today,
                         checkout_date__gte=today, room__room_no=room_number).last()
            # reservation=op_models.ReservationRoomDetails.objects.filter(room__room_no=room_number).last()
            
            if(reservation):
                queryset= queryset.filter(id=reservation.reservation.id)
            else:
                queryset= queryset.filter(id=0)
        
        if(search_text):
            queryset= queryset.filter(Q(reservation_for__icontains=search_text) 
            | Q(reservation_no__icontains=search_text)
            | Q(lead_guest_name__icontains=search_text)
            | Q(contact_no__icontains=search_text)
            | Q(reservation_from__icontains=search_text))
        
        
        if(operation):
            today=datetime.datetime.today().date()
            if operation=='checkin' or operation=='checkout':
                print('Date of the day:' ,str(today))
                queryset=queryset.filter(checkin_date__lte=today,
                         checkout_date__gte=today)
            if(operation=='other_service'):
                queryset= queryset.filter(checkin_date__lte=today,checkout_date__gte=today,status = settings.BOOKING_STATUS['checkin'] )
        
            


        else:
            return queryset.order_by('-id')

        return queryset.order_by('-id')

class ReservationDetailsDetails(generics.RetrieveUpdateDestroyAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)
    queryset = op_models.ReservationDetails.objects.all()
    serializer_class = serializers.ReservationDetailsSerializer
    # pagination.PageNumberPagination.page_size = 100
    @transaction.atomic
    def put(self, request, *args, **kwargs):
        request.data._mutable = True

        request.data['created_by'] = request.user.id
        rooms = json.loads(request.data['rooms'])
        if rooms:
            
            no_of_days=Calculator.get_number_of_days(request.data['checkin_date'], request.data['checkout_date']),
            request.data['total_room_cost']=Calculator.calculate_total_room_cost(self, rooms, no_of_days)

        request.data._mutable = False
        reservation_details = self.update(request, *args, **kwargs)

        if(rooms):
            op_models.ReservationRoomDetails.objects.filter(reservation=reservation_details.data['id']).delete()
            for element in rooms:
                
                reservation_room=op_models.ReservationRoomDetails.objects.create(
                        reservation = op_models.ReservationDetails.objects.get(id=reservation_details.data['id']),
                        property = conf_models.Property.objects.get(id = request.data['property']),
                        room = conf_models.Room.objects.get(id=element['room']),
                        room_rate = element['room_rate'],
                        checkin_date = request.data['checkin_date'],
                        checkout_date = request.data['checkout_date'],
                        status=settings.BOOKING_STATUS['booked']
                    )
                

        return self.get(request, *args, **kwargs)
    

    # @transaction.atomic
    def patch(self, request, *args, **kwargs):
        with transaction.atomic():
            request.data._mutable = True

            request.data['created_by'] = request.user.id
           
            if request.data['operation'] in settings.BOOKING_STATUS:
                 request.data['status'] = request.data['operation']

            
            reservation_details = self.partial_update(request, *args, **kwargs)

            request.data._mutable = False    
            reservation_room = op_models.ReservationRoomDetails.objects.filter(
            reservation=reservation_details.data['id'])
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
            if request.data['operation'] in settings.BOOKING_STATUS:
                
                reservation_rooms = op_models.ReservationRoomDetails.objects.filter(
                reservation=reservation_details.data['id'])

                if reservation_rooms.exists():
                    for element in reservation_rooms:
                        element.status=request.data['operation']
                        element.save()
            
                
        
        transaction.commit()

        return self.get(request, *args, **kwargs)


# class RoomSearchGroupByProperty(APIView):
#     def get(self, request, format=None):
#         checkin_date = request.query_params.get('checkin_date')
#         checkout_date = request.query_params.get('checkout_date')
#         property = request.query_params.get('property')
#         with connection.cursor() as cursor:
#             cursor.execute('''
#                 select * from (
#             select cr.id, cr.room_no, cr.occupancy, cr.description, cr.is_operational, cr.property_id, cr.room_category_id, rc.name as room_category_name,
#                 case when rr.room_id is null then 0
#                 else 1
#                 end status,
#                 rate.cost
#             from public.configuration_room as cr
#                 join public.configuration_property as pr
# 	            on cr.property_id=pr.id and pr.is_operational=true and pr.id=%s
#                 join (SELECT id, cost,property_id, room_id
#                 FROM public.configuration_roomrate
#                 where start_date<=%s --checkin_date
#                     and end_date>=%s --checkin_date
#                 ) as rate on rate.property_id=cr.property_id and rate.room_id=cr.id
#                 join public.configuration_roomcategory as rc on rc.id=cr.room_category_id
#             left join (
#             SELECT 
#                 property_id, room_id
#                 FROM public.operation_reservationroomdetails as rr
                
#                 where 
#                 (
#                     checkin_date<=%s-- checkin_date
#                     and
#                     checkout_date>%s -- checkin_date
#                 )
#                 or
#                 (
#                     checkin_date<%s-- checkout_date
#                     and
#                     checkout_date>=%s -- checkout_date
#                 )
#                 or
#                 (
#                     checkin_date>%s -- checkin_date
#                     and
#                     checkout_date<%s--checkout_date
#                 )
                
#                 ) as rr on rr.room_id=cr.id and rr.property_id=cr.property_id

#             ) as f
#             where f.status=0
#              order by f.property_id asc
                    
#                     ;
#             ''',[property,checkin_date,checkin_date,checkin_date, checkin_date, checkout_date,checkout_date, checkin_date, checkout_date])
#             raw_query_results = cursor.fetchall()

#         property=models.Property.objects.filter(is_operational=True, id=property)
        
#         results = []
#         rooms=[]

#         if property:
#             for property_row in property:
#                 if raw_query_results:
#                     for room_row in raw_query_results: 

#                         if property_row.id == room_row[5]:
#                             rooms.append({
#                                 'id':room_row[0],
#                                 'room':room_row[1],
#                                 'occupancy':room_row[2],
#                                 'description':room_row[3],
#                                 'is_operational':room_row[4],
#                                 'property_id':room_row[5],
#                                 'room_category_id':room_row[6],
#                                 'room_category_name':room_row[7],
#                                 'status':room_row[8],
#                                 'cost':room_row[9],
#                             })
                            
                    
#                     results.append({
#                         'id':property_row.id,
#                         'name':property_row.name,
#                         'short_name':property_row.short_name,
#                         'code':property_row.code,
#                         'address':property_row.address,
#                         'description':property_row.description,
#                         'rooms':rooms
#                     })
                
#                 rooms=[]

#         # Perform some work on the raw query results
#         # ...
#         # results = []
#         # for row in raw_query_results:
#         #     results.append({
#         #         'id': row[0],
#         #         'name': row[1],
#         #         'description': row[2],
#         #         'created_at': row[3],
#         #     })

#         # Apply some filtering
#         # filtered_results = [r for r in results if r['id'] > 10]

#         # Perform some calculations
#         # total = sum([r['id'] for r in filtered_results])

#         # Create a response object and return it
#         # response_data = {
#         #     'results': filtered_results,
#         #     'total': total,
#         # }
#         return Response(results)

# ===


class ReservationDetailsListForReporting(generics.ListAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)
    queryset = op_models.ReservationDetails.objects.all()
    serializer_class = serializers.ReservationDetailsSerializer
    # pagination.PageNumberPagination.page_size = 100

    def get_queryset(self):
        """
        This view should return a list of all the purchases item  received
        for the specified order .
        """

        queryset = op_models.ReservationDetails.objects.all()

        start_date= self.request.query_params.get('start_date')
        end_date= self.request.query_params.get('end_date')
        
        if(start_date and end_date):

            queryset= queryset.filter(
            Q(checkin_date__gte=start_date,checkin_date__lte=end_date )
            ).exclude(status='cancelled')
        else:
            return queryset.order_by('-id')

        return queryset.order_by('-id')
