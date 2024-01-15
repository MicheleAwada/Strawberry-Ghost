from rest_framework import permissions

class IsAuthorOrNone(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.author == request.user

class IsStaffOrReadOnly(permissions.BasePermission):
    message = 'Must be staff member to make changes.'
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user.is_authenticated and request.user.is_staff)