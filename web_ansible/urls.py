from django.urls import path

from .views import *

urlpatterns = [
    path('', login, name='login'),
    path('logout', logout_view, name='logout'),
    path('main', main, name='main'),
]

