from rest_framework import serializers
from .models import TreeDecoration, UserTreeProgress


class TreeDecorationSerializer(serializers.ModelSerializer):
    decoration_type_display = serializers.CharField(source='get_decoration_type_display', read_only=True)
    
    class Meta:
        model = TreeDecoration
        fields = [
            'id',
            'decoration_type',
            'decoration_type_display',
            'position_x',
            'position_y',
            'color',
            'size',
            'is_auto_placed',
            'unlocked_by_act',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserTreeProgressSerializer(serializers.ModelSerializer):
    next_milestone = serializers.SerializerMethodField()
    
    class Meta:
        model = UserTreeProgress
        fields = [
            'total_acts',
            'total_decorations',
            'tree_level',
            'next_milestone',
            'last_updated',
        ]
        read_only_fields = ['total_acts', 'total_decorations', 'tree_level', 'last_updated']
    
    def get_next_milestone(self, obj):
        milestone = obj.get_next_milestone()
        return milestone


class TreeSerializer(serializers.Serializer):
    """Combined serializer for tree view"""
    user = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    tree_level = serializers.IntegerField()
    total_acts = serializers.IntegerField()
    total_decorations = serializers.IntegerField()
    decorations = TreeDecorationSerializer(many=True)
    progress = UserTreeProgressSerializer(source='tree_progress')

