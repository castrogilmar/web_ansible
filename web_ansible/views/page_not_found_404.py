from django.shortcuts import render

def page_not_found(request, exception):
    data = {"name": "ThePythonDjango.com"}
    return render(request, 'web_ansible/404.html', data)
