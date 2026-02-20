from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from apps.vendor_admin.models.product_models import Product
from apps.vendor_admin.serializers.product_serializers import ProductListSerializer, VendorProductSerializer
from apps.users.models.user_model import User


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_products(request):
    """
    Get all products - accessible by admin
    """
    if request.user.role != 'admin':
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    products = Product.objects()
    serializer = ProductListSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_vendor_products(request):
    """
    Get products for the authenticated vendor
    """
    if request.user.role not in ['admin', 'vendor']:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    # If admin, they can view all products or filter by vendor
    if request.user.role == 'admin':
        vendor_id = request.query_params.get('vendor_id')
        if vendor_id:
            try:
                products = Product.objects(vendor=ObjectId(vendor_id))
            except Exception:
                return Response({'error': 'Invalid vendor ID'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            products = Product.objects()
    else:
        # Regular vendor can only see their own products
        products = Product.objects(vendor=request.user.id)
    
    serializer = ProductListSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_product(request, product_id):
    """
    Get a specific product
    """
    try:
        product = Product.objects.get(id=product_id)
        
        # Check permissions - admin can access any product, vendor can only access their own
        if request.user.role != 'admin' and str(product.vendor.id) != str(request.user.id):
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = ProductListSerializer(product)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_product(request):
    """
    Create a new product - vendors can only create products for themselves
    """
    if request.user.role not in ['admin', 'vendor']:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    # Ensure vendor is set to the authenticated user (for security)
    data = request.data.copy()
    
    print(f"Authenticated user: {request.user}")
    print(f"Request data: {request.data}")
    
    serializer = VendorProductSerializer(data=data)
    if serializer.is_valid():
        # Create the product with the authenticated user as vendor
        try:
            product = Product(
                name=data['name'],
                description=data['description'],
                price=float(data['price']),
                stock_quantity=int(data.get('stock_quantity', 0)),
                category=data.get('category', ''),
                images=data.get('images', []),
                vendor=request.user,
                is_active=data.get('is_active', True)
            )
            product.save()
        except Exception as e:
            import traceback
            print(f"Error saving product: {str(e)}")
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        response_serializer = ProductListSerializer(product)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    else:
        print(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_product(request, product_id):
    """
    Update a product - vendors can only update their own products
    """
    try:
        product = Product.objects.get(id=product_id)
        
        # Check permissions
        if request.user.role != 'admin' and str(product.vendor.id) != str(request.user.id):
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        # Update allowed fields
        if 'name' in request.data:
            product.name = request.data['name']
        if 'description' in request.data:
            product.description = request.data['description']
        if 'price' in request.data:
            product.price = float(request.data['price'])
        if 'stock_quantity' in request.data:
            product.stock_quantity = int(request.data['stock_quantity'])
        if 'category' in request.data:
            product.category = request.data['category']
        if 'images' in request.data:
            product.images = request.data['images']
        if 'is_active' in request.data:
            product.is_active = request.data['is_active']
            
        product.save()
        
        serializer = ProductListSerializer(product)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except ValueError:
        return Response({'error': 'Invalid data provided'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_product(request, product_id):
    """
    Delete a product - vendors can only delete their own products
    """
    try:
        product = Product.objects.get(id=product_id)
        
        # Check permissions
        if request.user.role != 'admin' and str(product.vendor.id) != str(request.user.id):
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        product.delete()
        return Response({'message': 'Product deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)