from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from apps.users.models.user_model import User
from ..serializers.customer_serializers import CustomerSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_customers(request):
    """
    Get all registered customers (users)
    Only accessible by admin
    """
    try:
        # Get all users (customers) - Filter by role NOT EQUAL to 'admin'
        # This includes users with role='user' AND users where role field might be missing
        customers = User.objects(role__ne='admin').order_by('-created_at')
        
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_customer(request, customer_id):
    """
    Delete a customer by ID
    Only accessible by admin
    """
    try:
        # Check if user is admin
        if request.user.role != 'admin':
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            
        customer = User.objects(id=customer_id).first()
        if not customer:
            return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)
            
        customer.delete()
        return Response({'message': 'Customer deleted successfully'}, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
