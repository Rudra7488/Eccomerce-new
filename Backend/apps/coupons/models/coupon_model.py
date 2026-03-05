from mongoengine import Document, StringField, FloatField, IntField, DateTimeField, BooleanField
import datetime

class Coupon(Document):
    code = StringField(required=True, unique=True, max_length=50)
    discount_type = StringField(required=True, choices=['percentage', 'fixed', 'shipping'])
    value = FloatField(required=True)
    min_purchase = FloatField(default=0.0)
    start_date = DateTimeField(required=True)
    end_date = DateTimeField(required=True)
    limit = IntField(default=0)  # 0 means unlimited
    usage_count = IntField(default=0)
    is_active = BooleanField(default=True)
    created_at = DateTimeField(default=datetime.datetime.utcnow)
    updated_at = DateTimeField(default=datetime.datetime.utcnow)

    meta = {
        'collection': 'coupons',
        'indexes': ['code', 'is_active', 'start_date', 'end_date']
    }

    def save(self, *args, **kwargs):
        self.updated_at = datetime.datetime.utcnow()
        # Ensure code is uppercase
        if self.code:
            self.code = self.code.upper()
        return super(Coupon, self).save(*args, **kwargs)

    @property
    def status(self):
        now = datetime.datetime.utcnow()
        if not self.is_active:
            return 'disabled'
        if now < self.start_date:
            return 'upcoming'
        if now > self.end_date:
            return 'expired'
        if self.limit > 0 and self.usage_count >= self.limit:
            return 'limit_reached'
        return 'active'
