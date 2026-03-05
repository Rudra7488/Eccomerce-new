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
    
    print(f"Authenticated user: {request.user}")
    print(f"Request data: {request.data}")
    
    serializer = VendorProductSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        # Create the product with the authenticated user as vendor
        try:
            # Need to handle variants correctly for MongoEngine
            from apps.vendor_admin.models.product_models import ProductVariant
            variants_data = data.get('variants', [])
            variants = [ProductVariant(**v) for v in variants_data]
            
            product = Product(
                name=data['name'],
                description=data['description'],
                price=float(data['price']),
                stock_quantity=int(data.get('stock_quantity', 0)),
                category=data.get('category', ''),
                product_type=data.get('product_type', 'Solid'),
                unit_type=data.get('unit_type', 'g'),
                unit_value=float(data.get('unit_value', 0.0)),
                expiry_date=data.get('expiry_date'),
                variants=variants,
                ingredients=data.get('ingredients', ''),
                uses=data.get('uses', ''),
                dose=data.get('dose', ''),
                contra_indications=data.get('contra_indications', ''),
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
        
        serializer = VendorProductSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            data = serializer.validated_data
            
            # Update allowed fields
            if 'name' in data:
                product.name = data['name']
            if 'description' in data:
                product.description = data['description']
            if 'price' in data:
                product.price = float(data['price'])
            if 'stock_quantity' in data:
                product.stock_quantity = int(data['stock_quantity'])
            if 'category' in data:
                product.category = data['category']
            if 'product_type' in data:
                product.product_type = data['product_type']
            if 'unit_type' in data:
                product.unit_type = data['unit_type']
            if 'unit_value' in data:
                product.unit_value = float(data['unit_value'])
            if 'expiry_date' in data:
                product.expiry_date = data['expiry_date']
            if 'variants' in data:
                # Need to handle variants correctly for MongoEngine
                from apps.vendor_admin.models.product_models import ProductVariant
                product.variants = [ProductVariant(**v) for v in data['variants']]
            if 'ingredients' in data:
                product.ingredients = data['ingredients']
            if 'uses' in data:
                product.uses = data['uses']
            if 'dose' in data:
                product.dose = data['dose']
            if 'contra_indications' in data:
                product.contra_indications = data['contra_indications']
            if 'images' in data:
                product.images = data['images']
            if 'is_active' in data:
                product.is_active = data['is_active']
                
            product.save()
            
            response_serializer = ProductListSerializer(product)
            return Response(response_serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


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