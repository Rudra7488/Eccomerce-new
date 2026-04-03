from django.urls import path
from apps.coupons.views.coupon_views import CouponListView, CouponDetailView, ValidateCouponView, PublicCouponListView

urlpatterns = [
    # Admin CRUD routes
    path('admin/', CouponListView.as_view(), name='admin_coupon_list'),
    path('admin/<str:coupon_id>/', CouponDetailView.as_view(), name='admin_coupon_detail'),
    
    # Public routes
    path('public/list/', PublicCouponListView.as_view(), name='public_coupon_list'),
    path('validate/', ValidateCouponView.as_view(), name='validate_coupon'),
]
