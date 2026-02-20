from django.urls import path
from ..views.customer_views import get_customers

urlpatterns = [
    path('customers-list/', get_customers, name='get-customers'),
]
