import re
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from apps.users.models.user_model import User
from apps.users.serializers.auth_serializers import UserSignupSerializer, UserLoginSerializer
from utils.email_utils import send_welcome_email

class SignupView(APIView):
    def post(self, request):
        data = request.data
        full_name = data.get('full_name')
        email = data.get('email')
        password = data.get('password')

        # 3. Required Field Validation
        if not full_name or not email or not password:
            return Response({"error": "full_name, email, and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Email Validation
        # Using the regex pattern provided by the user, with escaped dot for literal matching
        email_regex = r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
        if not re.match(email_regex, email):
            return Response({"error": "Invalid email format"}, status=status.HTTP_400_BAD_REQUEST)

        # 4. Password Validation
        if len(password) < 6:
            return Response({"error": "Password must be at least 6 characters long"}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Duplicate Email Check
        if User.objects(email=email).first():
            return Response({"error": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User(
                full_name=full_name,
                email=email
            )
            user.set_password(password)
            user.save()

            # Send welcome email
            try:
                send_welcome_email({"full_name": full_name, "email": email})
            except Exception as e:
                print(f"Error sending welcome email: {e}")

            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

from rest_framework_simplejwt.tokens import RefreshToken, TokenError

class LogoutView(APIView):
    def post(self, request):
        try:
            # Note: With MongoEngine, we can't use SimpleJWT's built-in token blacklist 
            # because it requires Django ORM models. For now, we return success 
            # and the frontend will clear the tokens locally.
            return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Logout Error: {str(e)}")
            return Response({"error": "An error occurred during logout."}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = User.objects(email=email).first()

            if user and user.check_password(password):
                # Manually create token to avoid RefreshToken.for_user which 
                # might still try to access Django-specific attributes
                refresh = RefreshToken()
                refresh['user_id'] = str(user.id)
                refresh['email'] = user.email
                # Since we are using mongoengine, we need to handle user_id manually if SimpleJWT expects a Django User object
                # But SimpleJWT can be customized or we can just return the tokens.
                # For simplicity, we'll return tokens and user info.
                return Response({
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "user": {
                        "id": str(user.id),
                        "email": user.email,
                        "full_name": user.full_name,
                        "role": user.role
                    }
                }, status=status.HTTP_200_OK)
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
