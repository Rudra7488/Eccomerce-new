from django.urls import path
from ..controllers.order_controller import OrderController, AdminOrderController

urlpatterns = [
    # User routes
    path('place-order/', OrderController.as_view(), name='place_order'),
    path('my-orders/', OrderController.as_view(), name='my_orders'),
    path('cancel-order/<str:order_id>/', OrderController.as_view(), name='cancel_order'),
    
    # Admin routes
    path('admin/all-orders/', AdminOrderController.as_view(), name='admin_all_orders'),
    path('admin/update-status/<str:order_id>/', AdminOrderController.as_view(), name='admin_update_order_status'),
]
