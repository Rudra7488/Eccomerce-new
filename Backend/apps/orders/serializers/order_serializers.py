from rest_framework import serializers
from ..models.order_model import Order, OrderItem
from apps.vendor_admin.models.product_models import Product
from apps.users.models.user_model import User, Address

class OrderItemSerializer(serializers.Serializer):
    product_id = serializers.CharField()
    quantity = serializers.IntegerField(default=1)
    price = serializers.FloatField()
    title = serializers.CharField(required=False)
    image = serializers.CharField(required=False)

class AddressSerializer(serializers.Serializer):
    street = serializers.CharField()
    city = serializers.CharField()
    state = serializers.CharField()
    zip_code = serializers.CharField()
    country = serializers.CharField()
    phone = serializers.CharField()

class OrderCreateSerializer(serializers.Serializer):
    customer_info = AddressSerializer()
    items = OrderItemSerializer(many=True)
    total_amount = serializers.FloatField()
    discount_amount = serializers.FloatField(default=0.0)
    final_amount = serializers.FloatField()
    payment_method = serializers.CharField(default='COD')

class OrderDetailSerializer(serializers.Serializer):
    id = serializers.CharField()
    user = serializers.CharField()
    customer_info = serializers.DictField()
    items = serializers.ListField()
    total_amount = serializers.FloatField()
    discount_amount = serializers.FloatField()
    final_amount = serializers.FloatField()
    status = serializers.CharField()
    payment_status = serializers.CharField()
    payment_method = serializers.CharField()
    created_at = serializers.DateTimeField()
    updated_at = serializers.DateTimeField()

    def to_representation(self, instance):
        try:
            data = super().to_representation(instance)
            
            # Manually enrich items with product details for frontend
            enriched_items = []
            items = getattr(instance, 'items', [])
            for item in items:
                try:
                    # item.product might be an ID or a document
                    p_id = getattr(item.product, 'id', item.product)
                    product = Product.objects(id=p_id).first()
                    
                    enriched_items.append({
                        'id': str(p_id),
                        'title': getattr(product, 'name', 'Unknown Product'),
                        'price': getattr(item, 'price', 0),
                        'quantity': getattr(item, 'quantity', 1),
                        'image': product.images[0] if product and getattr(product, 'images', None) else ""
                    })
                except Exception as e:
                    print(f"Error enriching order item: {e}")
                    continue

            data['items'] = enriched_items
            
            # Format customer info
            user = getattr(instance, 'user', None)
            cust = getattr(instance, 'customer_info', None)
            
            data['customer_info'] = {
                'fullName': getattr(user, 'full_name', 'Unknown User'),
                'email': getattr(user, 'email', 'No Email'),
                'phone': getattr(cust, 'phone', ''),
                'address': getattr(cust, 'street', ''),
                'city': getattr(cust, 'city', ''),
                'zipCode': getattr(cust, 'zip_code', '')
            }
            
            return data
        except Exception as e:
            import traceback
            print("Error in OrderDetailSerializer.to_representation:")
            traceback.print_exc()
            # Return a basic dict if everything fails to avoid 500
            return {"id": str(getattr(instance, 'id', 'unknown')), "error": str(e)}
