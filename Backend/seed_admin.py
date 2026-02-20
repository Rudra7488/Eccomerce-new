import os
import sys
import django

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User

def seed_admin():
    admin_email = "admin@velora.com"
    admin_password = "admin123"
    
    # Check if admin already exists
    admin = User.objects(email=admin_email).first()
    
    if not admin:
        print(f"Creating admin user: {admin_email}")
        admin = User(
            full_name="Velora Admin",
            email=admin_email,
            role="admin"
        )
        admin.set_password(admin_password)
        admin.save()
        print("✅ Admin user created successfully!")
    else:
        print(f"Admin user {admin_email} already exists.")
        # Ensure role is set to admin
        if admin.role != "admin":
            admin.role = "admin"
            admin.save()
            print("Updated existing user to admin role.")

if __name__ == "__main__":
    seed_admin()
