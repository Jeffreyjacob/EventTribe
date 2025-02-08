from rest_framework import permissions


class isUserOrganizer(permissions.BasePermission):
    
    def has_permission(self, request, view):
        if request.user.is_authenticated and request.user.role == "Organizer":
            return True
        return False
    
    def has_object_permission(self, request, view, obj):
        return request.user.is_authenticated and request.user == obj.organizer 
        
            