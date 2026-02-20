from django.urls import path
from apps.products.controllers.product_controller import get_public_products, get_product_detail

urlpatterns = [
    path('public/', get_public_products, name='get-public-products'),
    path('public/<str:product_id>/', get_product_detail, name='get-product-detail'),
]