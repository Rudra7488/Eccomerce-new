import re
from rest_framework import serializers
from apps.users.models.user_model import User

class UserSignupSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)

    def validate_email(self, value):
        # Using the regex pattern provided by the user, with escaped dot for literal matching
        email_regex = r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
        if not re.match(email_regex, value):
            raise serializers.ValidationError("Invalid email format")

        if User.objects(email=value).first():
            raise serializers.ValidationError("Email already registered")
        return value

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
