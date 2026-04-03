from mongoengine import Document, StringField, FloatField, IntField, DateTimeField, BooleanField
from django.utils import timezone
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
    created_at = DateTimeField(default=timezone.now)
    updated_at = DateTimeField(default=timezone.now)

    meta = {
        'collection': 'coupons',
        'indexes': ['code', 'is_active', 'start_date', 'end_date']
    }

    def save(self, *args, **kwargs):
        self.updated_at = timezone.now()
        # Ensure code is uppercase
        if self.code:
            self.code = self.code.upper()
        return super(Coupon, self).save(*args, **kwargs)

    @property
    def status(self):
        try:
            now = timezone.now()
            
            # Simple, safe comparison
            def is_future(dt):
                if not dt: return False
                try:
                    return dt > now
                except TypeError:
                    # Comparison between naive and aware
                    if timezone.is_aware(dt):
                        return dt > timezone.make_aware(now)
                    else:
                        return dt > timezone.make_naive(now)

            def is_past(dt):
                if not dt: return False
                try:
                    return dt < now
                except TypeError:
                    # Comparison between naive and aware
                    if timezone.is_aware(dt):
                        return dt < timezone.make_aware(now)
                    else:
                        return dt < timezone.make_naive(now)

            if is_future(self.start_date):
                return 'upcoming'

            if is_past(self.end_date):
                return 'expired'

            if not self.is_active:
                return 'disabled'
                
            limit = getattr(self, 'limit', 0) or 0
            usage_count = getattr(self, 'usage_count', 0) or 0

            if limit > 0 and usage_count >= limit:
                return 'limit_reached'
                
            return 'active'
        except Exception as e:
            print(f"Status error for {getattr(self, 'code', 'unknown')}: {e}")
            return 'error'
