from rest_framework import serializers
from apps.cart.models import Cart
from apps.vendor_admin.serializers.product_serializers import ProductListSerializer

class CartItemSerializer(serializers.Serializer):
    product = ProductListSerializer(read_only=True)
    quantity = serializers.IntegerField(min_value=1)
    variant_size = serializers.CharField(required=False, allow_null=True)
    total_price = serializers.SerializerMethodField()

    def get_total_price(self, obj):
        # Calculate price based on variant if available
        if obj.variant_size and obj.product.variants:
            for v in obj.product.variants:
                if v.size == obj.variant_size:
                    return v.price * obj.quantity
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
        total = 0
        for item in obj.items:
            item_price = item.product.price
            if item.variant_size and item.product.variants:
                for v in item.product.variants:
                    if v.size == item.variant_size:
                        item_price = v.price
                        break
            total += item_price * item.quantity
        return total
