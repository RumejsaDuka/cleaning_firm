from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('datenschutz/', views.datenschutz, name='datenschutz'),
    path('impressum/', views.impressum, name='impressum'),
]