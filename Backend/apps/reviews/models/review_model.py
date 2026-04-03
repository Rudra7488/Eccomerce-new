from mongoengine import Document, StringField, ReferenceField, IntField, DateTimeField
from apps.users.models.user_model import User
from apps.vendor_admin.models.product_models import Product
from django.utils import timezone

class Review(Document):
    user = ReferenceField(User, required=True)
    product = ReferenceField(Product, required=True)
    order_id = StringField(required=True) # ID of the order or reference
    rating = IntField(min_value=1, max_value=5, required=True)
    review_text = StringField()
    created_at = DateTimeField(default=timezone.now)

    meta = {
        'collection': 'reviews',
        'ordering': ['-created_at'],
        'indexes': ['product', 'user', 'created_at']
    }
