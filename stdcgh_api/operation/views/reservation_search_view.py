from stdcgh_api.configuration import models
from rest_framework import generics, pagination
from rest_framework.permissions import IsAuthenticated

from django.db import connection
from rest_framework.views import APIView
from rest_framework.response import Response


from stdcgh_api.operation import serializers
from durin.auth import TokenAuthentication

class RoomSearchList(generics.ListAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)
    queryset = models.Room.objects.all()
    serializer_class = serializers.RoomSearchSerializer
    # pagination.PageNumberPagination.page_size = 100
    def get_queryset(self):
        """
        This view should return a list of all the purchases item  received
        for the specified order .
        """
        checkin_date = self.request.query_params.get('checkin_date')
        checkout_date = self.request.query_params.get('checkout_date')
        # purchase = self.request.query_params.get('purchase')
        queryset = models.Room.objects.raw('''
                select * from (
            select cr.*,
                case when rr.room_id is null then 0
                else 1
                end status,
                rate.cost
            from public.configuration_room as cr
                join public.configuration_property as pr
	            on cr.property_id=pr.id and pr.is_operational=true
                join (SELECT id, cost,property_id, room_id
                FROM public.configuration_roomrate
                where start_date<=%s --checkin_date
                    and end_date>=%s --checkin_date
                ) as rate on rate.property_id=cr.property_id and rate.room_id=cr.id
            left join (
            SELECT 
                property_id, room_id
                FROM public.operation_reservationroomdetails as rr
                
                where 
                ((
                    checkin_date<=%s-- checkin_date
                    and
                    checkout_date>%s -- checkin_date
                )
                or
                (
                    checkin_date<%s-- checkout_date
                    and
                    checkout_date>=%s -- checkout_date
                )
                or
                (
                    checkin_date>%s -- checkin_date
                    and
                    checkout_date<%s--checkout_date
                ))
                and
                (
                    status='booked' or   status='checkin'
                )
                
                ) as rr on rr.room_id=cr.id and rr.property_id=cr.property_id

            ) as f
             --where 
             --f.status=0
             order by f.property_id asc
                    
                    ;
            ''',  [checkin_date,checkin_date,checkin_date, checkin_date, checkout_date,checkout_date, checkin_date, checkout_date])

        return queryset
    
class RoomSearchGroupByProperty(APIView):
    def get(self, request, format=None):
        checkin_date = request.query_params.get('checkin_date')
        checkout_date = request.query_params.get('checkout_date')
        property = request.query_params.get('property')
        with connection.cursor() as cursor:
            cursor.execute('''
                select * from (
            select cr.id, cr.room_no, cr.occupancy, cr.description, cr.is_operational, cr.property_id, cr.room_category_id, rc.name as room_category_name,
                case when rr.room_id is null then 0
                else 1
                end status,
                rate.cost
            from public.configuration_room as cr
                join public.configuration_property as pr
	            on cr.property_id=pr.id and pr.is_operational=true and pr.id=%s
                join (SELECT id, cost,property_id, room_id
                FROM public.configuration_roomrate
                where start_date<=%s --checkin_date
                    and end_date>=%s --checkin_date
                ) as rate on rate.property_id=cr.property_id and rate.room_id=cr.id
                join public.configuration_roomcategory as rc on rc.id=cr.room_category_id
            left join (
            SELECT 
                property_id, room_id
                FROM public.operation_reservationroomdetails as rr
                
                where 
                ((
                    checkin_date<=%s-- checkin_date
                    and
                    checkout_date>%s -- checkin_date
                )
                or
                (
                    checkin_date<%s-- checkout_date
                    and
                    checkout_date>=%s -- checkout_date
                )
                or
                (
                    checkin_date>%s -- checkin_date
                    and
                    checkout_date<%s--checkout_date
                ))
                and
                (
                    status='booked' or   status='checkin'
                )
                
                ) as rr on rr.room_id=cr.id and rr.property_id=cr.property_id

            ) as f
            --where 
            --f.status=0
             order by f.property_id asc
                    
                    ;
            ''',[property,checkin_date,checkin_date,checkin_date, checkin_date, checkout_date,checkout_date, checkin_date, checkout_date])
            raw_query_results = cursor.fetchall()

        property=models.Property.objects.filter(is_operational=True, id=property)
        
        results = []
        rooms=[]

        if property:
            for property_row in property:
                if raw_query_results:
                    for room_row in raw_query_results: 

                        if property_row.id == room_row[5]:
                            rooms.append({
                                'id':room_row[0],
                                'room':room_row[1],
                                'occupancy':room_row[2],
                                'description':room_row[3],
                                'is_operational':room_row[4],
                                'property_id':room_row[5],
                                'room_category_id':room_row[6],
                                'room_category_name':room_row[7],
                                'status':room_row[8],
                                'cost':room_row[9],
                            })
                            
                    
                    results.append({
                        'id':property_row.id,
                        'name':property_row.name,
                        'short_name':property_row.short_name,
                        'code':property_row.code,
                        'address':property_row.address,
                        'description':property_row.description,
                        'rooms':rooms
                    })
                
                rooms=[]

        # Perform some work on the raw query results
        # ...
        # results = []
        # for row in raw_query_results:
        #     results.append({
        #         'id': row[0],
        #         'name': row[1],
        #         'description': row[2],
        #         'created_at': row[3],
        #     })

        # Apply some filtering
        # filtered_results = [r for r in results if r['id'] > 10]

        # Perform some calculations
        # total = sum([r['id'] for r in filtered_results])

        # Create a response object and return it
        # response_data = {
        #     'results': filtered_results,
        #     'total': total,
        # }
        return Response(results)

# ===

