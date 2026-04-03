from mongoengine import Document, StringField, BooleanField, IntField, DateTimeField
from django.utils import timezone

class Banner(Document):
    title = StringField(max_length=255)
    description = StringField()
    image_url = StringField(required=True)
    link_url = StringField()
    is_active = BooleanField(default=True)
    order = IntField(default=0)
    created_at = DateTimeField(default=timezone.now)

    meta = {
        'collection': 'banners',
        'ordering': ['order', '-created_at']
    }
