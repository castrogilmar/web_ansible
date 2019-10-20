from django.shortcuts import redirect
from django.contrib.auth import authenticate, logout

def logout_view(request):
    
    logout(request)
    return redirect('login')
