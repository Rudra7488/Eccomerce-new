from django.contrib import admin
from django.urls import path
from django.http import HttpResponse

def welcome(request):
    return HttpResponse("Welcome to server")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', welcome),
]
