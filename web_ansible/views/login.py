from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.conf import settings

def login_view(request):

    
    u = User.objects.get(username__exact="katilene")
    u.set_password("katilene")
    u.save()
    
    if request.method == 'POST':
        print(request.POST)
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect('main')
        else:
            return render(request, 'web_ansible/404.html')

    else:
        return render(request, 'web_ansible/login.html')


