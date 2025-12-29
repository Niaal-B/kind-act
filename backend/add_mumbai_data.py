#!/usr/bin/env python
"""
Script to add 10 acts of kindness in Mumbai with images
Run with: python manage.py shell < add_mumbai_data.py
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'santa_project.settings')
django.setup()

from acts.models import Act, Category
from datetime import datetime, timedelta
import random

# Mumbai coordinates
MUMBAI_LAT = 19.0760
MUMBAI_LNG = 72.8777

# High-quality image URLs from Unsplash (free stock photos)
# These are real images that should work
mumbai_acts = [
    {
        'description': 'Organized a community meal drive for 300+ families in Dharavi. The joy on children\'s faces was priceless! 🍛❤️',
        'category': Category.FOOD,
        'latitude': MUMBAI_LAT + random.uniform(-0.01, 0.01),
        'longitude': MUMBAI_LNG + random.uniform(-0.01, 0.01),
        'city': 'Mumbai',
        'country': 'India',
        'submitted_by': 'Priya Sharma',
        'is_anonymous': False,
        'evidence_url': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80',
        'appreciation_count': 45,
        'created_at': datetime.now() - timedelta(days=2),
    },
    {
        'description': 'Donated 200 warm blankets to homeless shelters across Mumbai. Winter nights are tough, but together we can make them warmer! 🧥',
        'category': Category.CLOTHING,
        'latitude': MUMBAI_LAT + random.uniform(-0.01, 0.01),
        'longitude': MUMBAI_LNG + random.uniform(-0.01, 0.01),
        'city': 'Mumbai',
        'country': 'India',
        'submitted_by': 'Rajesh Kumar',
        'is_anonymous': False,
        'evidence_url': 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
        'appreciation_count': 67,
        'created_at': datetime.now() - timedelta(days=5),
    },
    {
        'description': 'Volunteered 15 hours this week teaching English to underprivileged children. Education is the best gift we can give! 📚✨',
        'category': Category.TIME,
        'latitude': MUMBAI_LAT + random.uniform(-0.01, 0.01),
        'longitude': MUMBAI_LNG + random.uniform(-0.01, 0.01),
        'city': 'Mumbai',
        'country': 'India',
        'submitted_by': 'Anjali Mehta',
        'is_anonymous': False,
        'evidence_url': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
        'appreciation_count': 52,
        'created_at': datetime.now() - timedelta(days=1),
    },
    {
        'description': 'Funded medical treatment for 5 children from low-income families. Health is wealth! 🏥💚',
        'category': Category.MONEY,
        'latitude': MUMBAI_LAT + random.uniform(-0.01, 0.01),
        'longitude': MUMBAI_LNG + random.uniform(-0.01, 0.01),
        'city': 'Mumbai',
        'country': 'India',
        'submitted_by': 'Amit Patel',
        'is_anonymous': False,
        'evidence_url': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=80',
        'appreciation_count': 89,
        'created_at': datetime.now() - timedelta(days=3),
    },
    {
        'description': 'Organized a beach cleanup drive at Juhu Beach with 50+ volunteers. Clean environment for our future generations! 🌊🌱',
        'category': Category.OTHER,
        'latitude': MUMBAI_LAT + random.uniform(-0.01, 0.01),
        'longitude': MUMBAI_LNG + random.uniform(-0.01, 0.01),
        'city': 'Mumbai',
        'country': 'India',
        'submitted_by': 'Sneha Desai',
        'is_anonymous': False,
        'evidence_url': 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80',
        'appreciation_count': 73,
        'created_at': datetime.now() - timedelta(days=4),
    },
    {
        'description': 'Distributed fresh fruits and vegetables to 150 families in slum areas. Nutrition matters! 🍎🥕',
        'category': Category.FOOD,
        'latitude': MUMBAI_LAT + random.uniform(-0.01, 0.01),
        'longitude': MUMBAI_LNG + random.uniform(-0.01, 0.01),
        'city': 'Mumbai',
        'country': 'India',
        'submitted_by': 'Vikram Singh',
        'is_anonymous': False,
        'evidence_url': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
        'appreciation_count': 38,
        'created_at': datetime.now() - timedelta(days=6),
    },
    {
        'description': 'Donated school supplies and books to 3 local schools. Every child deserves access to education! 📖✏️',
        'category': Category.OTHER,
        'latitude': MUMBAI_LAT + random.uniform(-0.01, 0.01),
        'longitude': MUMBAI_LNG + random.uniform(-0.01, 0.01),
        'city': 'Mumbai',
        'country': 'India',
        'submitted_by': 'Meera Joshi',
        'is_anonymous': False,
        'evidence_url': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
        'appreciation_count': 56,
        'created_at': datetime.now() - timedelta(days=7),
    },
    {
        'description': 'Helped organize a blood donation camp. 80+ people donated blood, saving countless lives! 🩸❤️',
        'category': Category.TIME,
        'latitude': MUMBAI_LAT + random.uniform(-0.01, 0.01),
        'longitude': MUMBAI_LNG + random.uniform(-0.01, 0.01),
        'city': 'Mumbai',
        'country': 'India',
        'submitted_by': 'Rohan Malhotra',
        'is_anonymous': False,
        'evidence_url': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
        'appreciation_count': 94,
        'created_at': datetime.now() - timedelta(days=8),
    },
    {
        'description': 'Provided free meals to street vendors and their families. Small acts, big impact! 🍽️',
        'category': Category.FOOD,
        'latitude': MUMBAI_LAT + random.uniform(-0.01, 0.01),
        'longitude': MUMBAI_LNG + random.uniform(-0.01, 0.01),
        'city': 'Mumbai',
        'country': 'India',
        'submitted_by': '',
        'is_anonymous': True,
        'evidence_url': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
        'appreciation_count': 41,
        'created_at': datetime.now() - timedelta(days=9),
    },
    {
        'description': 'Organized free health checkup camp for senior citizens. Their smiles made it all worth it! 👴👵💙',
        'category': Category.OTHER,
        'latitude': MUMBAI_LAT + random.uniform(-0.01, 0.01),
        'longitude': MUMBAI_LNG + random.uniform(-0.01, 0.01),
        'city': 'Mumbai',
        'country': 'India',
        'submitted_by': 'Kavita Nair',
        'is_anonymous': False,
        'evidence_url': 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80',
        'appreciation_count': 61,
        'created_at': datetime.now() - timedelta(days=10),
    },
]

print("Adding 10 acts of kindness in Mumbai with images...")
print("=" * 60)

for i, act_data in enumerate(mumbai_acts, 1):
    act = Act(**act_data)
    act.save()
    print(f"{i}. ✓ Added: {act.description[:60]}...")
    print(f"   Location: {act.city}, {act.country}")
    print(f"   Category: {act.get_category_display()}")
    print(f"   By: {act.submitted_by if not act.is_anonymous else 'Anonymous'}")
    print(f"   Appreciations: {act.appreciation_count}")
    print()

print("=" * 60)
print(f"✅ Successfully added {len(mumbai_acts)} acts in Mumbai!")
print(f"📊 Total acts in database: {Act.objects.count()}")
print(f"📍 Mumbai acts: {Act.objects.filter(city='Mumbai').count()}")

