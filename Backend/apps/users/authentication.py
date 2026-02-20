from rest_framework_simplejwt.authentication import JWTAuthentication
from apps.users.models.user_model import User
from rest_framework import exceptions

class MongoJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        try:
            user_id = validated_token['user_id']
            user = User.objects.get(id=user_id)
            return user
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed('User not found', code='user_not_found')
        except Exception as e:
            raise exceptions.AuthenticationFailed(str(e))
