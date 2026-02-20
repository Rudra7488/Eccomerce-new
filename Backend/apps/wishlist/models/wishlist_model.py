from mongoengine import Document, ReferenceField, ListField, DateTimeField
from apps.users.models.user_model import User
from apps.vendor_admin.models.product_models import Product
import datetime

class Wishlist(Document):
    user = ReferenceField(User, required=True, unique=True)
    products = ListField(ReferenceField(Product))
    created_at = DateTimeField(default=datetime.datetime.utcnow)
    updated_at = DateTimeField(default=datetime.datetime.utcnow)

    meta = {
        'collection': 'wishlists',
        'indexes': ['user']
    }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.datetime.utcnow()
        return super(Wishlist, self).save(*args, **kwargs)
