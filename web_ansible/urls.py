from django.urls import path, include

from .views import *
from django.views.generic import TemplateView

urlpatterns = [
    path('login', login_view, name='login'),
    path('logout', logout_view, name='logout'),
    path('', main, name='main'),
    path(r'rascunho_offline/', rascoffline_view, name='rascoffline'),
    path(r'rascunho_offline/sw.js', (TemplateView.as_view(template_name="web_ansible/rascunho_offline/sw.js", content_type='application/javascript', )), name='sw.js'),
]

