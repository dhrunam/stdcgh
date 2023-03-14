
from importlib.resources import path
from django.db import router
from django.urls import include, path
from rest_framework import routers
from durin import views as durin_views
from stdcgh_api.configuration import views

urlpatterns = [
    path('api/property', views.PropertyList.as_view()),
    path('api/property/<int:pk>', views.PropertyDetails.as_view()),

    # path('api/property/rooms/<int:pk>', views.PropertyDetailWithRooms.as_view()),
    path('api/property/rooms', views.PropertyWithAvailableRoomList.as_view()),

    path('api/room/category', views.RoomCategoryList.as_view()),
    path('api/room/category/<int:pk>', views.RoomCategoryDetails.as_view()),

    path('api/room', views.RoomList.as_view()),
    path('api/room/<int:pk>', views.RoomDetails.as_view()),

    path('api/room/rate', views.RoomRateList.as_view()),
    path('api/room/rate/<int:pk>', views.RoomRateDetails.as_view()),

    path('api/applicable_tax', views.ApplicableTaxDetailsList.as_view()),
    path('api/applicable_tax/<int:pk>', views.ApplicableTaxDetailsDetails.as_view()),
]


