#!/usr/bin/env python
"""
Script to add test acts with image URLs for testing Instagram-style display
Run with: python manage.py shell < add_test_data_with_images.py
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'santa_project.settings')
django.setup()

from acts.models import Act, Category
from datetime import datetime, timedelta
import random

# Sample image URLs from Unsplash (free stock photos)
# Using placeholder images that should work for testing
sample_image_urls = [
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',  # Food/community
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',  # Food
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',  # Donation
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',  # Helping
    'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800',  # Community
]

# Test acts with images
test_acts = [
    {
        'description': 'Distributed warm meals to 200 underprivileged children today. The smiles on their faces made our day! ❤️',
        'category': Category.FOOD,
        'latitude': 19.0760,
        'longitude': 72.8777,
        'city': 'Mumbai',
        'country': 'India',
        'submitted_by': 'Sarah Johnson',
        'is_anonymous': False,
        'evidence_url': sample_image_urls[0],
        'appreciation_count': 15,
    },
    {
        'description': 'Donated 50 blankets to the homeless shelter. Winter is tough, but together we can make it warmer! 🧥',
        'category': Category.CLOTHING,
        'latitude': 19.0760,
        'longitude': 72.8777,
        'city': 'Mumbai',
        'country': 'India',
        'submitted_by': 'Raj Patel',
        'is_anonymous': False,
        'evidence_url': sample_image_urls[2],
        'appreciation_count': 23,
    },
    {
        'description': 'Volunteered at the local food bank today. Giving back feels amazing! 🙏',
        'category': Category.TIME,
        'latitude': 19.0760,
        'longitude': 72.8777,
        'city': 'Mumbai',
        'country': 'India',
        'submitted_by': '',
        'is_anonymous': True,
        'evidence_url': sample_image_urls[4],
        'appreciation_count': 8,
    },
    {
        'description': 'Helped organize a community cleanup drive. Clean environment for everyone! 🌱',
        'category': Category.OTHER,
        'latitude': 28.6139,
        'longitude': 77.2090,
        'city': 'Delhi',
        'country': 'India',
        'submitted_by': 'Amit Kumar',
        'is_anonymous': False,
        'evidence_url': sample_image_urls[3],
        'appreciation_count': 31,
    },
    {
        'description': 'Donated books to the local library. Knowledge is the best gift! 📚',
        'category': Category.OTHER,
        'latitude': 28.6139,
        'longitude': 77.2090,
        'city': 'Delhi',
        'country': 'India',
        'submitted_by': 'Priya Sharma',
        'is_anonymous': False,
        'evidence_url': sample_image_urls[1],
        'appreciation_count': 12,
    },
]

print("Adding test acts with images...")

for act_data in test_acts:
    # Adjust created_at to be recent
    act_data['created_at'] = datetime.now() - timedelta(days=random.randint(0, 30))
    act = Act(**act_data)
    act.save()
    print(f"✓ Added: {act.description[:50]}... in {act.city}")

print(f"\n✓ Successfully added {len(test_acts)} test acts with images!")
print(f"Total acts in database: {Act.objects.count()}")

