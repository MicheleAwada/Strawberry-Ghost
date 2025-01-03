from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone

from django.core.exceptions import ValidationError

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, commit=True, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        if commit:
            user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30, blank=True)

    avatar = models.ImageField(upload_to="users_avatars", blank=True, null=True)

    google_id = models.CharField(null=True, blank=True, max_length=256)


    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ["first_name", "last_name"]

    def has_bought_variant(self, variant):
        return self.orderitem_set.filter(order_product_items__variant=variant, paid=True).exists()
    def has_reviewed_variant(self, variant):
        return self.reviews.filter(variant=variant).exists()
    def __str__(self):
        return self.email

class EmailVerification(models.Model):
    email = models.EmailField(blank=False)
    token = models.CharField(max_length=100)
    attempts = models.IntegerField(default=0)
    blocked = models.BooleanField(default=False)

    time_created = models.DateTimeField(auto_now_add=True)
    def is_expired(self):
        current_time = timezone.now()
        x_minutes_ago = current_time - timezone.timedelta(minutes=5)

        return self.time_created < x_minutes_ago
    def too_much_attempts(self, raise_exception=True):
        if self.attempts > 12 or self.blocked:
            if raise_exception: raise ValidationError("Cannot verify, too much attempts, please contact us")
            self.attempts +=1
            return True
        return False
    def is_valid(self, token, raise_exception=True):
        if self.token != token:
            self.attempts += 1
            if raise_exception: raise ValidationError("Invalid verification code")
            return False
        self.too_much_attempts()
        if self.is_expired():
            self.attempts += 1
            if raise_exception: raise ValidationError("Cannot verify, token expired")
            return False
        self.attempts = 0
        return True
    def is_valid_to_mail(self, raise_exception=True):
        self.attempts += 1
        if self.too_much_attempts(raise_exception):
            return False
        return True
    def generate_token(self):
        import random
        random_6_digit = random.randint(100000, 999999)
        self.token = str(random_6_digit)
        return self.token