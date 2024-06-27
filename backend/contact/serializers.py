from rest_framework import serializers
from .models import Contact

class CurrentUserDefaultOrNone:
    requires_context = True

    def __call__(self, serializer_field):
        user = serializer_field.context['request'].user
        if user.is_authenticated:
            return user
        return None


    def __repr__(self):
        return '%s()' % self.__class__.__name__


class ContactSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=CurrentUserDefaultOrNone())
    class Meta:
        model = Contact
        fields = '__all__'