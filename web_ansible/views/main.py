from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required
def main(request):
    print("Gilmar",request.user)
    #return HttpResponse("Hello, world. You're at the polls index.")
    return render(request, 'web_ansible/index.html')
