from mongoengine import Document, StringField, EmailField, DateTimeField, EmbeddedDocument, ListField, EmbeddedDocumentField, BooleanField
from django.utils import timezone
import datetime
import bcrypt
import uuid

class Address(EmbeddedDocument):
    id = StringField(default=lambda: str(uuid.uuid4()), required=True)
    street = StringField(required=True)
    city = StringField(required=True)
    state = StringField(required=True)
    zip_code = StringField(required=True)
    country = StringField(required=True)
    phone = StringField(required=True)
    is_default = BooleanField(default=False)

class User(Document):
    full_name = StringField(required=True, max_length=255)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    role = StringField(default='user', choices=['user', 'admin'])
    created_at = DateTimeField(default=timezone.now)
    addresses = ListField(EmbeddedDocumentField(Address))

    @property
    def is_authenticated(self):
        return True

    def set_password(self, raw_password):
        hashed = bcrypt.hashpw(raw_password.encode('utf-8'), bcrypt.gensalt())
        self.password = hashed.decode('utf-8')

    def check_password(self, raw_password):
        return bcrypt.checkpw(raw_password.encode('utf-8'), self.password.encode('utf-8'))

    meta = {
        'collection': 'users',
        'indexes': ['email']
    }
