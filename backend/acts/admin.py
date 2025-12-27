from django.contrib import admin
from .models import Act


@admin.register(Act)
class ActAdmin(admin.ModelAdmin):
    list_display = ('description', 'category', 'city', 'country', 'created_at', 'appreciation_count')
    list_filter = ('category', 'created_at', 'is_anonymous')
    search_fields = ('description', 'city', 'country', 'submitted_by')
    readonly_fields = ('created_at', 'updated_at', 'appreciation_count')
    
    fieldsets = (
        ('Act Information', {
            'fields': ('description', 'category')
        }),
        ('Location', {
            'fields': ('latitude', 'longitude', 'city', 'country')
        }),
        ('Submission Details', {
            'fields': ('submitted_by', 'is_anonymous', 'evidence_url')
        }),
        ('Statistics', {
            'fields': ('appreciation_count',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
