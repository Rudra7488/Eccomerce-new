from rest_framework import serializers

class CustomerSerializer(serializers.Serializer):
    id = serializers.SerializerMethodField()
    full_name = serializers.CharField()
    email = serializers.EmailField()
    role = serializers.CharField()
    created_at = serializers.DateTimeField()

    def get_id(self, obj):
        return str(obj.id)
