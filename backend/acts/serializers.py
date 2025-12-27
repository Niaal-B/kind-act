from rest_framework import serializers
from .models import Act


class ActSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    
    class Meta:
        model = Act
        fields = [
            'id',
            'description',
            'category',
            'category_display',
            'latitude',
            'longitude',
            'city',
            'country',
            'evidence_url',
            'submitted_by',
            'is_anonymous',
            'appreciation_count',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'appreciation_count', 'created_at', 'updated_at']
    
    def validate_category(self, value):
        """Validate category is one of the allowed choices"""
        valid_categories = [choice[0] for choice in Act.Category.choices]
        if value not in valid_categories:
            raise serializers.ValidationError(f"Category must be one of: {', '.join(valid_categories)}")
        return value

