from rest_framework import serializers
from .models import Act, Category


class ActSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    username = serializers.SerializerMethodField()
    
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
            'username',
        ]
        read_only_fields = ['id', 'appreciation_count', 'created_at', 'updated_at']
    
    def get_username(self, obj):
        """Get username from user if available, otherwise use submitted_by"""
        if obj.user:
            return obj.user.username
        elif obj.submitted_by and not obj.is_anonymous:
            return obj.submitted_by
        return 'Anonymous'
    
    def validate_category(self, value):
        """Validate category is one of the allowed choices"""
        valid_categories = [choice[0] for choice in Category.choices]
        if value not in valid_categories:
            raise serializers.ValidationError(f"Category must be one of: {', '.join(valid_categories)}")
        return value

