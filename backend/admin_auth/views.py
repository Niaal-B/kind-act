from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from decouple import config


@api_view(['POST'])
@permission_classes([AllowAny])
def check_password(request):
    """
    Simple password check for Santa dashboard access
    """
    password = request.data.get('password', '')
    
    # Get password from environment variable, default to 'santa2024'
    correct_password = config('SANTA_PASSWORD', default='santa2024')
    
    if password == correct_password:
        return Response({
            'success': True,
            'message': 'Access granted'
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'success': False,
            'message': 'Invalid password'
        }, status=status.HTTP_401_UNAUTHORIZED)
