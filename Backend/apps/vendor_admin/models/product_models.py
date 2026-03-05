from mongoengine import Document, StringField, FloatField, IntField, ListField, ReferenceField, BooleanField, DateTimeField, EmbeddedDocument, EmbeddedDocumentField
from apps.users.models.user_model import User
import datetime

class ProductVariant(EmbeddedDocument):
    size = StringField(required=True) # e.g. "100ml", "500g", "1kg"
    price = FloatField(required=True) # Price for this variant
    stock = IntField(default=0)      # Stock for this variant

class Product(Document):
    name = StringField(required=True, max_length=255)
    description = StringField(required=True)
    price = FloatField(required=True) # Base price or starting price
    stock_quantity = IntField(default=0)
    category = StringField(max_length=100)
    product_type = StringField(default="Solid", choices=["Solid", "Liquid"]) # Solid/Liquid
    unit_type = StringField(default="g", choices=["g", "kg", "ml", "ltr", "pc", "unit"]) # Unit (g, ml, etc.)
    unit_value = FloatField(default=0.0) # Base value
    expiry_date = DateTimeField()        # Expiry Date
    variants = ListField(EmbeddedDocumentField(ProductVariant)) # Multiple sizes/prices
    ingredients = StringField(default="")  # Ingredients list
    uses = StringField(default="")         # Product uses
    dose = StringField(default="")         # Recommended dosage
    contra_indications = StringField(default="") # Contra indications
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