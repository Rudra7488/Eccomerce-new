from rest_framework import serializers
from apps.cart.models import Cart
from apps.vendor_admin.serializers.product_serializers import ProductListSerializer

class CartItemSerializer(serializers.Serializer):
    product = ProductListSerializer(read_only=True)
    quantity = serializers.IntegerField(min_value=1)
    total_price = serializers.SerializerMethodField()

    def get_total_price(self, obj):
        return obj.product.price * obj.quantity

class CartSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    items = CartItemSerializer(many=True, read_only=True)
    total_quantity = serializers.SerializerMethodField()
    total_amount = serializers.SerializerMethodField()
    updated_at = serializers.DateTimeField(read_only=True)

    def get_total_quantity(self, obj):
        return sum(item.quantity for item in obj.items)

    def get_total_amount(self, obj):
        return sum(item.product.price * item.quantity for item in obj.items)
