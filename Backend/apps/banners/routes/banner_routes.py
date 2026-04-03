from django.urls import path
from apps.banners.controllers.banner_controller import (
    get_active_banners, 
    get_all_banners_admin,
    create_banner, 
    update_banner,
    delete_banner
)

urlpatterns = [
    path('active/', get_active_banners, name='active-banners'),
    path('admin/all/', get_all_banners_admin, name='all-banners-admin'),
    path('create/', create_banner, name='create-banner'),
    path('<str:banner_id>/update/', update_banner, name='update-banner'),
    path('<str:banner_id>/delete/', delete_banner, name='delete-banner'),
]
