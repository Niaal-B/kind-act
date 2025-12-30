from django.urls import path
from . import views

urlpatterns = [
    path('history/', views.get_chat_history, name='chat_history'),
    path('send/', views.send_message, name='send_message'),
]

