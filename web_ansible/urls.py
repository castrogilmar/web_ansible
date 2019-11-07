from django.urls import path, include

from .views import *
from django.views.generic import TemplateView

urlpatterns = [
    path('login', login_view, name='login'),
    path('logout', logout_view, name='logout'),
    path('', main, name='main'),
    path('sw.js', (TemplateView.as_view(template_name="web_ansible/sw.js", content_type='application/javascript', )), name='sw.js'),
]

