from mongoengine import Document, ReferenceField, ListField, DateTimeField
from apps.users.models.user_model import User
from apps.vendor_admin.models.product_models import Product
from django.utils import timezone
import datetime

class Wishlist(Document):
    user = ReferenceField(User, required=True, unique=True)
    products = ListField(ReferenceField(Product))
    created_at = DateTimeField(default=timezone.now)
    updated_at = DateTimeField(default=timezone.now)

    meta = {
        'collection': 'wishlists',
        'indexes': ['user']
    }

    def save(self, *args, **kwargs):
        self.updated_at = timezone.now()
        return super(Wishlist, self).save(*args, **kwargs)
