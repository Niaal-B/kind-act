#!/usr/bin/env python
"""
Script to add many more sample acts of kindness data
Run with: python manage.py shell < add_more_data.py
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'santa_project.settings')
django.setup()

from acts.models import Act, Category
from datetime import datetime, timedelta
import random

# Extended list of cities with coordinates
cities_data = [
    # Major cities - High activity
    {'name': 'Mumbai', 'country': 'India', 'lat': 19.0760, 'lng': 72.8777, 'count': 15},
    {'name': 'New York', 'country': 'United States', 'lat': 40.7128, 'lng': -74.0060, 'count': 12},
    {'name': 'Delhi', 'country': 'India', 'lat': 28.6139, 'lng': 77.2090, 'count': 10},
    {'name': 'London', 'country': 'United Kingdom', 'lat': 51.5074, 'lng': -0.1278, 'count': 10},
    {'name': 'Tokyo', 'country': 'Japan', 'lat': 35.6762, 'lng': 139.6503, 'count': 8},
    {'name': 'Los Angeles', 'country': 'United States', 'lat': 34.0522, 'lng': -118.2437, 'count': 8},
    {'name': 'Paris', 'country': 'France', 'lat': 48.8566, 'lng': 2.3522, 'count': 8},
    {'name': 'Sydney', 'country': 'Australia', 'lat': -33.8688, 'lng': 151.2093, 'count': 7},
    {'name': 'Singapore', 'country': 'Singapore', 'lat': 1.3521, 'lng': 103.8198, 'count': 7},
    {'name': 'Dubai', 'country': 'United Arab Emirates', 'lat': 25.2048, 'lng': 55.2708, 'count': 6},
    
    # Medium activity cities
    {'name': 'San Francisco', 'country': 'United States', 'lat': 37.7749, 'lng': -122.4194, 'count': 6},
    {'name': 'Toronto', 'country': 'Canada', 'lat': 43.6532, 'lng': -79.3832, 'count': 6},
    {'name': 'Berlin', 'country': 'Germany', 'lat': 52.5200, 'lng': 13.4050, 'count': 5},
    {'name': 'Madrid', 'country': 'Spain', 'lat': 40.4168, 'lng': -3.7038, 'count': 5},
    {'name': 'Rome', 'country': 'Italy', 'lat': 41.9028, 'lng': 12.4964, 'count': 5},
    {'name': 'Bangkok', 'country': 'Thailand', 'lat': 13.7563, 'lng': 100.5018, 'count': 5},
    {'name': 'Seoul', 'country': 'South Korea', 'lat': 37.5665, 'lng': 126.9780, 'count': 5},
    {'name': 'Hong Kong', 'country': 'Hong Kong', 'lat': 22.3193, 'lng': 114.1694, 'count': 5},
    {'name': 'Amsterdam', 'country': 'Netherlands', 'lat': 52.3676, 'lng': 4.9041, 'count': 4},
    {'name': 'Vienna', 'country': 'Austria', 'lat': 48.2082, 'lng': 16.3738, 'count': 4},
    
    # More cities
    {'name': 'Chicago', 'country': 'United States', 'lat': 41.8781, 'lng': -87.6298, 'count': 4},
    {'name': 'Boston', 'country': 'United States', 'lat': 42.3601, 'lng': -71.0589, 'count': 4},
    {'name': 'Melbourne', 'country': 'Australia', 'lat': -37.8136, 'lng': 144.9631, 'count': 4},
    {'name': 'São Paulo', 'country': 'Brazil', 'lat': -23.5505, 'lng': -46.6333, 'count': 4},
    {'name': 'Mexico City', 'country': 'Mexico', 'lat': 19.4326, 'lng': -99.1332, 'count': 4},
    {'name': 'Buenos Aires', 'country': 'Argentina', 'lat': -34.6118, 'lng': -58.3960, 'count': 3},
    {'name': 'Cairo', 'country': 'Egypt', 'lat': 30.0444, 'lng': 31.2357, 'count': 3},
    {'name': 'Istanbul', 'country': 'Turkey', 'lat': 41.0082, 'lng': 28.9784, 'count': 3},
    {'name': 'Moscow', 'country': 'Russia', 'lat': 55.7558, 'lng': 37.6173, 'count': 3},
    {'name': 'Jakarta', 'country': 'Indonesia', 'lat': -6.2088, 'lng': 106.8456, 'count': 3},
    
    # Additional cities
    {'name': 'Bangalore', 'country': 'India', 'lat': 12.9716, 'lng': 77.5946, 'count': 3},
    {'name': 'Chennai', 'country': 'India', 'lat': 13.0827, 'lng': 80.2707, 'count': 3},
    {'name': 'Kolkata', 'country': 'India', 'lat': 22.5726, 'lng': 88.3639, 'count': 3},
    {'name': 'Hyderabad', 'country': 'India', 'lat': 17.3850, 'lng': 78.4867, 'count': 3},
    {'name': 'Manila', 'country': 'Philippines', 'lat': 14.5995, 'lng': 120.9842, 'count': 3},
    {'name': 'Lima', 'country': 'Peru', 'lat': -12.0464, 'lng': -77.0428, 'count': 2},
    {'name': 'Nairobi', 'country': 'Kenya', 'lat': -1.2921, 'lng': 36.8219, 'count': 2},
    {'name': 'Johannesburg', 'country': 'South Africa', 'lat': -26.2041, 'lng': 28.0473, 'count': 2},
    {'name': 'Lagos', 'country': 'Nigeria', 'lat': 6.5244, 'lng': 3.3792, 'count': 2},
    {'name': 'Seattle', 'country': 'United States', 'lat': 47.6062, 'lng': -122.3321, 'count': 2},
]

# Description templates by category
food_descriptions = [
    'Distributed warm meals to {count} people at local shelter',
    'Organized community food drive collecting {count} pounds of food',
    'Donated {count} meal packages to families in need',
    'Volunteered at soup kitchen serving meals to homeless',
    'Provided free breakfast to {count} school children',
    'Organized community kitchen serving hot meals',
    'Donated groceries to {count} families',
    'Set up food distribution center in neighborhood',
]

clothing_descriptions = [
    'Donated winter coats and warm clothing to charity',
    'Organized clothing drive collecting {count} items',
    'Distributed warm blankets to homeless shelter',
    'Donated {count} pieces of clothing to families',
    'Organized winter clothing drive for children',
    'Collected and donated shoes to those in need',
    'Provided warm clothing to {count} people',
]

time_descriptions = [
    'Volunteered {count} hours at local community center',
    'Helped elderly neighbors with daily tasks',
    'Volunteered at animal shelter caring for pets',
    'Taught free classes to {count} children',
    'Organized community cleanup event',
    'Volunteered at hospital visiting patients',
    'Helped organize community event',
    'Volunteered {count} hours at food bank',
]

money_descriptions = [
    'Donated funds to support {count} families',
    'Sponsored education for {count} children',
    'Contributed to local charity organization',
    'Funded medical supplies for community clinic',
    'Donated to food bank supporting meal programs',
    'Sponsored holiday gifts for {count} children',
]

other_descriptions = [
    'Organized free medical camp for {count} people',
    'Donated books to local library and schools',
    'Organized community event bringing people together',
    'Provided free tutoring to {count} students',
    'Organized blood donation drive',
    'Helped organize community garden project',
    'Donated toys to children\'s hospital',
]

def get_description(category, city_name):
    """Get a random description for the category"""
    if category == Category.FOOD:
        desc = random.choice(food_descriptions)
        count = random.choice([50, 100, 150, 200, 250, 300])
    elif category == Category.CLOTHING:
        desc = random.choice(clothing_descriptions)
        count = random.choice([20, 30, 50, 75, 100])
    elif category == Category.TIME:
        desc = random.choice(time_descriptions)
        count = random.choice([5, 10, 15, 20, 25, 30])
    elif category == Category.MONEY:
        desc = random.choice(money_descriptions)
        count = random.choice([10, 20, 30, 50, 100])
    else:
        desc = random.choice(other_descriptions)
        count = random.choice([25, 50, 75, 100, 150])
    
    return desc.format(count=count)

def add_coordinate_variation(base_lat, base_lng):
    """Add small random variation to coordinates"""
    return (
        base_lat + (random.random() - 0.5) * 0.15,
        base_lng + (random.random() - 0.5) * 0.15
    )

# Categories distribution
categories = [Category.FOOD, Category.CLOTHING, Category.TIME, Category.MONEY, Category.OTHER]

# Create acts for each city
created_count = 0
total_to_create = sum(city['count'] for city in cities_data)

print(f"Creating {total_to_create} acts of kindness across {len(cities_data)} cities...\n")

for city_info in cities_data:
    city_name = city_info['name']
    country = city_info['country']
    base_lat = city_info['lat']
    base_lng = city_info['lng']
    count = city_info['count']
    
    for i in range(count):
        # Random category
        category = random.choice(categories)
        
        # Get description
        description = get_description(category, city_name)
        
        # Add coordinate variation
        lat, lng = add_coordinate_variation(base_lat, base_lng)
        
        # Randomly decide if anonymous
        is_anonymous = random.choice([True, True, True, False])  # 75% anonymous
        
        # Create act
        act = Act.objects.create(
            description=description,
            category=category,
            latitude=lat,
            longitude=lng,
            city=city_name,
            country=country,
            submitted_by='' if is_anonymous else f'Community Member',
            is_anonymous=is_anonymous,
        )
        created_count += 1
        
        if created_count % 50 == 0:
            print(f"Created {created_count}/{total_to_create} acts...")

print(f"\n✅ Successfully created {created_count} acts of kindness!")
print(f"Total acts in database: {Act.objects.count()}")
print(f"\nActs by category:")
for cat in categories:
    count = Act.objects.filter(category=cat).count()
    print(f"  {cat}: {count}")

