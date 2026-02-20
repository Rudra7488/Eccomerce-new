from django.urls import path
from ..views.product_views import (
    get_products, get_vendor_products, get_product,
    create_product, update_product, delete_product
)

urlpatterns = [
    # Admin routes - get all products
    path('products/', get_products, name='get-products'),
    
    # Vendor routes - get vendor's products
    path('vendor/products/', get_vendor_products, name='get-vendor-products'),
    
    # Individual product routes
    path('products/create/', create_product, name='create-product'),
    path('products/<str:product_id>/', get_product, name='get-product'),
    path('products/<str:product_id>/update/', update_product, name='update-product'),
    path('products/<str:product_id>/delete/', delete_product, name='delete-product'),
]