from django.urls import path
from apps.users.controllers.address_controller import AddressListView, AddressDetailView

urlpatterns = [
    path('addresses/', AddressListView.as_view(), name='address-list'),
    path('addresses/<str:address_id>/', AddressDetailView.as_view(), name='address-detail'),
]
