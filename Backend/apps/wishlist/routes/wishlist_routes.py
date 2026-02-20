from django.urls import path
from apps.wishlist.controllers.wishlist_controller import get_wishlist, add_to_wishlist, remove_from_wishlist

urlpatterns = [
    path('', get_wishlist, name='get_wishlist'),
    path('add/', add_to_wishlist, name='add_to_wishlist'),
    path('remove/<str:product_id>/', remove_from_wishlist, name='remove_from_wishlist'),
]
