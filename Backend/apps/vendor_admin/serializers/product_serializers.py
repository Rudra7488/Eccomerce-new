from rest_framework import serializers
from ..models.product_models import Product


class ProductVariantSerializer(serializers.Serializer):
    size = serializers.CharField()
    price = serializers.FloatField()
    stock = serializers.IntegerField(default=0)

class ProductSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField(max_length=255, required=True)
    description = serializers.CharField(required=True)
    price = serializers.FloatField(required=True)
    stock_quantity = serializers.IntegerField(default=0)
    category = serializers.CharField(max_length=100, required=False)
    product_type = serializers.CharField(required=False, default="Solid")
    unit_type = serializers.CharField(required=False, default="g")
    unit_value = serializers.FloatField(required=False, default=0.0)
    expiry_date = serializers.DateTimeField(required=False, allow_null=True)
    variants = ProductVariantSerializer(many=True, required=False, default=list)
    ingredients = serializers.CharField(required=False, allow_blank=True, default="")
    uses = serializers.CharField(required=False, allow_blank=True, default="")
    dose = serializers.CharField(required=False, allow_blank=True, default="")
    contra_indications = serializers.CharField(required=False, allow_blank=True, default="")
    images = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    vendor = serializers.CharField(required=True)  # Will be handled separately
    is_active = serializers.BooleanField(default=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)


class ProductListSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField(max_length=255, required=True)
    description = serializers.CharField(required=True)
    price = serializers.FloatField(required=True)
    stock_quantity = serializers.IntegerField(default=0)
    category = serializers.CharField(max_length=100, required=False)
    product_type = serializers.CharField(required=False, default="Solid")
    unit_type = serializers.CharField(required=False, default="g")
    unit_value = serializers.FloatField(required=False, default=0.0)
    expiry_date = serializers.DateTimeField(required=False, allow_null=True)
    variants = ProductVariantSerializer(many=True, required=False, default=list)
    ingredients = serializers.CharField(required=False, allow_blank=True, default="")
    uses = serializers.CharField(required=False, allow_blank=True, default="")
    dose = serializers.CharField(required=False, allow_blank=True, default="")
    contra_indications = serializers.CharField(required=False, allow_blank=True, default="")
    images = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    vendor = serializers.SerializerMethodField()
    vendor_name = serializers.SerializerMethodField()
    vendor_email = serializers.SerializerMethodField()
    is_active = serializers.BooleanField(default=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    def get_vendor(self, obj):
        return str(obj.vendor.id) if obj.vendor else None

    def get_vendor_name(self, obj):
        return obj.vendor.full_name if obj.vendor else "Unknown"

    def get_vendor_email(self, obj):
        return obj.vendor.email if obj.vendor else "Unknown"


class VendorProductSerializer(serializers.Serializer):
    """
    Serializer specifically for vendors to manage their own products
    """
    id = serializers.CharField(read_only=True)
    name = serializers.CharField(max_length=255, required=True)
    description = serializers.CharField(required=True)
    price = serializers.FloatField(required=True)
    stock_quantity = serializers.IntegerField(default=0)
    category = serializers.CharField(max_length=100, required=False)
    product_type = serializers.CharField(required=False, default="Solid")
    unit_type = serializers.CharField(required=False, default="g")
    unit_value = serializers.FloatField(required=False, default=0.0)
    expiry_date = serializers.DateTimeField(required=False, allow_null=True)
    variants = ProductVariantSerializer(many=True, required=False, default=list)
    ingredients = serializers.CharField(required=False, allow_blank=True, default="")
    uses = serializers.CharField(required=False, allow_blank=True, default="")
    dose = serializers.CharField(required=False, allow_blank=True, default="")
    contra_indications = serializers.CharField(required=False, allow_blank=True, default="")
    images = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    is_active = serializers.BooleanField(default=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)