from django.urls import path, include
from ..views.customer_views import get_customers, delete_customer

urlpatterns = [
    path('customers-list/', get_customers, name='get-customers'),
    path('customers/<str:customer_id>/delete/', delete_customer, name='delete-customer'),
    path('', include('apps.vendor_admin.urls.product_urls')),
]
