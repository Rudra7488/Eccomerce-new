from rest_framework import serializers
from apps.coupons.models.coupon_model import Coupon

class CouponSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    code = serializers.CharField(max_length=50)
    discount_type = serializers.ChoiceField(choices=['percentage', 'fixed', 'shipping'])
    value = serializers.FloatField()
    min_purchase = serializers.FloatField(default=0.0)
    start_date = serializers.DateTimeField()
    end_date = serializers.DateTimeField()
    limit = serializers.IntegerField(default=0)
    usage_count = serializers.IntegerField(read_only=True)
    is_active = serializers.BooleanField(default=True)
    status = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        return Coupon.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
