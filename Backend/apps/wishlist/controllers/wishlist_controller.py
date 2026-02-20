from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from apps.wishlist.models.wishlist_model import Wishlist
from apps.vendor_admin.models.product_models import Product
from apps.wishlist.serializers.wishlist_serializer import WishlistSerializer
from apps.users.models.user_model import User

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_wishlist(request):
    try:
        user = request.user
        wishlist = Wishlist.objects(user=user).first()
        if not wishlist:
            wishlist = Wishlist(user=user)
            wishlist.save()
            
        serializer = WishlistSerializer(wishlist)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_wishlist(request):
    try:
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({'error': 'Product ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        wishlist = Wishlist.objects(user=user).first()
        if not wishlist:
            wishlist = Wishlist(user=user)
            wishlist.save()
        
        # Check if product already in wishlist
        if product in wishlist.products:
            return Response({'message': 'Product already in wishlist'}, status=status.HTTP_200_OK)
            
        wishlist.products.append(product)
        wishlist.save()
        
        serializer = WishlistSerializer(wishlist)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_wishlist(request, product_id):
    try:
        user = request.user
        wishlist = Wishlist.objects(user=user).first()
        
        if not wishlist:
            return Response({'error': 'Wishlist not found'}, status=status.HTTP_404_NOT_FOUND)
            
        # Find product to remove
        product_to_remove = None
        for product in wishlist.products:
            if str(product.id) == product_id:
                product_to_remove = product
                break
        
        if product_to_remove:
            wishlist.products.remove(product_to_remove)
            wishlist.save()
            return Response({'message': 'Product removed from wishlist'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Product not found in wishlist'}, status=status.HTTP_404_NOT_FOUND)
            
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
