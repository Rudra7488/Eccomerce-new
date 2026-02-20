from mongoengine import Document, StringField, FloatField, IntField, ListField, ReferenceField, BooleanField, DateTimeField
from apps.users.models.user_model import User
import datetime


class Product(Document):
    name = StringField(required=True, max_length=255)
    description = StringField(required=True)
    price = FloatField(required=True)
    stock_quantity = IntField(default=0)
    category = StringField(max_length=100)
    images = ListField(StringField())  # Store image URLs
    vendor = ReferenceField(User, required=True)  # Link product to vendor
    is_active = BooleanField(default=True)
    created_at = DateTimeField(default=datetime.datetime.utcnow)
    updated_at = DateTimeField(default=datetime.datetime.utcnow)

    meta = {
        'collection': 'products',
        'indexes': [
            'vendor',
            'category',
            'is_active'
        ]
    }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.datetime.utcnow()
        return super(Product, self).save(*args, **kwargs)


class Category(Document):
    name = StringField(required=True, max_length=255)
    description = StringField()
    image = StringField()  # URL to category image
    is_active = BooleanField(default=True)
    created_at = DateTimeField(default=datetime.datetime.utcnow)

    meta = {
        'collection': 'categories'
    }