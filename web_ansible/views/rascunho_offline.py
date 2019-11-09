from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required
def rascoffline_view(request):
    print("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
    return render(request, 'web_ansible/rascunho_offline.html')
