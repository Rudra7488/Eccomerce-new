from django.core.mail import EmailMultiAlternatives
from django.conf import settings
import logging
import threading

logger = logging.getLogger(__name__)

def _send_email_async(msg):
    """
    Helper function to send email in a separate thread.
    """
    try:
        msg.send()
        logger.info("✅ Async email sent successfully")
    except Exception as e:
        logger.error(f"❌ Error sending async email: {str(e)}")

def send_order_confirmation_email(order_data, customer_email):
    """
    Sends a professional HTML order confirmation email using Gmail SMTP.
    Runs in a background thread to avoid blocking the main request.
    """
    try:
        subject = f"Order Confirmation - #{order_data.get('id')}"
        from_email = settings.DEFAULT_FROM_EMAIL
        to = [customer_email]

        # Professional HTML Content
        items_html = ""
        for item in order_data.get('items', []):
            items_html += f"""
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">{item.get('title')}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">x{item.get('quantity')}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹{item.get('price')}</td>
                </tr>
            """

        html_content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #003d29; color: white; padding: 25px 20px; text-align: center;">
                <div style="display: inline-block; width: 50px; height: 50px; background-color: white; color: #003d29; border-radius: 50%; line-height: 50px; font-size: 28px; font-weight: bold; margin-bottom: 10px; text-align: center;">E</div>
                <h1 style="margin: 0; font-size: 24px;">Ecommerce Mozari</h1>
                <p style="margin: 5px 0 0; opacity: 0.9;">Order Confirmation</p>
            </div>
            <div style="padding: 20px; color: #333;">
                <p>Hello <strong>{order_data.get('customer', {}).get('fullName', 'Customer')}</strong>,</p>
                <p>Thank you for shopping with us! Your order has been placed successfully and is being processed.</p>
                
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 0;"><strong>Order ID:</strong> #{order_data.get('id')}</p>
                    <p style="margin: 5px 0 0;"><strong>Total Amount:</strong> ₹{order_data.get('totalAmount')}</p>
                </div>

                <h3 style="border-bottom: 2px solid #003d29; padding-bottom: 5px;">Order Summary</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f2f2f2;">
                            <th style="padding: 10px; text-align: left;">Item</th>
                            <th style="padding: 10px; text-align: center;">Qty</th>
                            <th style="padding: 10px; text-align: right;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items_html}
                    </tbody>
                </table>

                <div style="margin-top: 20px;">
                    <h3 style="border-bottom: 2px solid #003d29; padding-bottom: 5px;">Shipping Address</h3>
                    <p style="margin: 5px 0;">{order_data.get('customer', {}).get('address')}</p>
                    <p style="margin: 5px 0;">{order_data.get('customer', {}).get('city')}, {order_data.get('customer', {}).get('zipCode')}</p>
                </div>

                <p style="margin-top: 30px;">We will notify you once your order is shipped!</p>
                <p>Best regards,<br><strong>The Ecommerce Mozari Team</strong></p>
            </div>
            <div style="background-color: #f2f2f2; padding: 15px; text-align: center; font-size: 12px; color: #777;">
                &copy; 2026 Ecommerce Mozari. All rights reserved.
            </div>
        </div>
        """

        # Plain text fallback
        text_content = f"Hello, your order #{order_data.get('id')} has been placed successfully. Total: ₹{order_data.get('totalAmount')}"

        msg = EmailMultiAlternatives(subject, text_content, from_email, to)
        msg.attach_alternative(html_content, "text/html")
        
        # Start background thread to send email
        thread = threading.Thread(target=_send_email_async, args=(msg,))
        thread.start()

        logger.info(f"🚀 Email sending triggered in background for {customer_email}")
        return True
    except Exception as e:
        logger.error(f"❌ Error setting up order confirmation email: {str(e)}")
        return False

def send_welcome_email(user_data):
    """
    Sends a professional HTML welcome email using Gmail SMTP.
    Runs in a background thread to avoid blocking the main request.
    """
    try:
        subject = "Welcome to Ecommerce Mozari!"
        from_email = settings.DEFAULT_FROM_EMAIL
        to = [user_data.get('email')]

        html_content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #003d29; color: white; padding: 25px 20px; text-align: center;">
                <div style="display: inline-block; width: 50px; height: 50px; background-color: white; color: #003d29; border-radius: 50%; line-height: 50px; font-size: 28px; font-weight: bold; margin-bottom: 10px; text-align: center;">E</div>
                <h1 style="margin: 0; font-size: 24px;">Ecommerce Mozari</h1>
                <p style="margin: 5px 0 0; opacity: 0.9;">Welcome to the Family!</p>
            </div>
            <div style="padding: 20px; color: #333; line-height: 1.6;">
                <p>Hello <strong>{user_data.get('full_name', 'Customer')}</strong>,</p>
                <p>Welcome to <strong>Ecommerce Mozari</strong>! We're thrilled to have you with us.</p>
                
                <p>Your account has been successfully created. You can now start exploring our unique collection of handcrafted products.</p>
                
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h4 style="margin: 0 0 10px;">Why shop with us?</h4>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li>High-quality handcrafted items</li>
                        <li>Exclusive deals for members</li>
                        <li>Fast and secure checkout</li>
                    </ul>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="http://localhost:5173/" style="background-color: #003d29; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Start Shopping Now</a>
                </div>

                <p>If you have any questions, feel free to reply to this email. We're here to help!</p>
                
                <p>Happy Shopping!<br><strong>The Ecommerce Mozari Team</strong></p>
            </div>
            <div style="background-color: #f2f2f2; padding: 15px; text-align: center; font-size: 12px; color: #777;">
                &copy; 2026 Ecommerce Mozari. All rights reserved.
            </div>
        </div>
        """

        text_content = f"Welcome to Ecommerce Mozari, {user_data.get('full_name')}! Your account is ready."

        msg = EmailMultiAlternatives(subject, text_content, from_email, to)
        msg.attach_alternative(html_content, "text/html")
        
        # Start background thread to send email
        thread = threading.Thread(target=_send_email_async, args=(msg,))
        thread.start()

        logger.info(f"🚀 Welcome email triggered in background for {user_data.get('email')}")
        return True
    except Exception as e:
        logger.error(f"❌ Error setting up welcome email: {str(e)}")
        return False
