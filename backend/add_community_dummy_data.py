#!/usr/bin/env python
"""
Script to add dummy acts with images to the community feed
Usage: python add_community_dummy_data.py <backend_url> <access_token>

Example: python add_community_dummy_data.py https://christmas-backend-je1j.onrender.com YOUR_JWT_TOKEN
"""

import os
import sys
import requests
import json
from datetime import datetime

# Sample acts with images (using public image URLs)
DUMMY_ACTS = [
    {
        "description": "Organized a community food drive and distributed meals to 50+ families in need! 🍔❤️",
        "category": "food",
        "latitude": 19.0760,
        "longitude": 72.8777,
        "city": "Mumbai",
        "country": "India",
        "evidence_url": "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800",
        "submitted_by": "",
        "is_anonymous": False,
    },
    {
        "description": "Donated warm clothes to a local shelter. Every person deserves to stay warm this winter! 🧥✨",
        "category": "clothing",
        "latitude": 28.6139,
        "longitude": 77.2090,
        "city": "Delhi",
        "country": "India",
        "evidence_url": "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800",
        "submitted_by": "",
        "is_anonymous": False,
    },
    {
        "description": "Spent the weekend volunteering at an animal shelter. Helping our furry friends find loving homes! 🐾💕",
        "category": "time",
        "latitude": 12.9716,
        "longitude": 77.5946,
        "city": "Bangalore",
        "country": "India",
        "evidence_url": "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800",
        "submitted_by": "",
        "is_anonymous": False,
    },
    {
        "description": "Raised money through a bake sale and donated it to help build a school library! 📚🎂",
        "category": "money",
        "latitude": 18.5204,
        "longitude": 73.8567,
        "city": "Pune",
        "country": "India",
        "evidence_url": "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=800",
        "submitted_by": "",
        "is_anonymous": False,
    },
    {
        "description": "Helped clean up the local beach with friends. Protecting our oceans one piece of trash at a time! 🌊♻️",
        "category": "time",
        "latitude": 13.0827,
        "longitude": 80.2707,
        "city": "Chennai",
        "country": "India",
        "evidence_url": "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800",
        "submitted_by": "",
        "is_anonymous": False,
    },
    {
        "description": "Organized a free health checkup camp for the elderly in our neighborhood! 💊❤️",
        "category": "time",
        "latitude": 22.5726,
        "longitude": 88.3639,
        "city": "Kolkata",
        "country": "India",
        "evidence_url": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
        "submitted_by": "",
        "is_anonymous": False,
    },
    {
        "description": "Donated books to a children's library. Knowledge is the best gift we can give! 📖🌟",
        "category": "other",
        "latitude": 23.0225,
        "longitude": 72.5714,
        "city": "Ahmedabad",
        "country": "India",
        "evidence_url": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
        "submitted_by": "",
        "is_anonymous": False,
    },
    {
        "description": "Helped plant 100 trees in our local park. Making our community greener! 🌳🌿",
        "category": "time",
        "latitude": 26.9124,
        "longitude": 75.7873,
        "city": "Jaipur",
        "country": "India",
        "evidence_url": "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800",
        "submitted_by": "",
        "is_anonymous": False,
    },
    {
        "description": "Organized a charity run and raised funds for cancer research! 🏃‍♀️💪",
        "category": "money",
        "latitude": 17.3850,
        "longitude": 78.4867,
        "city": "Hyderabad",
        "country": "India",
        "evidence_url": "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800",
        "submitted_by": "",
        "is_anonymous": False,
    },
    {
        "description": "Cooked and served meals at a homeless shelter. Spreading love through food! 🍲❤️",
        "category": "food",
        "latitude": 19.0760,
        "longitude": 72.8777,
        "city": "Mumbai",
        "country": "India",
        "evidence_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
        "submitted_by": "",
        "is_anonymous": False,
    },
]

def add_dummy_acts(backend_url, access_token):
    """Add dummy acts to the backend"""
    api_url = f"{backend_url.rstrip('/')}/api/acts/"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }
    
    print(f"Adding dummy acts to {api_url}")
    print(f"Total acts to add: {len(DUMMY_ACTS)}\n")
    
    successful = 0
    failed = 0
    
    for i, act in enumerate(DUMMY_ACTS, 1):
        try:
            response = requests.post(api_url, json=act, headers=headers, timeout=30)
            
            if response.status_code in [200, 201]:
                print(f"✅ [{i}/{len(DUMMY_ACTS)}] Added: {act['description'][:50]}...")
                successful += 1
            else:
                print(f"❌ [{i}/{len(DUMMY_ACTS)}] Failed: {response.status_code} - {response.text[:100]}")
                failed += 1
        except Exception as e:
            print(f"❌ [{i}/{len(DUMMY_ACTS)}] Error: {str(e)}")
            failed += 1
    
    print(f"\n{'='*50}")
    print(f"✅ Successfully added: {successful}")
    print(f"❌ Failed: {failed}")
    print(f"{'='*50}")

def main():
    if len(sys.argv) < 3:
        print("Usage: python add_community_dummy_data.py <backend_url> <access_token>")
        print("\nExample:")
        print("  python add_community_dummy_data.py https://christmas-backend-je1j.onrender.com eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...")
        sys.exit(1)
    
    backend_url = sys.argv[1]
    access_token = sys.argv[2]
    
    # Validate URL
    if not backend_url.startswith(('http://', 'https://')):
        print("Error: Backend URL must start with http:// or https://")
        sys.exit(1)
    
    # Add dummy acts
    add_dummy_acts(backend_url, access_token)

if __name__ == "__main__":
    main()

