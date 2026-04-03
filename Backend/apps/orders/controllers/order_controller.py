from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers # Added for OrderDetailSerializer
from ..models.order_model import Order, OrderItem
from ..serializers.order_serializers import OrderCreateSerializer
from apps.users.models.user_model import Address, User
from apps.vendor_admin.models.product_models import Product
from django.utils import timezone
from utils.email_utils import send_order_confirmation_email
import json

class OrderDetailSerializer(serializers.Serializer):
    id = serializers.CharField()
    status = serializers.CharField()
    payment_status = serializers.CharField()
    payment_method = serializers.CharField()
    created_at = serializers.DateTimeField()
    
    # These will be manually populated in to_representation to support both components
    def to_representation(self, instance):
        try:
            # Basic Fields
            data = {
                'id': str(instance.id),
                'status': getattr(instance, 'status', 'Placed'),
                'payment_status': getattr(instance, 'payment_status', 'Pending'),
                'payment_method': getattr(instance, 'payment_method', 'COD'),
                'created_at': instance.created_at.isoformat() if instance.created_at else None,
                'updated_at': instance.updated_at.isoformat() if instance.updated_at else None,
                # Aliases for different components
                'date': instance.created_at.isoformat() if instance.created_at else None,
                'total_amount': getattr(instance, 'total_amount', 0),
                'discount_amount': getattr(instance, 'discount_amount', 0),
                'final_amount': getattr(instance, 'final_amount', 0),
                'totalAmount': getattr(instance, 'final_amount', 0),
                
                # Cancellation Details
                'cancelled_by': getattr(instance, 'cancelled_by', None),
                'cancellation_reason': getattr(instance, 'cancellation_reason', None),
                'cancelled_at': instance.cancelled_at.isoformat() if getattr(instance, 'cancelled_at', None) else None,
            }
            
            # Enrich Items
            enriched_items = []
            for item in getattr(instance, 'items', []):
                try:
                    p_id = getattr(item.product, 'id', item.product)
                    product = Product.objects(id=p_id).first()
                    
                    price = float(getattr(item, 'price', 0))
                    qty = int(getattr(item, 'quantity', 1))
                    
                    enriched_items.append({
                        'id': str(p_id),
                        'title': getattr(product, 'name', 'Unknown Product'),
                        'price': price,
                        'quantity': qty,
                        'totalPrice': price * qty, # Used by Account.jsx
                        'image': product.images[0] if product and getattr(product, 'images', None) else ""
                    })
                except Exception as e:
                    print(f"Error enriching item: {e}")
                    continue
            
            data['items'] = enriched_items
            
            # Format Customer Info
            user = getattr(instance, 'user', None)
            cust = getattr(instance, 'customer_info', None)
            
            customer_data = {
                'fullName': getattr(user, 'full_name', 'Unknown User'),
                'email': getattr(user, 'email', 'No Email'),
                'phone': getattr(cust, 'phone', ''),
                'address': getattr(cust, 'street', ''),
                'city': getattr(cust, 'city', ''),
                'zipCode': getattr(cust, 'zip_code', ''),
                'state': getattr(cust, 'state', '')
            }
            
            data['customer_info'] = customer_data # For Admin
            data['customer'] = customer_data      # For User Account
            
            return data
        except Exception as e:
            import traceback
            traceback.print_exc()
            return {"id": str(getattr(instance, 'id', 'error')), "error": str(e)}

class OrderController(APIView):
    permission_classes = [IsAuthenticated]

    # POST: Place a new order
    def post(self, request):
        try:
            from bson import ObjectId
            serializer = OrderCreateSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            data = serializer.validated_data
            user = request.user
            
            # Prepare customer address from validated data
            addr_data = data.get('customer_info', {})
            customer_info = Address(
                street=addr_data.get('street', ''),
                city=addr_data.get('city', ''),
                state=addr_data.get('state', 'India'),
                zip_code=addr_data.get('zip_code', ''),
                country=addr_data.get('country', 'India'),
                phone=addr_data.get('phone', '')
            )

            # Create order items
            order_items = []
            for item in data['items']:
                try:
                    product = Product.objects(id=ObjectId(item['product_id'])).first()
                except Exception:
                    product = Product.objects(id=item['product_id']).first()

                if not product:
                    return Response({"error": f"Product {item['product_id']} not found"}, status=status.HTTP_404_NOT_FOUND)
                
                # Create OrderItem object
                item_obj = OrderItem(
                    product=product,
                    quantity=item['quantity'],
                    price=item['price'] # Use price from checkout to avoid issues
                )
                order_items.append(item_obj)

            # Create the main order
            new_order = Order(
                user=user,
                customer_info=customer_info,
                items=order_items,
                total_amount=data['total_amount'],
                discount_amount=data.get('discount_amount', 0.0),
                final_amount=data['final_amount'],
                payment_method=data.get('payment_method', 'COD'),
                status='Placed'
            )
            new_order.save()

            # Respond with the created order's info
            res_serializer = OrderDetailSerializer(new_order)
            order_response_data = res_serializer.data
            
            # Send confirmation email
            try:
                send_order_confirmation_email(order_response_data, user.email)
            except Exception as e:
                print(f"Error sending email: {e}")
                
            return Response(order_response_data, status=status.HTTP_201_CREATED)

        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # PATCH: Cancel an order (by user)
    def patch(self, request, order_id):
        try:
            user = request.user
            order = Order.objects(id=order_id, user=user).first()
            
            if not order:
                return Response({"error": "Order not found or access denied"}, status=status.HTTP_404_NOT_FOUND)
            
            # Business logic: Can only cancel if not shipped/delivered/cancelled already
            not_cancellable = ['Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']
            if order.status in not_cancellable:
                return Response({"error": f"Cannot cancel order with status: {order.status}"}, status=status.HTTP_400_BAD_REQUEST)
            
            order.status = 'Cancelled'
            order.cancelled_by = 'user'
            order.cancelled_at = timezone.now()
            order.save()
            
            return Response({"message": "Order cancelled successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # GET: List user's own orders
    def get(self, request):
        try:
            # If user is admin, they might want all orders.
            # But normally we have separate user/admin endpoints.
            # Here we follow the logic: user gets their own, admin gets all.
            if request.user.role == 'admin':
                orders = Order.objects().order_by('-created_at')
            else:
                orders = Order.objects(user=request.user).order_by('-created_at')
            
            serializer = OrderDetailSerializer(orders, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AdminOrderController(APIView):
    permission_classes = [IsAuthenticated] # Role check below

    def get(self, request):
        if request.user.role != 'admin':
            return Response({"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            orders = Order.objects().order_by('-created_at')
            serializer = OrderDetailSerializer(orders, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, order_id):
        if request.user.role != 'admin':
            return Response({"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            order = Order.objects(id=order_id).first()
            if not order:
                return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
            
            # BLOCKER: If order is already cancelled, don't allow ANY status change
            if order.status == 'Cancelled':
                return Response({"error": "Cannot change status of an already cancelled order"}, status=status.HTTP_400_BAD_REQUEST)
            
            new_status = request.data.get('status')
            if new_status:
                order.status = new_status
                if new_status == 'Cancelled':
                    order.cancelled_by = 'admin'
                    order.cancelled_at = timezone.now()
                order.save()
                return Response({"message": f"Order status updated to {new_status}"}, status=status.HTTP_200_OK)
            
            return Response({"error": "Status is required"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
