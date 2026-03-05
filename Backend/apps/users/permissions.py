from rest_framework.permissions import BasePermission

class IsAdminRole(BasePermission):
    """
    Allows access only to users with 'admin' role.
    """
    def has_permission(self, request, view):
        return bool(request.user and hasattr(request.user, 'role') and request.user.role == 'admin')
