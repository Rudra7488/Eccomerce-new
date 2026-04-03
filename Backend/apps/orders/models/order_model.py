from mongoengine import Document, StringField, FloatField, IntField, ListField, ReferenceField, DateTimeField, EmbeddedDocument, EmbeddedDocumentField, BooleanField
from apps.users.models.user_model import User, Address
from apps.vendor_admin.models.product_models import Product
from django.utils import timezone
import datetime
import uuid

class OrderItem(EmbeddedDocument):
    product = ReferenceField(Product, required=True)
    quantity = IntField(default=1)
    price = FloatField(required=True) # Price at time of order

class Order(Document):
    id = StringField(default=lambda: str(uuid.uuid4()), primary_key=True)
    user = ReferenceField(User, required=True)
    customer_info = EmbeddedDocumentField(Address, required=True)
    items = ListField(EmbeddedDocumentField(OrderItem))
    total_amount = FloatField(required=True)
    discount_amount = FloatField(default=0.0)
    final_amount = FloatField(required=True)
    status = StringField(default='Placed', choices=['Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'])
    payment_status = StringField(default='Pending', choices=['Pending', 'Paid', 'Failed', 'Refunded'])
    payment_method = StringField(default='COD', choices=['COD', 'Online'])
    created_at = DateTimeField(default=timezone.now)
    updated_at = DateTimeField(default=timezone.now)
    
    # Cancellation Tracking (Industry Level)
    cancelled_by = StringField(choices=['user', 'admin'], null=True)
    cancellation_reason = StringField(null=True)
    cancelled_at = DateTimeField(null=True)

    meta = {
        'collection': 'orders',
        'ordering': ['-created_at'],
        'indexes': [
            'user',
            'status',
            'created_at'
        ]
    }

    def save(self, *args, **kwargs):
        self.updated_at = timezone.now()
        return super(Order, self).save(*args, **kwargs)
