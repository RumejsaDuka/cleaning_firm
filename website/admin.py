from django.contrib import admin
from .models import ContactMessage

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'email', 'phone', 'service', 'property_type', 'created_at', 'is_read']
    list_filter = ['is_read', 'service', 'created_at']
    search_fields = ['full_name', 'email', 'message']
    readonly_fields = ['full_name', 'email', 'phone', 'service', 'property_type', 'message', 'created_at']
    list_editable = ['is_read']
    ordering = ['-created_at']

    def has_add_permission(self, request):
        return False