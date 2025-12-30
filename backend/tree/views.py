from rest_framework import viewsets, status
from rest_framework.decorators import action, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count
from .models import TreeDecoration, UserTreeProgress
from .serializers import (
    TreeDecorationSerializer, 
    UserTreeProgressSerializer,
    TreeSerializer
)
import random
import math


class TreeDecorationViewSet(viewsets.ModelViewSet):
    serializer_class = TreeDecorationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Users can only see their own decorations"""
        return TreeDecoration.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Automatically assign decoration to current user"""
        serializer.save(user=self.request.user, is_auto_placed=False)
        # Update progress
        progress, _ = UserTreeProgress.objects.get_or_create(user=self.request.user)
        progress.update_progress()
    
    def perform_update(self, serializer):
        """Update decoration"""
        serializer.save()
    
    def perform_destroy(self, instance):
        """Delete decoration and update progress"""
        instance.delete()
        progress, _ = UserTreeProgress.objects.get_or_create(user=self.request.user)
        progress.update_progress()
    
    @action(detail=False, methods=['get'])
    def my_tree(self, request):
        """Get user's complete tree with decorations and progress"""
        user = request.user
        
        # Get or create progress
        progress, _ = UserTreeProgress.objects.get_or_create(user=user)
        progress.update_progress()
        
        # Get all decorations
        decorations = TreeDecoration.objects.filter(user=user)
        existing_count = decorations.count()
        total_acts = progress.total_acts
        
        # Sync decorations: Create missing decorations if acts > decorations
        if total_acts > existing_count:
            from acts.models import Act
            
            # Get all user's acts ordered by creation
            all_acts = Act.objects.filter(user=user).order_by('created_at')
            
            # Get acts that already have decorations
            acts_with_decorations = set(
                TreeDecoration.objects.filter(user=user)
                .exclude(unlocked_by_act__isnull=True)
                .values_list('unlocked_by_act_id', flat=True)
            )
            
            # Get existing decoration types once (to track what's already on tree)
            existing_decoration_types = list(
                TreeDecoration.objects.filter(user=user)
                .values_list('decoration_type', flat=True)
            )
            
            # Create decorations for acts that don't have them
            for idx, act in enumerate(all_acts):
                if act.id not in acts_with_decorations:
                    # Act number is 1-indexed (first act = 1, second = 2, etc.)
                    act_number = idx + 1
                    
                    # Determine decoration type based on act number and existing types
                    decoration_type = self._determine_decoration_type(
                        act_number, 
                        existing_count, 
                        existing_decoration_types
                    )
                    
                    # Track this decoration type for next iterations
                    existing_decoration_types.append(decoration_type)
                    
                    # Calculate position
                    position = self._calculate_auto_position(total_acts, existing_count, progress.tree_level)
                    
                    # Get color
                    colors = {
                        'ornament': ['#DC2626', '#16A34A', '#D97706', '#2563EB', '#9333EA'],
                        'star': ['#FBBF24', '#FCD34D'],
                        'light': ['#FEF3C7', '#FDE68A'],
                        'garland': ['#16A34A', '#15803D'],
                        'gift': ['#DC2626', '#2563EB', '#16A34A'],
                        'snowflake': ['#E0E7FF', '#DBEAFE'],
                    }
                    color = random.choice(colors.get(decoration_type, ['#DC2626']))
                    
                    # Create decoration
                    TreeDecoration.objects.create(
                        user=user,
                        decoration_type=decoration_type,
                        position_x=position['x'],
                        position_y=position['y'],
                        color=color,
                        size=random.uniform(0.8, 1.2),
                        is_auto_placed=True,
                        unlocked_by_act=act
                    )
                    
                    existing_count += 1
            
            # Refresh decorations after creating new ones
            decorations = TreeDecoration.objects.filter(user=user)
            progress.update_progress()
        
        # Build response
        tree_data = {
            'user': user.id,
            'username': user.username,
            'tree_level': progress.tree_level,
            'total_acts': progress.total_acts,
            'total_decorations': progress.total_decorations,
            'decorations': TreeDecorationSerializer(decorations, many=True).data,
            'progress': UserTreeProgressSerializer(progress).data,
        }
        
        return Response(tree_data)
    
    def _determine_decoration_type(self, act_number, existing_count, all_decoration_types=None):
        """Determine decoration type based on act number and milestones"""
        # Track what decoration types already exist to ensure milestone decorations appear
        existing_types = all_decoration_types or []
        
        # Milestone-based unlocks (guaranteed at specific act numbers)
        if act_number == 5:
            # Act 5 always gets a star (milestone: Star Topper)
            return 'star'
        elif act_number == 10:
            # Act 10 always gets a light (milestone: Lights)
            return 'light'
        elif act_number == 15:
            # Act 15 always gets a garland (milestone: Garland)
            return 'garland'
        elif act_number == 25:
            # Act 25 always gets a snowflake (milestone: Snowflakes)
            return 'snowflake'
        elif act_number == 50:
            # Act 50 gets a special decoration (milestone: Golden Ornaments)
            return random.choice(['star', 'ornament'])  # Could be golden ornament
        elif act_number == 100:
            # Act 100 gets a special decoration (milestone: Special Tree Topper)
            return random.choice(['star', 'gift'])
        
        # For other acts, use milestone-based random selection
        if act_number >= 100:
            return random.choice(['ornament', 'star', 'snowflake', 'gift'])
        elif act_number >= 50:
            # Ensure at least some variety
            if 'star' not in existing_types and random.random() < 0.3:
                return 'star'
            return random.choice(['ornament', 'star', 'snowflake'])
        elif act_number >= 25:
            # Ensure snowflakes appear
            if 'snowflake' not in existing_types and random.random() < 0.4:
                return 'snowflake'
            return random.choice(['ornament', 'snowflake'])
        elif act_number >= 15:
            # Ensure garlands appear
            if 'garland' not in existing_types and random.random() < 0.4:
                return 'garland'
            return random.choice(['ornament', 'garland'])
        elif act_number >= 10:
            # Ensure lights appear (since milestone unlocked at 10)
            if 'light' not in existing_types and random.random() < 0.5:
                return 'light'
            return random.choice(['ornament', 'light'])
        elif act_number >= 5:
            return 'ornament'
        else:
            return 'ornament'
    
    @action(detail=False, methods=['get'])
    def progress(self, request):
        """Get user's tree progress"""
        progress, _ = UserTreeProgress.objects.get_or_create(user=request.user)
        progress.update_progress()
        return Response(UserTreeProgressSerializer(progress).data)
    
    @action(detail=False, methods=['post'])
    def auto_decorate(self, request):
        """Auto-add decoration when act is created"""
        user = request.user
        act_id = request.data.get('act_id')
        
        # Get user's existing decorations count
        existing_count = TreeDecoration.objects.filter(user=user).count()
        
        # Determine decoration type based on acts count
        progress, _ = UserTreeProgress.objects.get_or_create(user=user)
        progress.update_progress()
        
        total_acts = progress.total_acts
        
        # Unlock system
        decoration_type = 'ornament'  # Default
        if total_acts >= 100:
            decoration_type = random.choice(['ornament', 'star', 'snowflake', 'gift'])
        elif total_acts >= 50:
            decoration_type = random.choice(['ornament', 'star', 'snowflake'])
        elif total_acts >= 25:
            decoration_type = random.choice(['ornament', 'snowflake'])
        elif total_acts >= 15:
            decoration_type = random.choice(['ornament', 'garland'])
        elif total_acts >= 10:
            decoration_type = random.choice(['ornament', 'light'])
        elif total_acts >= 5:
            decoration_type = 'star' if existing_count == 0 else 'ornament'
        else:
            decoration_type = 'ornament'
        
        # Calculate auto position
        position = self._calculate_auto_position(total_acts, existing_count, progress.tree_level)
        
        # Color based on decoration type
        colors = {
            'ornament': ['#DC2626', '#16A34A', '#D97706', '#2563EB', '#9333EA'],  # Red, Green, Orange, Blue, Purple
            'star': ['#FBBF24', '#FCD34D'],  # Gold, Light Gold
            'light': ['#FEF3C7', '#FDE68A'],  # Warm White, Light Yellow
            'garland': ['#16A34A', '#15803D'],  # Green shades
            'gift': ['#DC2626', '#2563EB', '#16A34A'],  # Red, Blue, Green
            'snowflake': ['#E0E7FF', '#DBEAFE'],  # Light Blue, Light Blue
        }
        color = random.choice(colors.get(decoration_type, ['#DC2626']))
        
        # Create decoration
        decoration = TreeDecoration.objects.create(
            user=user,
            decoration_type=decoration_type,
            position_x=position['x'],
            position_y=position['y'],
            color=color,
            size=random.uniform(0.8, 1.2),
            is_auto_placed=True,
            unlocked_by_act_id=act_id if act_id else None
        )
        
        # Update progress
        progress.update_progress()
        
        return Response(
            TreeDecorationSerializer(decoration).data,
            status=status.HTTP_201_CREATED
        )
    
    def _calculate_auto_position(self, total_acts, existing_count, tree_level):
        """Calculate automatic position for decoration on tree"""
        # Tree is roughly triangular
        # X: 30-70% (centered area)
        # Y: Spread vertically based on count
        
        # Base Y position
        base_y = 15  # Start from top
        
        # Spread decorations vertically
        y_spacing = 65 / max(1, total_acts)  # Distribute over 65% of tree height
        y_position = base_y + (existing_count * y_spacing)
        
        # Ensure Y stays within tree bounds
        y_position = min(80, max(15, y_position))
        
        # X position: slightly random but centered
        # More variation for higher tree levels
        x_variance = 10 + (tree_level * 5)
        x_position = 50 + random.uniform(-x_variance, x_variance)
        
        # Ensure X stays within tree bounds
        x_position = min(70, max(30, x_position))
        
        return {
            'x': round(x_position, 2),
            'y': round(y_position, 2)
        }
