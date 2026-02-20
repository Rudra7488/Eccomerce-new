from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from apps.cart.models import Cart, CartItem
from apps.vendor_admin.models.product_models import Product
from apps.cart.serializers import CartSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    try:
        user = request.user
        cart = Cart.objects(user=user).first()
        if not cart:
            cart = Cart(user=user)
            cart.save()
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    try:
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        
        if not product_id:
            return Response({'error': 'Product ID is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
            
        user = request.user
        cart = Cart.objects(user=user).first()
        if not cart:
            cart = Cart(user=user)
        
        # Check if product already in cart
        existing_item = None
        for item in cart.items:
            if str(item.product.id) == str(product.id):
                existing_item = item
                break
        
        if existing_item:
            existing_item.quantity += quantity
        else:
            cart.items.append(CartItem(product=product, quantity=quantity))
            
        cart.save()
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, product_id):
    try:
        user = request.user
        cart = Cart.objects(user=user).first()
        
        if not cart:
            return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)
            
        # Find item to remove
        item_to_remove = None
        for item in cart.items:
            if str(item.product.id) == product_id:
                item_to_remove = item
                break
        
        if item_to_remove:
            cart.items.remove(item_to_remove)
            cart.save()
            serializer = CartSerializer(cart)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Item not found in cart'}, status=status.HTTP_404_NOT_FOUND)
            
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def clear_cart(request):
    try:
        user = request.user
        cart = Cart.objects(user=user).first()
        if cart:
            cart.items = []
            cart.save()
        return Response({'message': 'Cart cleared'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
