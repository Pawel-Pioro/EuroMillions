from django.urls import path
from . import views

urlpatterns = [
    path('generateNumbers', views.generateNumbers),
    path('returnResult', views.returnResult),
]