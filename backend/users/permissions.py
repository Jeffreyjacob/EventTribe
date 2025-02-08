from rest_framework import permissions


class IsUserOwnProfile(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_authenticated and request.user == obj.user:
            return True
        
        
class IsUserOrganizer(permissions.BasePermission):
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "Organizer"