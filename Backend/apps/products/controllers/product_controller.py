from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from apps.vendor_admin.models.product_models import Product
from apps.vendor_admin.serializers.product_serializers import ProductListSerializer


@api_view(['GET'])
def get_public_products(request):
    """
    Get all active products for public/user dashboard
    """
    # Only return active products
    products = Product.objects(is_active=True)
    serializer = ProductListSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_product_detail(request, product_id):
    """
    Get a specific product detail for user dashboard
    """
    try:
        product = Product.objects.get(id=product_id, is_active=True)
        serializer = ProductListSerializer(product)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)