from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TreeDecorationViewSet

router = DefaultRouter()
router.register(r'decorations', TreeDecorationViewSet, basename='tree-decoration')

urlpatterns = [
    path('', include(router.urls)),
]

