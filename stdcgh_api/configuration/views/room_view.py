from stdcgh_api.configuration import models
from rest_framework import generics, pagination
from rest_framework.permissions import IsAuthenticated

from stdcgh_api.configuration import serializers
from durin.auth import TokenAuthentication

class RoomList(generics.ListCreateAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)
    queryset = models.Room.objects.all().order_by('id')
    serializer_class = serializers.RoomSerializer
    # pagination.PageNumberPagination.page_size = 100
    def get_queryset(self):
        """
        This view should return a list of all the purchases item  received
        for the specified order .
        """

        # order_number = self.request.data['order_no']
        search_text = self.request.query_params.get('property')

        if(search_text):
            return models.Room.objects.filter(property=search_text)
        else:
            return models.Room.objects.all()



class RoomDetails(generics.RetrieveUpdateDestroyAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)
    queryset = models.Room
    serializer_class = serializers.RoomSerializer
# ===