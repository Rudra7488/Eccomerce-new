from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from apps.banners.models.banner_model import Banner
from apps.banners.serializers.banner_serializers import BannerSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def get_active_banners(request):
    """Get all active banners for the slider"""
    banners = Banner.objects(is_active=True)
    serializer = BannerSerializer(banners, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_banners_admin(request):
    """Get all banners for admin panel"""
    banners = Banner.objects.all()
    serializer = BannerSerializer(banners, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_banner(request):
    """Create a new banner (Admin Only)"""
    data = request.data
    serializer = BannerSerializer(data=data)
    if serializer.is_valid():
        banner = Banner(**serializer.validated_data)
        banner.save()
        return Response(BannerSerializer(banner).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_banner(request, banner_id):
    """Update an existing banner (Admin Only)"""
    try:
        banner = Banner.objects.get(id=banner_id)
        data = request.data
        serializer = BannerSerializer(data=data, partial=True)
        if serializer.is_valid():
            for key, value in serializer.validated_data.items():
                setattr(banner, key, value)
            banner.save()
            return Response(BannerSerializer(banner).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Banner.DoesNotExist:
        return Response({'error': 'Banner not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_banner(request, banner_id):
    """Delete a banner (Admin Only)"""
    try:
        banner = Banner.objects.get(id=banner_id)
        banner.delete()
        return Response({'message': 'Banner deleted successfully'}, status=status.HTTP_200_OK)
    except Banner.DoesNotExist:
        return Response({'error': 'Banner not found'}, status=status.HTTP_404_NOT_FOUND)
