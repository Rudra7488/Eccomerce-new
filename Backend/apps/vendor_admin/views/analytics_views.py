from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from apps.orders.models.order_model import Order
from apps.vendor_admin.models.product_models import Product
from django.utils import timezone
from datetime import timedelta
from collections import defaultdict
import calendar

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_analytics(request):
    if request.user.role != 'admin':
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

    try:
        year_filter = request.query_params.get('year', 'this')
        now = timezone.now()
        
        if year_filter == 'last':
            target_year = now.year - 1
            start_date = timezone.datetime(target_year, 1, 1)
            end_date = timezone.datetime(target_year, 12, 31, 23, 59, 59)
        else:
            target_year = now.year
            start_date = timezone.datetime(target_year, 1, 1)
            end_date = now

        # Fetch all orders (active and cancelled) for the selected period
        all_period_orders = Order.objects(created_at__gte=start_date, created_at__lte=end_date)
        
        # Split into active and cancelled
        active_orders = [o for o in all_period_orders if o.status != 'Cancelled']
        cancelled_orders = [o for o in all_period_orders if o.status == 'Cancelled']
        
        # Stats based on the selected period
        active_orders_count = len(active_orders)
        cancelled_orders_count = len(cancelled_orders)
        
        online_active_count = len([o for o in active_orders if o.payment_method == 'Online'])
        offline_active_count = len([o for o in active_orders if o.payment_method == 'COD'])
        
        total_revenue = sum(order.final_amount for order in active_orders)
        cancelled_revenue = sum(order.final_amount for order in cancelled_orders)

        # 1. Revenue Analytics (By Month for the target year)
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        revenue_map = {m: {'name': m, 'revenue': 0, 'orders': 0, 'online': 0, 'offline': 0} for m in months}

        # Helper to make datetime naive for comparison
        def make_naive(dt):
            if dt is not None and timezone.is_aware(dt):
                return timezone.make_naive(dt)
            return dt

        for order in active_orders:
            if order.created_at:
                month_name = order.created_at.strftime('%b')
                if month_name in revenue_map:
                    revenue_map[month_name]['revenue'] += order.final_amount
                    revenue_map[month_name]['orders'] += 1
                    if order.payment_method == 'Online':
                        revenue_map[month_name]['online'] += 1
                    else:
                        revenue_map[month_name]['offline'] += 1

        revenue_data = [revenue_map[m] for m in months]

        # 2. Daily Sales Trend (Last 7 Days - Always relative to 'now' regardless of year select)
        daily_map = defaultdict(float)
        days_order = []
        for i in range(6, -1, -1):
            day_date = now - timedelta(days=i)
            day_name = day_date.strftime('%a')
            days_order.append(day_name)
            daily_map[day_name] = 0

        now_naive = make_naive(now)
        # Use active orders for daily trend 7 days
        recent_orders = Order.objects(status__ne='Cancelled', created_at__gte=now - timedelta(days=7))
        for order in recent_orders:
            order_created_naive = make_naive(order.created_at)
            if order_created_naive:
                day_name = order_created_naive.strftime('%a')
                if day_name in daily_map:
                    daily_map[day_name] += order.final_amount

        daily_data = [{'day': day, 'sales': daily_map[day]} for day in days_order]

        # 3. Payment Methods (For selected period - Online vs COD)
        payment_data = [
            {'name': 'Online (Prepaid)', 'value': online_active_count},
            {'name': 'Offline (COD)', 'value': offline_active_count}
        ]

        # 4. Top Products & 5. Categories (For selected period)
        product_sales = defaultdict(lambda: {'sold': 0, 'revenue': 0, 'name': '', 'category': '', 'price': 0, 'image': ''})
        category_sales = defaultdict(float)

        for order in active_orders:
            for item in order.items:
                p_id = str(item.product.id)
                product_sales[p_id]['sold'] += item.quantity
                product_sales[p_id]['revenue'] += item.price * item.quantity
                if not product_sales[p_id]['name']:
                    product = Product.objects(id=item.product.id).first()
                    if product:
                        product_sales[p_id]['name'] = product.name
                        product_sales[p_id]['category'] = product.category or 'General'
                        product_sales[p_id]['price'] = product.price
                        product_sales[p_id]['image'] = product.images[0] if product.images else '📦'
                
                category_sales[product_sales[p_id]['category']] += item.price * item.quantity

        top_products = sorted(product_sales.values(), key=lambda x: x['sold'], reverse=True)[:5]
        formatted_top_products = []
        for idx, p in enumerate(top_products):
            formatted_top_products.append({
                'id': idx + 1,
                'name': p['name'],
                'category': p['category'],
                'price': f"₹{p['price']:,}",
                'sold': p['sold'],
                'revenue': f"₹{p['revenue']:,}",
                'trend': '+0%',
                'image': p['image']
            })

        category_data = [{'name': k, 'value': v} for k, v in category_sales.items()]
        if not category_data:
             category_data = [{'name': 'General', 'value': 0}]

        # Dashboard specific stats
        pending_count = len([o for o in active_orders if o.status not in ['Delivered', 'Cancelled']])
        completed_count = len([o for o in active_orders if o.status == 'Delivered'])

        # Recent Activities (Last 10 orders)
        recent_activities_orders = Order.objects().order_by('-created_at')[:10]
        recent_activities = []
        for order in recent_activities_orders:
            recent_activities.append({
                'id': str(order.id),
                'short_id': f"ORD-{str(order.id)[:8].upper()}",
                'status': order.status,
                'total_amount': order.final_amount,
                'items_count': sum(item.quantity for item in order.items),
                'created_at': order.created_at.isoformat(),
                'payment_method': order.payment_method,
                'customer_name': order.user.full_name if order.user else "Guest"
            })

        stats = [
            {
                'title': f'Active Revenue ({target_year})',
                'value': f"₹{total_revenue:,.0f}",
                'change': '+0%',
                'isUp': True,
                'type': 'revenue'
            },
            {
                'title': f'Total Orders ({target_year})',
                'value': str(active_orders_count),
                'change': '+0%',
                'isUp': True,
                'type': 'orders'
            },
            {
                'title': f'Pending Orders ({target_year})',
                'value': str(pending_count),
                'change': '0',
                'isUp': False,
                'type': 'pending'
            },
            {
                'title': f'Completed Orders ({target_year})',
                'value': str(completed_count),
                'change': '+0%',
                'isUp': True,
                'type': 'completed'
            },
            {
                'title': f'Cancelled Revenue ({target_year})',
                'value': f"₹{cancelled_revenue:,.0f}",
                'change': 'N/A',
                'isUp': False,
                'type': 'cancelled_revenue'
            },
            {
                'title': f'Cancelled Orders ({target_year})',
                'value': str(cancelled_orders_count),
                'change': 'N/A',
                'isUp': False,
                'type': 'cancelled_orders'
            }
        ]

        return Response({
            'revenueData': revenue_data,
            'dailyData': daily_data,
            'paymentData': payment_data,
            'topProducts': formatted_top_products,
            'categoryData': category_data,
            'stats': stats,
            'dashboardStats': {
                'totalSales': f"₹{total_revenue:,.0f}",
                'totalOrders': str(active_orders_count),
                'pendingOrders': str(pending_count),
                'completedOrders': str(completed_count)
            },
            'recentActivities': recent_activities
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
