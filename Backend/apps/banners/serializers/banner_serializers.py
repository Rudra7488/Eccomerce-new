from rest_framework import serializers

class BannerSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    title = serializers.CharField(required=False, allow_blank=True)
    description = serializers.CharField(required=False, allow_blank=True)
    image_url = serializers.CharField(required=True)
    link_url = serializers.CharField(required=False, allow_blank=True)
    is_active = serializers.BooleanField(default=True)
    order = serializers.IntegerField(default=0)
    created_at = serializers.DateTimeField(read_only=True)
