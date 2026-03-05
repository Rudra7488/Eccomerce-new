from rest_framework import serializers

class AddressSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    street = serializers.CharField(required=True)
    city = serializers.CharField(required=True)
    state = serializers.CharField(required=True)
    zip_code = serializers.CharField(required=True)
    country = serializers.CharField(required=True)
    phone = serializers.CharField(required=True)
    is_default = serializers.BooleanField(default=False)
