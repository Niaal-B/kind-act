import os
import requests
from django.conf import settings
from decouple import config

def get_santa_response(user_message, user_name, chat_history=None, acts_of_kindness=None):
    """
    Get AI response from Santa using Groq API
    """
    # Try to get API key from environment or .env file
    api_key = config('GROQ_API_KEY', default=None)
    
    if not api_key:
        print("ERROR: GROQ_API_KEY not found. Please set it in your .env file or environment variables.")
        return get_fallback_response(user_name)
    
    # Build context about user's acts of kindness
    acts_context = ""
    if acts_of_kindness:
        acts_context = "\n\nRecent Acts of Kindness:\n"
        for act in acts_of_kindness:
            acts_context += f"- {act['title']}: {act['description']} ({act['category']})\n"
    
    # Build chat history context
    history_context = ""
    if chat_history:
        history_context = "\n\nRecent conversation:\n"
        for msg in reversed(chat_history[:5]):  # Last 5 messages
            if msg.is_from_user:
                history_context += f"User: {msg.message}\n"
            else:
                history_context += f"Santa: {msg.response}\n"
    
    # System prompt for Santa
    system_prompt = f"""You are Santa Claus, a jolly, kind, and wise figure who spreads Christmas cheer. 
You're chatting with {user_name}, a child who has been doing acts of kindness.

Your personality:
- Warm, friendly, and encouraging
- Use Christmas-themed language (Ho ho ho, Merry Christmas, etc.)
- Be proud and happy about their acts of kindness
- Answer questions about Christmas, kindness, and their progress
- Keep responses concise (2-4 sentences typically)
- Be age-appropriate and positive
- Use emojis occasionally (🎄🎅🎁✨)

{acts_context}
{history_context}

Respond as Santa would, being encouraging and festive!"""

    # Groq API endpoint (OpenAI-compatible format)
    api_url = "https://api.groq.com/openai/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    # Prepare messages
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_message}
    ]
    
    payload = {
        "model": "llama-3.1-8b-instant",  # Groq's fast and available model
        "messages": messages,
        "temperature": 0.8,  # More creative responses
        "max_tokens": 200,  # Keep responses concise
    }
    
    try:
        print(f"Calling Groq API with model: {payload['model']}")
        response = requests.post(api_url, json=payload, headers=headers, timeout=30)
        print(f"Groq API response status: {response.status_code}")
        
        response.raise_for_status()
        
        data = response.json()
        santa_response = data['choices'][0]['message']['content'].strip()
        print(f"Groq API success! Response length: {len(santa_response)}")
        return santa_response
        
    except requests.exceptions.RequestException as e:
        print(f"Groq API error: {e}")
        if hasattr(e, 'response') and e.response is not None:
            try:
                error_data = e.response.json()
                print(f"Groq API error response: {error_data}")
            except:
                print(f"Groq API error response text: {e.response.text}")
        return get_fallback_response(user_name)
    except Exception as e:
        print(f"Unexpected error calling Groq API: {e}")
        import traceback
        traceback.print_exc()
        return get_fallback_response(user_name)

def get_fallback_response(user_name):
    """Fallback response if API fails"""
    import random
    fallback_responses = [
        f"Ho ho ho! {user_name}, I'm having trouble with my magic right now, but I'm so proud of all your acts of kindness! Keep spreading joy! 🎄",
        f"Merry Christmas, {user_name}! My reindeer are a bit busy, but I want you to know you're doing amazing things! 🎅✨",
        f"Ho ho ho! {user_name}, even when my workshop is busy, I can see all the good you're doing! Keep it up! 🎁🎄"
    ]
    return random.choice(fallback_responses)

