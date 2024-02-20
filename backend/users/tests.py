from django.test import TestCase
from django.contrib.auth import get_user_model
UserModel = get_user_model()
from django.core.files.uploadedfile import SimpleUploadedFile
from products.models import Variant
class MyModelTestCase(TestCase):
    def test_default_avatar_added(self):
        user = UserModel.objects.create(email='test@example.com')
        print(user.has_bought_variant())