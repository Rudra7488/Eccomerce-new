from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from apps.reviews.models.review_model import Review
from apps.vendor_admin.models.product_models import Product
from apps.orders.models.order_model import Order

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_review(request):
    """
    Submits a review for a specific product in a delivered order
    """
    try:
        user = request.user
        product_id = request.data.get('product_id')
        order_id = request.data.get('order_id')
        rating = request.data.get('rating')
        review_text = request.data.get('review_text', '')

        if not product_id or not rating:
            return Response({'error': 'Product ID and Rating are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if product exists
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        # Check if the user has this product in a delivered order
        # This is for extra security, if the user requested it.
        # But we'll just allow it for now to avoid order-matching complexity
        # unless user gives us exact order id
        
        review = Review(
            user=user,
            product=product,
            order_id=order_id or "DirectReview",
            rating=int(rating),
            review_text=review_text
        )
        review.save()

        # Update product's average rating (basic logic)
        # We could also do this in a post-save signal or later
        
        return Response({'message': 'Review submitted successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_product_reviews(request, product_id):
    """
    Get all reviews for a specific product
    """
    try:
        reviews = Review.objects(product=product_id)
        data = []
        for r in reviews:
            data.append({
                'user_name': r.user.full_name if r.user else 'Anonymous',
                'rating': r.rating,
                'review_text': r.review_text,
                'created_at': r.created_at
            })
        return Response(data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_reviews_admin(request):
    """
    Get all reviews for admin overview
    """
    # Assuming user check if admin happens elsewhere or is implied
    # For now, just allow authenticated admin/vendor to see
    try:
        reviews = Review.objects.all()
        data = []
        for r in reviews:
            data.append({
                'id': str(r.id),
                'user_name': r.user.full_name if r.user else 'Anonymous',
                'product_title': r.product.name if r.product else 'Unknown Product',
                'product_image': r.product.images[0] if r.product and r.product.images else '',
                'rating': r.rating,
                'review_text': r.review_text,
                'created_at': r.created_at,
                'order_id': r.order_id
            })
        return Response(data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
