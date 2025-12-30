from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from .models import ChatMessage
from .serializers import ChatMessageSerializer
from .ai_service import get_santa_response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_history(request):
    """Get chat history for the authenticated user"""
    messages = ChatMessage.objects.filter(user=request.user).order_by('created_at')[:50]
    serializer = ChatMessageSerializer(messages, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request):
    """Send a message to Santa and get AI response"""
    user_message = request.data.get('message', '').strip()
    
    if not user_message:
        return Response(
            {'error': 'Message cannot be empty'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Rate limiting: max 30 messages per hour per user
    cache_key = f"chat_rate_limit_{request.user.id}"
    message_count = cache.get(cache_key, 0)
    
    if message_count >= 30:
        return Response(
            {'error': 'You\'ve sent too many messages. Please wait a bit before chatting again!'}, 
            status=status.HTTP_429_TOO_MANY_REQUESTS
        )
    
    # Increment counter (expires in 1 hour)
    cache.set(cache_key, message_count + 1, 3600)
    
    # Save user message
    user_msg = ChatMessage.objects.create(
        user=request.user,
        message=user_message,
        response='',
        is_from_user=True
    )
    
    # Get recent chat history for context
    recent_messages = ChatMessage.objects.filter(
        user=request.user
    ).order_by('-created_at')[:10]
    
    # Get user's acts of kindness for context
    try:
        from acts.models import Act
        user_acts = Act.objects.filter(user=request.user).order_by('-created_at')[:5]
        acts_context = [
            {
                'title': act.title,
                'description': act.description,
                'category': act.category,
                'created_at': act.created_at.isoformat()
            }
            for act in user_acts
        ]
    except:
        acts_context = []
    
    # Get AI response from Santa
    try:
        santa_response = get_santa_response(
            user_message=user_message,
            user_name=request.user.username,
            chat_history=recent_messages,
            acts_of_kindness=acts_context
        )
        
        # Create Santa's response message (don't modify the user message)
        santa_msg = ChatMessage.objects.create(
            user=request.user,
            message='',
            response=santa_response,
            is_from_user=False
        )
        
        return Response({
            'user_message': ChatMessageSerializer(user_msg).data,
            'santa_message': ChatMessageSerializer(santa_msg).data
        })
        
    except Exception as e:
        print(f"Error in send_message: {e}")
        return Response(
            {'error': f'Failed to get response from Santa: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

