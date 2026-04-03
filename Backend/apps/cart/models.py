from mongoengine import Document, ReferenceField, ListField, IntField, EmbeddedDocument, EmbeddedDocumentField, DateTimeField, StringField
from apps.users.models.user_model import User
from apps.vendor_admin.models.product_models import Product
from django.utils import timezone
import datetime

class CartItem(EmbeddedDocument):
    product = ReferenceField(Product, required=True)
    quantity = IntField(default=1, min_value=1)
    variant_size = StringField(null=True)

class Cart(Document):
    user = ReferenceField(User, required=True, unique=True)
    items = ListField(EmbeddedDocumentField(CartItem))
    created_at = DateTimeField(default=timezone.now)
    updated_at = DateTimeField(default=timezone.now)

    meta = {
        'collection': 'carts',
        'indexes': ['user']
    }

    def save(self, *args, **kwargs):
        self.updated_at = timezone.now()
        return super(Cart, self).save(*args, **kwargs)
