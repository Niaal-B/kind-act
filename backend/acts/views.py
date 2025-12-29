from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django.db.models import Count, Q, Sum
from datetime import datetime, timedelta
from .models import Act
from .serializers import ActSerializer


class ActViewSet(viewsets.ModelViewSet):
    queryset = Act.objects.all()
    serializer_class = ActSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # Require auth for create, allow read for all
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['description', 'city', 'country', 'submitted_by']
    ordering_fields = ['created_at', 'appreciation_count']
    ordering = ['-created_at']
    
    def perform_create(self, serializer):
        # Automatically set the user when creating an act
        serializer.save(user=self.request.user)
    
    def get_queryset(self):
        queryset = Act.objects.all()
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter by city
        city = self.request.query_params.get('city', None)
        if city:
            queryset = queryset.filter(city__icontains=city)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        if start_date:
            queryset = queryset.filter(created_at__gte=start_date)
        if end_date:
            queryset = queryset.filter(created_at__lte=end_date)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get global statistics"""
        total_acts = Act.objects.count()
        
        # Acts created today
        today = datetime.now().date()
        acts_today = Act.objects.filter(created_at__date=today).count()
        
        # Active regions (unique cities)
        active_regions = Act.objects.exclude(city='').values('city').distinct().count()
        
        # Top region
        top_region_data = (
            Act.objects.exclude(city='')
            .values('city')
            .annotate(count=Count('id'))
            .order_by('-count')
            .first()
        )
        top_region = {
            'city': top_region_data['city'] if top_region_data else None,
            'count': top_region_data['count'] if top_region_data else 0
        }
        
        # Category breakdown
        category_breakdown = (
            Act.objects.values('category')
            .annotate(count=Count('id'))
            .order_by('-count')
        )
        category_dict = {item['category']: item['count'] for item in category_breakdown}
        
        # Total countries
        total_countries = Act.objects.exclude(country='').values('country').distinct().count()
        
        # Total cities (same as active_regions for consistency)
        total_cities = active_regions
        
        # Total appreciations
        total_appreciations = Act.objects.aggregate(Sum('appreciation_count'))['appreciation_count__sum'] or 0
        
        return Response({
            'total_acts': total_acts,
            'acts_today': acts_today,
            'active_regions': active_regions,
            'total_cities': total_cities,
            'top_region': top_region,
            'category_breakdown': category_dict,
            'total_countries': total_countries,
            'total_appreciations': total_appreciations,
        })
    
    @action(detail=False, methods=['get'])
    def region(self, request):
        """Get acts by region (city or coordinates)"""
        city = request.query_params.get('city', None)
        lat = request.query_params.get('lat', None)
        lng = request.query_params.get('lng', None)
        
        if city:
            acts = Act.objects.filter(city__icontains=city)
        elif lat and lng:
            # Simple proximity search (can be improved with proper geocoding)
            try:
                lat = float(lat)
                lng = float(lng)
                # Find acts within ~1 degree (rough approximation)
                acts = Act.objects.filter(
                    latitude__range=(lat - 0.5, lat + 0.5),
                    longitude__range=(lng - 0.5, lng + 0.5)
                )
            except ValueError:
                return Response(
                    {'error': 'Invalid latitude or longitude'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            return Response(
                {'error': 'Provide either city or lat/lng parameters'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not acts.exists():
            return Response({
                'city': city or 'Unknown',
                'total_acts': 0,
                'acts_this_week': 0,
                'recent_acts': [],
                'category_breakdown': {}
            })
        
        # Get region name from first act
        region_city = acts.first().city or 'Unknown'
        
        # Calculate stats
        total_acts = acts.count()
        
        # Acts this week
        week_ago = datetime.now() - timedelta(days=7)
        acts_this_week = acts.filter(created_at__gte=week_ago).count()
        
        # Recent acts (last 10)
        recent_acts = acts[:10]
        recent_acts_data = ActSerializer(recent_acts, many=True).data
        
        # Category breakdown
        category_breakdown = (
            acts.values('category')
            .annotate(count=Count('id'))
        )
        category_dict = {item['category']: item['count'] for item in category_breakdown}
        
        return Response({
            'city': region_city,
            'total_acts': total_acts,
            'acts_this_week': acts_this_week,
            'recent_acts': recent_acts_data,
            'category_breakdown': category_dict,
        })
    
    @action(detail=False, methods=['get'])
    def nearby_acts(self, request):
        """Get individual acts near a clicked location"""
        lat = request.query_params.get('lat', None)
        lng = request.query_params.get('lng', None)
        radius = float(request.query_params.get('radius', 0.01))  # ~1km default
        
        if not lat or not lng:
            return Response(
                {'error': 'Provide lat and lng parameters'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            lat = float(lat)
            lng = float(lng)
            
            # Find acts within radius (smaller radius for nearby acts)
            acts = Act.objects.filter(
                latitude__range=(lat - radius, lat + radius),
                longitude__range=(lng - radius, lng + radius)
            ).order_by('-created_at')[:20]  # Limit to 20 most recent
            
            acts_data = ActSerializer(acts, many=True).data
            
            return Response({
                'acts': acts_data,
                'count': len(acts_data),
                'location': {'lat': lat, 'lng': lng}
            })
        except ValueError:
            return Response(
                {'error': 'Invalid latitude or longitude'},
                status=status.HTTP_400_BAD_REQUEST
            )
