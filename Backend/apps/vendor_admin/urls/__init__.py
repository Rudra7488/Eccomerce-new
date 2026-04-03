from django.urls import path, include
from ..views.customer_views import get_customers, delete_customer
from ..views.analytics_views import get_analytics

urlpatterns = [
    path('customers-list/', get_customers, name='get-customers'),
    path('customers/<str:customer_id>/delete/', delete_customer, name='delete-customer'),
    path('analytics/', get_analytics, name='get-analytics'),
    path('', include('apps.vendor_admin.urls.product_urls')),
]
