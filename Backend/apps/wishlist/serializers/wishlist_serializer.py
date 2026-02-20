from rest_framework import serializers
from apps.wishlist.models.wishlist_model import Wishlist
from apps.vendor_admin.serializers.product_serializers import ProductListSerializer

class WishlistSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    products = ProductListSerializer(many=True, read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
