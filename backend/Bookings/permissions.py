from rest_framework import permissions


class IsUserOrganizer(permissions.BasePermission):
      
      def has_permission(self, request, view):
            if request.user.is_authenicated and request.user.role == "Organizer":
                return True
            return False
        
      def has_object_permission(self, request, view, obj):
           if request.method in permissions.SAFE_METHODS:
                return True
           if request.user == obj.event.organizer:
               return True
           return False