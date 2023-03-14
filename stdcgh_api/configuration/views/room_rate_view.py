from stdcgh_api.configuration import models
from rest_framework import generics, pagination
from rest_framework.permissions import IsAuthenticated

from stdcgh_api.configuration import serializers
from durin.auth import TokenAuthentication

class RoomRateList(generics.ListCreateAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)
    queryset = models.RoomRate.objects.all().order_by('id')
    serializer_class = serializers.RoomRateSerializer
    # pagination.PageNumberPagination.page_size = 100
    def post(self, request, *args, **kwargs):
        request.data._mutable = True
        request.data['created_by'] = request.user.id
        request.data._mutable = False
        return self.create(request, *args, **kwargs)

class RoomRateDetails(generics.RetrieveUpdateDestroyAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)
    queryset = models.RoomRate
    serializer_class = serializers.RoomRateSerializer

    def put(self, request, *args, **kwargs):
        request.data._mutable = True
        request.data['created_by'] = request.user.id
        request.data._mutable = False
        return self.update(request, *args, **kwargs)
# ===