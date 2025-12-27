from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ActViewSet

router = DefaultRouter()
router.register(r'acts', ActViewSet, basename='act')

urlpatterns = [
    path('', include(router.urls)),
]

