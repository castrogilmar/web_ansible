from django.shortcuts import render
from django.contrib.auth import authenticate, login

def login(request):
    
    if request.method == 'POST':
        print(request.POST)
        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(request, username=username, password=password)

        if user is not None:
            return render(request, 'web_ansible/index.html')
        else:
            return render(request, 'web_ansible/404.html')

    else:
        return render(request, 'web_ansible/login.html')


