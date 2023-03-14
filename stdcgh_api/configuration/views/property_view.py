from django.db.models import Prefetch, Q

from stdcgh_api.configuration import models
from rest_framework import generics, pagination
from rest_framework.permissions import IsAuthenticated

from stdcgh_api.configuration import serializers
from durin.auth import TokenAuthentication

class PropertyList(generics.ListCreateAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)
    queryset = models.Property.objects.all().order_by('id')
    serializer_class = serializers.PropertySerializer
    # pagination.PageNumberPagination.page_size = 100


class PropertyDetails(generics.RetrieveUpdateDestroyAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)
    queryset = models.Property
    serializer_class = serializers.PropertySerializer
# ===

# class PropertyDetailWithRooms(generics.RetrieveAPIView):
#     queryset = models.Property.objects.all()
#     serializer_class = serializers.PropertySerializer

#     def get(self, request, *args, **kwargs):
#         instance = self.get_object()
#         model3s = instance.rooms.all()
#         # do something with model3s
#         return self.retrieve(request, *args, **kwargs)

class PropertyWithAvailableRoomList(generics.ListAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)
    # parents = Parent.objects.select_related('child').prefetch_related('child_set').filter(child__is_active=True)

    queryset = models.Room.objects.prefetch_related(Prefetch('property_set', queryset=models.Property.objects.all())).all()
    serializer_class = serializers.RoomSerializer
    # pagination.PageNumberPagination.page_size = 100

