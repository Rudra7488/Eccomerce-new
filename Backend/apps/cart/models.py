from mongoengine import Document, ReferenceField, ListField, IntField, EmbeddedDocument, EmbeddedDocumentField, DateTimeField
from apps.users.models.user_model import User
from apps.vendor_admin.models.product_models import Product
import datetime

class CartItem(EmbeddedDocument):
    product = ReferenceField(Product, required=True)
    quantity = IntField(default=1, min_value=1)

class Cart(Document):
    user = ReferenceField(User, required=True, unique=True)
    items = ListField(EmbeddedDocumentField(CartItem))
    created_at = DateTimeField(default=datetime.datetime.utcnow)
    updated_at = DateTimeField(default=datetime.datetime.utcnow)

    meta = {
        'collection': 'carts',
        'indexes': ['user']
    }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.datetime.utcnow()
        return super(Cart, self).save(*args, **kwargs)
