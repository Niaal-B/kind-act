from django.db.models.signals import post_save
from django.dispatch import receiver
from acts.models import Act
from .models import TreeDecoration, UserTreeProgress
import random


@receiver(post_save, sender=Act)
def auto_decorate_tree(sender, instance, created, **kwargs):
    """Automatically add decoration to user's tree when act is created"""
    if created and instance.user:
        user = instance.user
        
        # Get or create progress
        progress, _ = UserTreeProgress.objects.get_or_create(user=user)
        progress.update_progress()
        
        # Get existing decorations count
        existing_count = TreeDecoration.objects.filter(user=user).count()
        total_acts = progress.total_acts
        
        # Determine decoration type based on acts count
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
            # First decoration gets a star
            decoration_type = 'star' if existing_count == 0 else 'ornament'
        else:
            decoration_type = 'ornament'
        
        # Calculate auto position
        position = _calculate_auto_position(total_acts, existing_count, progress.tree_level)
        
        # Color based on decoration type
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
            unlocked_by_act=instance
        )
        
        # Update progress
        progress.update_progress()


def _calculate_auto_position(total_acts, existing_count, tree_level):
    """Calculate automatic position for decoration on tree"""
    base_y = 15
    y_spacing = 65 / max(1, total_acts)
    y_position = base_y + (existing_count * y_spacing)
    y_position = min(80, max(15, y_position))
    
    x_variance = 10 + (tree_level * 5)
    x_position = 50 + random.uniform(-x_variance, x_variance)
    x_position = min(70, max(30, x_position))
    
    return {
        'x': round(x_position, 2),
        'y': round(y_position, 2)
    }

