from django.db import models
from django.contrib.auth.models import User
from acts.models import Act


class TreeDecoration(models.Model):
    DECORATION_TYPES = [
        ('ornament', 'Ornament'),
        ('star', 'Star'),
        ('light', 'Light'),
        ('garland', 'Garland'),
        ('gift', 'Gift'),
        ('snowflake', 'Snowflake'),
    ]
    
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='tree_decorations',
        help_text="User who owns this decoration"
    )
    decoration_type = models.CharField(
        max_length=20, 
        choices=DECORATION_TYPES,
        default='ornament',
        help_text="Type of decoration"
    )
    position_x = models.FloatField(
        help_text="X position on tree (0-100 percentage)"
    )
    position_y = models.FloatField(
        help_text="Y position on tree (0-100 percentage)"
    )
    color = models.CharField(
        max_length=20, 
        default='#DC2626',
        help_text="Color of decoration (hex code)"
    )
    size = models.FloatField(
        default=1.0,
        help_text="Size scale factor (0.5 to 2.0)"
    )
    unlocked_by_act = models.ForeignKey(
        Act, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='tree_decorations',
        help_text="Act that unlocked this decoration"
    )
    is_auto_placed = models.BooleanField(
        default=True,
        help_text="Whether decoration was auto-placed or manually positioned"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'decoration_type']),
            models.Index(fields=['user', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.user.username}'s {self.get_decoration_type_display()} at ({self.position_x}, {self.position_y})"


class UserTreeProgress(models.Model):
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='tree_progress',
        help_text="User's tree progress"
    )
    total_acts = models.IntegerField(
        default=0,
        help_text="Total acts submitted by user"
    )
    total_decorations = models.IntegerField(
        default=0,
        help_text="Total decorations on tree"
    )
    tree_level = models.IntegerField(
        default=1,
        help_text="Current tree level (1-5)"
    )
    last_updated = models.DateTimeField(auto_now=True)
    
    def update_progress(self):
        """Update progress based on user's acts"""
        self.total_acts = self.user.acts.count()
        self.total_decorations = self.user.tree_decorations.count()
        
        # Tree levels based on acts count
        if self.total_acts <= 10:
            self.tree_level = 1
        elif self.total_acts <= 25:
            self.tree_level = 2
        elif self.total_acts <= 50:
            self.tree_level = 3
        elif self.total_acts <= 100:
            self.tree_level = 4
        else:
            self.tree_level = 5
        
        self.save()
        return self
    
    def get_next_milestone(self):
        """Get next milestone information"""
        milestones = [
            (3, "Colored Ornaments"),
            (5, "Star Topper"),
            (10, "Lights"),
            (15, "Garland"),
            (25, "Snowflakes"),
            (50, "Golden Ornaments"),
            (100, "Special Tree Topper"),
        ]
        
        for milestone_acts, reward in milestones:
            if self.total_acts < milestone_acts:
                return {
                    'acts_needed': milestone_acts - self.total_acts,
                    'milestone_acts': milestone_acts,
                    'reward': reward
                }
        return None
    
    def __str__(self):
        return f"{self.user.username}'s Tree Progress (Level {self.tree_level}, {self.total_acts} acts)"
