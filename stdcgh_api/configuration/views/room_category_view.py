from stdcgh_api.configuration import models
from rest_framework import generics, pagination
from rest_framework.permissions import IsAuthenticated

from stdcgh_api.configuration import serializers
from durin.auth import TokenAuthentication

class RoomCategoryList(generics.ListCreateAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)
    queryset = models.RoomCategory.objects.all().order_by('id')
    serializer_class = serializers.RoomCategorySerializer
    # pagination.PageNumberPagination.page_size = 100


class RoomCategoryDetails(generics.RetrieveUpdateDestroyAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)
    queryset = models.RoomCategory
    serializer_class = serializers.RoomCategorySerializer
# ===