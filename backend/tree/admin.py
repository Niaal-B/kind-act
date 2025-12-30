from django.contrib import admin
from .models import TreeDecoration, UserTreeProgress


@admin.register(TreeDecoration)
class TreeDecorationAdmin(admin.ModelAdmin):
    list_display = ['user', 'decoration_type', 'position_x', 'position_y', 'color', 'is_auto_placed', 'created_at']
    list_filter = ['decoration_type', 'is_auto_placed', 'created_at']
    search_fields = ['user__username', 'decoration_type']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']


@admin.register(UserTreeProgress)
class UserTreeProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'tree_level', 'total_acts', 'total_decorations', 'last_updated']
    list_filter = ['tree_level', 'last_updated']
    search_fields = ['user__username']
    readonly_fields = ['last_updated']
    ordering = ['-total_acts']
