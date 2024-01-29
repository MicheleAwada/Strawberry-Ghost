from rest_framework import permissions

class IsUserOrNone(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj == request.user

class NotAuthenticated(permissions.BasePermission):
    message = "Authentication credentials were not provided."
    def has_permission(self, request, view):
        return not request.user.is_authenticated