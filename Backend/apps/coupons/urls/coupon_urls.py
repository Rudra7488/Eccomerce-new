from django.urls import path
from apps.coupons.views.coupon_views import CouponListView, CouponDetailView, ValidateCouponView

urlpatterns = [
    # Admin CRUD routes
    path('admin/', CouponListView.as_view(), name='admin_coupon_list'),
    path('admin/<str:coupon_id>/', CouponDetailView.as_view(), name='admin_coupon_detail'),
    
    # Public validation route
    path('validate/', ValidateCouponView.as_view(), name='validate_coupon'),
]
