#!/usr/bin/env python
"""
Script to add sample acts of kindness data
Run with: python manage.py shell < add_sample_data.py
Or: python manage.py shell -c "$(cat add_sample_data.py)"
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'santa_project.settings')
django.setup()

from acts.models import Act, Category
from datetime import datetime, timedelta
import random

# Sample acts data with realistic locations and descriptions
sample_acts = [
    # Mumbai, India
    {
        'description': 'Distributed warm meals to 200 underprivileged children in local community center',
        'category': Category.FOOD,
        'latitude': 19.0760,
        'longitude': 72.8777,
        'city': 'Mumbai',
        'country': 'India',
        'submitted_by': 'Community Kitchen Team',
        'is_anonymous': False,
    },
    {
        'description': 'Donated blankets and warm clothing to homeless shelter during winter',
        'category': Category.CLOTHING,
        'latitude': 19.0760,
        'longitude': 72.8777,
        'city': 'Mumbai',
        'country': 'India',
        'submitted_by': '',
        'is_anonymous': True,
    },
    {
        'description': 'Volunteered 10 hours teaching basic literacy to street children',
        'category': Category.TIME,
        'latitude': 19.0760,
        'longitude': 72.8777,
        'city': 'Mumbai',
        'country': 'India',
        'submitted_by': '',
        'is_anonymous': True,
    },
    # New York, USA
    {
        'description': 'Organized community food drive collecting 500 pounds of food for local pantry',
        'category': Category.FOOD,
        'latitude': 40.7128,
        'longitude': -74.0060,
        'city': 'New York',
        'country': 'United States',
        'submitted_by': 'Neighborhood Association',
        'is_anonymous': False,
    },
    {
        'description': 'Sponsored holiday gifts for 50 children from low-income families',
        'category': Category.MONEY,
        'latitude': 40.7128,
        'longitude': -74.0060,
        'city': 'New York',
        'country': 'United States',
        'submitted_by': '',
        'is_anonymous': True,
    },
    {
        'description': 'Volunteered at local soup kitchen serving meals to homeless',
        'category': Category.TIME,
        'latitude': 40.7128,
        'longitude': -74.0060,
        'city': 'New York',
        'country': 'United States',
        'submitted_by': '',
        'is_anonymous': True,
    },
    # London, UK
    {
        'description': 'Donated winter coats and warm clothing to charity shop',
        'category': Category.CLOTHING,
        'latitude': 51.5074,
        'longitude': -0.1278,
        'city': 'London',
        'country': 'United Kingdom',
        'submitted_by': '',
        'is_anonymous': True,
    },
    {
        'description': 'Helped elderly neighbors with grocery shopping and errands',
        'category': Category.TIME,
        'latitude': 51.5074,
        'longitude': -0.1278,
        'city': 'London',
        'country': 'United Kingdom',
        'submitted_by': '',
        'is_anonymous': True,
    },
    # Tokyo, Japan
    {
        'description': 'Organized community cleanup event in local park',
        'category': Category.OTHER,
        'latitude': 35.6762,
        'longitude': 139.6503,
        'city': 'Tokyo',
        'country': 'Japan',
        'submitted_by': '',
        'is_anonymous': True,
    },
    {
        'description': 'Donated to local food bank to support families in need',
        'category': Category.FOOD,
        'latitude': 35.6762,
        'longitude': 139.6503,
        'city': 'Tokyo',
        'country': 'Japan',
        'submitted_by': '',
        'is_anonymous': True,
    },
    # Delhi, India
    {
        'description': 'Organized free medical camp providing health checkups to 300 people',
        'category': Category.OTHER,
        'latitude': 28.6139,
        'longitude': 77.2090,
        'city': 'Delhi',
        'country': 'India',
        'submitted_by': '',
        'is_anonymous': True,
    },
    {
        'description': 'Distributed warm clothing to homeless people during cold weather',
        'category': Category.CLOTHING,
        'latitude': 28.6139,
        'longitude': 77.2090,
        'city': 'Delhi',
        'country': 'India',
        'submitted_by': '',
        'is_anonymous': True,
    },
    # Sydney, Australia
    {
        'description': 'Volunteered at animal shelter walking dogs and socializing cats',
        'category': Category.TIME,
        'latitude': -33.8688,
        'longitude': 151.2093,
        'city': 'Sydney',
        'country': 'Australia',
        'submitted_by': '',
        'is_anonymous': True,
    },
    {
        'description': 'Donated toys and books to children\'s hospital',
        'category': Category.OTHER,
        'latitude': -33.8688,
        'longitude': 151.2093,
        'city': 'Sydney',
        'country': 'Australia',
        'submitted_by': '',
        'is_anonymous': True,
    },
    # Paris, France
    {
        'description': 'Volunteered at soup kitchen serving warm meals',
        'category': Category.FOOD,
        'latitude': 48.8566,
        'longitude': 2.3522,
        'city': 'Paris',
        'country': 'France',
        'submitted_by': '',
        'is_anonymous': True,
    },
    {
        'description': 'Organized clothing drive collecting items for refugee families',
        'category': Category.CLOTHING,
        'latitude': 48.8566,
        'longitude': 2.3522,
        'city': 'Paris',
        'country': 'France',
        'submitted_by': '',
        'is_anonymous': True,
    },
    # San Francisco, USA
    {
        'description': 'Donated funds to local food bank to support meal programs',
        'category': Category.MONEY,
        'latitude': 37.7749,
        'longitude': -122.4194,
        'city': 'San Francisco',
        'country': 'United States',
        'submitted_by': '',
        'is_anonymous': True,
    },
    # Singapore
    {
        'description': 'Organized community event raising funds for education programs',
        'category': Category.MONEY,
        'latitude': 1.3521,
        'longitude': 103.8198,
        'city': 'Singapore',
        'country': 'Singapore',
        'submitted_by': '',
        'is_anonymous': True,
    },
    # Dubai, UAE
    {
        'description': 'Distributed food packages to construction workers',
        'category': Category.FOOD,
        'latitude': 25.2048,
        'longitude': 55.2708,
        'city': 'Dubai',
        'country': 'United Arab Emirates',
        'submitted_by': '',
        'is_anonymous': True,
    },
    # Toronto, Canada
    {
        'description': 'Volunteered at homeless shelter preparing and serving meals',
        'category': Category.TIME,
        'latitude': 43.6532,
        'longitude': -79.3832,
        'city': 'Toronto',
        'country': 'Canada',
        'submitted_by': '',
        'is_anonymous': True,
    },
]

# Add some variation to coordinates for better visualization
def add_coordinate_variation(base_lat, base_lng):
    """Add small random variation to coordinates"""
    return (
        base_lat + (random.random() - 0.5) * 0.1,
        base_lng + (random.random() - 0.5) * 0.1
    )

# Clear existing data (optional - comment out if you want to keep existing data)
# Act.objects.all().delete()
# print("Cleared existing acts")

# Create acts
created_count = 0
for act_data in sample_acts:
    # Add coordinate variation for better heatmap visualization
    lat, lng = add_coordinate_variation(act_data['latitude'], act_data['longitude'])
    
    act = Act.objects.create(
        description=act_data['description'],
        category=act_data['category'],
        latitude=lat,
        longitude=lng,
        city=act_data['city'],
        country=act_data['country'],
        submitted_by=act_data['submitted_by'],
        is_anonymous=act_data['is_anonymous'],
    )
    created_count += 1
    print(f"Created act {created_count}: {act.description[:50]}... in {act.city}")

print(f"\n✅ Successfully created {created_count} acts of kindness!")
print(f"Total acts in database: {Act.objects.count()}")

