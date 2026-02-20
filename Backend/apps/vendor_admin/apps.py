from django.apps import AppConfig
import mongoengine
from decouple import config


class VendorAdminConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.vendor_admin'

    def ready(self):
        # Import here to avoid AppRegistryNotReady error
        from decouple import config
        import mongoengine
        
        # Connect to MongoDB when the app is ready
        try:
            MONGODB_URI = config('MONGODB_URI', default='mongodb://localhost:27017/ecommercemozari')
            # Only connect if not already connected
            if not mongoengine.connection.get_connection():
                mongoengine.connect(host=MONGODB_URI)
            print('✅ Vendor Admin MongoDB connected successfully!')
        except Exception as e:
            print(f'❌ Vendor Admin MongoDB connection failed: {e}')