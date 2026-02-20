from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def welcome(request):
    return HttpResponse("Welcome to server")

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/vendor-admin/', include('apps.vendor_admin.urls.__init__')),
    path('api/auth/', include('apps.users.routes.auth_routes')),
    path('api/products/', include('apps.products.routes.product_routes')),
    path('api/wishlist/', include('apps.wishlist.routes.wishlist_routes')),
    path('api/cart/', include('apps.cart.urls')),
    path('', welcome),
]
