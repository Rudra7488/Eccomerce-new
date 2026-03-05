from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from apps.users.permissions import IsAdminRole
from apps.coupons.models.coupon_model import Coupon
from apps.coupons.serializers.coupon_serializer import CouponSerializer
from bson import ObjectId

class CouponListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        coupons = Coupon.objects.all().order_by('-created_at')
        serializer = CouponSerializer(coupons, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CouponSerializer(data=request.data)
        if serializer.is_valid():
            # Check if coupon code already exists
            code = serializer.validated_data['code'].upper()
            if Coupon.objects(code=code).first():
                return Response({"error": "Coupon code already exists"}, status=status.HTTP_400_BAD_REQUEST)
            
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CouponDetailView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get_object(self, coupon_id):
        try:
            return Coupon.objects.get(id=ObjectId(coupon_id))
        except (Coupon.DoesNotExist, Exception):
            return None

    def get(self, request, coupon_id):
        coupon = self.get_object(coupon_id)
        if not coupon:
            return Response({"error": "Coupon not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = CouponSerializer(coupon)
        return Response(serializer.data)

    def put(self, request, coupon_id):
        coupon = self.get_object(coupon_id)
        if not coupon:
            return Response({"error": "Coupon not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CouponSerializer(coupon, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, coupon_id):
        coupon = self.get_object(coupon_id)
        if not coupon:
            return Response({"error": "Coupon not found"}, status=status.HTTP_404_NOT_FOUND)
        
        coupon.delete()
        return Response({"message": "Coupon deleted successfully"}, status=status.HTTP_200_OK)

class ValidateCouponView(APIView):
    """
    Public view for users to validate a coupon code during checkout
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        code = request.data.get('code', '').upper()
        purchase_amount = float(request.data.get('purchase_amount', 0))

        if not code:
            return Response({"error": "Coupon code is required"}, status=status.HTTP_400_BAD_REQUEST)

        coupon = Coupon.objects(code=code).first()
        if not coupon:
            return Response({"error": "Invalid coupon code"}, status=status.HTTP_404_NOT_FOUND)

        # Check status
        current_status = coupon.status
        if current_status == 'upcoming':
            return Response({"error": f"Coupon starts on {coupon.start_date.strftime('%Y-%m-%d')}"}, status=status.HTTP_400_BAD_REQUEST)
        elif current_status == 'expired':
            return Response({"error": "Coupon has expired"}, status=status.HTTP_400_BAD_REQUEST)
        elif current_status == 'limit_reached':
            return Response({"error": "Coupon usage limit reached"}, status=status.HTTP_400_BAD_REQUEST)
        elif current_status == 'disabled':
            return Response({"error": "Coupon is currently disabled"}, status=status.HTTP_400_BAD_REQUEST)

        # Check min purchase
        if purchase_amount < coupon.min_purchase:
            return Response({
                "error": f"Minimum purchase amount required: ₹{coupon.min_purchase}"
            }, status=status.HTTP_400_BAD_REQUEST)

        # Coupon is valid
        serializer = CouponSerializer(coupon)
        return Response({
            "message": "Coupon applied successfully",
            "coupon": serializer.data
        }, status=status.HTTP_200_OK)
