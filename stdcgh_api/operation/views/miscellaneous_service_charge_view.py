from stdcgh_api.operation import models as op_models
from stdcgh_api.configuration import models as conf_models
from rest_framework import generics, pagination
from rest_framework.permissions import IsAuthenticated
from django.db import transaction, connection
from stdcgh_api.operation import serializers
from stdcgh_api.operation.utility.calculator import Calculator
from durin.auth import TokenAuthentication
import datetime



class MiscellaneousServiceChargeList(generics.ListCreateAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)
    queryset = op_models.MiscellaneousServiceChargeDetails.objects.all()
    serializer_class = serializers.MiscellaneousServiceChargeDetailsSerializer
    # pagination.PageNumberPagination.page_size = 100
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        request.data._mutable = True

        request.data['created_by'] = request.user.id
        tax_details=Calculator.get_applicable_tax_details(self,  request.data['cost'])
        
        request.data['cgst_rate']=tax_details['cgst_rate']
        request.data['sgst_rate']=tax_details['sgst_rate']
        request.data['other_cess_rate']=tax_details['other_cess_rate']

        reservation_details = self.create(request, *args, **kwargs)
       
        # request.data['created_by'] = reservation_details.data['id']

        request.data._mutable = False
        return self.get(request, *args, **kwargs)
    
    def get_queryset(self):
        """
        This view should return a list of all the purchases item  received
        for the specified order .
        """
        if self.request.method == "POST":
            reservation_id=self.request.data['reservation']
            if(reservation_id):
                return op_models.MiscellaneousServiceChargeDetails.objects.filter(reservation=reservation_id)
        # order_number = self.request.data['order_no']
        reservation_id= self.request.query_params.get('reservation')
        # reservation_for= self.request.query_params.get('reservation_for')
        if(reservation_id):
            return op_models.MiscellaneousServiceChargeDetails.objects.filter(reservation=reservation_id)
        # if(reservation_for):
        #     return op_models.ReservationDetails.objects.filter(reservation_for=reservation_for)
        # else:
        return []



class MiscellaneousServiceChargeDetails(generics.RetrieveUpdateDestroyAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)
    queryset = op_models.MiscellaneousServiceChargeDetails.objects.all()
    serializer_class = serializers.MiscellaneousServiceChargeDetailsSerializer
    # pagination.PageNumberPagination.page_size = 100
    @transaction.atomic
    def put(self, request, *args, **kwargs):
        request.data._mutable = True

        request.data['created_by'] = request.user.id


        request.data._mutable = False
        reservation_details = self.update(request, *args, **kwargs)
                

        return self.get(request, *args, **kwargs)
    



# ===