from django.urls import path
from apps.reviews.controllers.review_controller import submit_review, get_product_reviews, get_all_reviews_admin

urlpatterns = [
    path('submit/', submit_review, name='submit-review'),
    path('product/<str:product_id>/', get_product_reviews, name='get-product-reviews'),
    path('admin/all/', get_all_reviews_admin, name='get-all-reviews-admin'),
]
