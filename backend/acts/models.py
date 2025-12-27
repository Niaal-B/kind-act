from django.db import models


class Category(models.TextChoices):
    FOOD = 'food', 'Food'
    CLOTHING = 'clothing', 'Clothing'
    TIME = 'time', 'Time/Volunteer'
    MONEY = 'money', 'Money'
    OTHER = 'other', 'Other'


class Act(models.Model):
    description = models.TextField(help_text="Description of the act of kindness")
    category = models.CharField(
        max_length=20,
        choices=Category.choices,
        help_text="Category of the act"
    )
    
    # Location fields
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        help_text="Latitude coordinate"
    )
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        help_text="Longitude coordinate"
    )
    city = models.CharField(max_length=100, blank=True, help_text="City name")
    country = models.CharField(max_length=100, blank=True, help_text="Country name")
    
    # Trust system (soft validation)
    evidence_url = models.URLField(blank=True, null=True, help_text="Optional evidence/photo URL")
    submitted_by = models.CharField(max_length=100, blank=True, help_text="Name of submitter (optional)")
    is_anonymous = models.BooleanField(default=True, help_text="Whether submission is anonymous")
    
    # Statistics
    appreciation_count = models.IntegerField(default=0, help_text="Number of appreciations/likes")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['latitude', 'longitude']),
            models.Index(fields=['category']),
            models.Index(fields=['created_at']),
            models.Index(fields=['city']),
        ]
    
    def __str__(self):
        city_display = self.city if self.city else "Unknown"
        return f"{self.get_category_display()} - {city_display}"
