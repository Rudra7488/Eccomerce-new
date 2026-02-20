from mongoengine import Document, StringField, EmailField, DateTimeField
import datetime
import bcrypt

class User(Document):
    full_name = StringField(required=True, max_length=255)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    role = StringField(default='user', choices=['user', 'admin'])
    created_at = DateTimeField(default=datetime.datetime.utcnow)

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
