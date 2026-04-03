import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Heart,
  LogOut,
  ChevronRight,
  ShoppingBag,
  Settings,
  Bell,
  ShieldCheck,
  MapPin,
  CreditCard,
  Edit2,
  HelpCircle,
  LayoutDashboard,
  Truck,
  Package,
  FileDown,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Ticket,
  Copy,
  Check,
  Percent,
  DollarSign,
  Loader2,
  Info,
  Star,
  Grid,
  FileText,
  BookOpen
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Wishlist from '../components/Wishlist';
import { AnimatePresence, motion as m } from 'framer-motion';
import { logoutUser } from '../store/slices/userSlice';
import { clearCartLocal, addToCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const Account = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Coupon State
  const [coupons, setCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  const fetchCoupons = async () => {
    try {
      setCouponsLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/coupons/public/list/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCoupons(data);
      }
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    } finally {
      setCouponsLoading(false);
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Code ${code} copied!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Address State
  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'India',
    phone: '',
    is_default: false
  });

  // Review State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewOrder, setReviewOrder] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    product_id: '',
    rating: 5,
    review_text: ''
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.product_id) {
      toast.error("Product not found. Please try again.");
      return;
    }

    try {
      setIsSubmittingReview(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reviews/submit/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...reviewForm,
          order_id: reviewOrder.id
        })
      });

      if (response.ok) {
        toast.success("Review submitted! Thank you.");
        setShowReviewModal(false);
        setReviewForm({ product_id: '', rating: 5, review_text: '' });
      } else {
        const err = await response.json();
        toast.error(err.error || "Failed to submit review");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error submitting review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      setAddressLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/addresses/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    } finally {
      setAddressLoading(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'addresses') {
      fetchAddresses();
    } else if (activeTab === 'orders') {
      loadOrders();
    }
  }, [activeTab]);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const url = editingAddress
        ? `${import.meta.env.VITE_API_BASE_URL}/api/users/addresses/${editingAddress.id}/`
        : `${import.meta.env.VITE_API_BASE_URL}/api/users/addresses/`;

      const method = editingAddress ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(addressForm)
      });

      if (response.ok) {
        fetchAddresses();
        setShowAddressForm(false);
        setEditingAddress(null);
        setAddressForm({
          street: '',
          city: '',
          state: '',
          zip_code: '',
          country: 'India',
          phone: '',
          is_default: false
        });
      }
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/addresses/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchAddresses();
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleEditAddress = (addr) => {
    setEditingAddress(addr);
    setAddressForm(addr);
    setShowAddressForm(true);
  };

  const user = JSON.parse(localStorage.getItem('user')) || {
    full_name: 'Guest User',
    email: 'guest@example.com',
    phone: '+91 98765 43210' // Mock phone if not in user object
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });
      }
    } catch (err) {
      console.error('Logout API call failed:', err);
    } finally {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      dispatch(logoutUser());
      dispatch(clearCartLocal());

      navigate('/');
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Account Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'coupons', label: 'Available Offers', icon: Ticket },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'settings', label: 'Account Settings', icon: Settings },
    { id: 'about', label: 'About Us', icon: BookOpen },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
  ];

  React.useEffect(() => {
    if (activeTab === 'coupons') {
      fetchCoupons();
    }
  }, [activeTab]);

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setOrders([]);
        setOrdersLoading(false);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders/my-orders/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  React.useEffect(() => {
    loadOrders();
  }, []);

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  const progressStep = (status) => {
    const map = {
      Placed: 1,
      Confirmed: 2,
      Shipped: 3,
      'Out for Delivery': 4,
      Delivered: 5,
      Cancelled: 0
    };
    return map[status] ?? 1;
  };

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const reorder = (order) => {
    order.items.forEach(item => {
      const qty = item.quantity || 1;
      for (let i = 0; i < qty; i++) {
        dispatch(addToCart({
          id: item.id,
          title: item.title,
          price: item.price,
          image: item.image,
          quantity: 1
        }));
      }
    });
    navigate('/checkout');
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders/cancel-order/${orderId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Order cancelled successfully');
        loadOrders();
      } else {
        toast.error(data.error || 'Failed to cancel order');
      }
    } catch (err) {
      console.error('Cancel Error:', err);
      toast.error('An error occurred during cancellation');
    }
  };

  const downloadInvoice = (order) => {
    try {
      const lines = [];
      lines.push(`Invoice: ${order.id}`);
      lines.push(`Date: ${formatDate(order.date)}`);
      lines.push(`Status: ${order.status}`);
      lines.push(`Customer: ${order.customer?.fullName} | ${order.customer?.email}`);
      lines.push(`Address: ${order.customer?.address}, ${order.customer?.city} - ${order.customer?.zipCode}`);
      lines.push('');
      lines.push('Items:');
      order.items.forEach(i => {
        lines.push(`- ${i.title} | Qty: ${i.quantity} | Price: ₹${i.price.toFixed(2)} | Total: ₹${i.totalPrice.toFixed(2)}`);
      });
      lines.push('');
      lines.push(`Total Amount: ₹${(order.totalAmount || 0).toFixed(2)}`);
      const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${order.id}.txt`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error(err);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'coupons':
        return (
          <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Available Offers</h2>
              <p className="text-gray-500 mt-1">Available discount codes for your next purchase</p>
            </div>

            {couponsLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 text-[#006d5b] animate-spin" />
              </div>
            ) : coupons.length === 0 ? (
              <div className="flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-gray-300 p-16 text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Ticket size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No active coupons</h3>
                <p className="text-gray-500 mb-8 max-w-md">Check back later for new promotions and discount codes!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="bg-white rounded-3xl border-2 border-dashed border-[#006d5b]/10 p-8 flex flex-col gap-6 relative overflow-hidden group hover:border-[#006d5b]/40 transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-[#e6f1f0] rounded-2xl flex items-center justify-center text-[#006d5b] shrink-0">
                        {coupon.discount_type === 'percentage' ? <Percent size={32} /> : <DollarSign size={32} />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-2xl font-black text-gray-900 mb-1 tracking-tight truncate">{coupon.code}</h3>
                        <p className="text-sm font-bold text-[#006d5b] uppercase tracking-widest">
                          {coupon.discount_type === 'percentage' ? `${coupon.value}% DISCOUNT` : `₹${coupon.value} FLAT OFF`}
                        </p>
                      </div>

                      <button
                        onClick={() => handleCopy(coupon.code)}
                        className={`px-8 py-3 rounded-xl font-black uppercase tracking-widest transition-all ${copiedCode === coupon.code
                            ? 'bg-green-500 text-white'
                            : 'bg-[#006d5b] text-white hover:bg-[#005c4b] shadow-lg shadow-green-900/20'
                          }`}
                      >
                        {copiedCode === coupon.code ? 'COPIED' : 'COPY CODE'}
                      </button>
                    </div>

                    <div className="pt-6 border-t-2 border-dashed border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Info size={16} />
                        <p className="text-sm font-bold">
                          Valid on orders above <span className="text-gray-900">₹{coupon.min_purchase}</span>
                        </p>
                      </div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter italic">
                        *T&C Apply. Single use per customer.
                      </p>
                    </div>

                    {/* Decorative semi-circles for industry look */}
                    <div className="absolute top-[84px] -left-4 w-8 h-8 bg-gray-50 rounded-full border-r-2 border-[#006d5b]/10 group-hover:border-[#006d5b]/40 transition-colors"></div>
                    <div className="absolute top-[84px] -right-4 w-8 h-8 bg-gray-50 rounded-full border-l-2 border-[#006d5b]/10 group-hover:border-[#006d5b]/40 transition-colors"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'orders':
        return (
          <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Order History</h2>
                <p className="text-gray-500 mt-1">Manage and track your recent orders</p>
              </div>
              <button
                onClick={loadOrders}
                className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-[#006d5b] transition shadow-sm"
                title="Refresh Orders"
              >
                <RefreshCw size={20} className={ordersLoading ? 'animate-spin' : ''} />
              </button>
            </div>

            {ordersLoading ? (
              <div className="space-y-6">
                {[...Array(2)].map((_, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm animate-pulse">
                    <div className="flex justify-between mb-8">
                      <div className="space-y-2">
                        <div className="h-6 bg-gray-100 rounded w-32"></div>
                        <div className="h-4 bg-gray-100 rounded w-48"></div>
                      </div>
                      <div className="h-8 bg-gray-100 rounded w-24"></div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded mb-8"></div>
                    <div className="h-32 bg-gray-100 rounded"></div>
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-gray-300 p-16 text-center">
                <div className="w-24 h-24 bg-[#e6f1f0] rounded-full flex items-center justify-center mb-6">
                  <ShoppingBag size={40} className="text-[#006d5b]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No orders placed yet</h3>
                <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't discovered our amazing collection yet. Start shopping to fill this space!</p>
                <button
                  onClick={() => navigate('/')}
                  className="px-8 py-3 bg-[#006d5b] text-white rounded-xl font-bold hover:bg-[#005c4b] transition shadow-lg shadow-green-900/20"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence initial={false}>
                  {orders.map((order) => (
                    <m.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{
                        y: -8,
                        rotateX: 1,
                        rotateY: 0.5,
                        scale: 1.01,
                        transition: { duration: 0.2 }
                      }}
                      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                      className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-2xl hover:border-emerald-500/20 transition-all duration-300 transform-gpu"
                    >
                      {/* Order Header */}
                      <div className="p-6 sm:p-8 border-b border-gray-100 bg-gray-50/50">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <h3 className="text-xl font-bold text-gray-900">Order #{order.id.slice(-8).toUpperCase()}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${order.status === 'Delivered' ? 'bg-[#e6f1f0] text-[#006d5b] border-[#b3d4cf]' :
                                  order.status === 'Cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                                    'bg-blue-100 text-blue-700 border-blue-200'
                                }`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 flex items-center gap-2">
                              <Clock size={14} />
                              Placed on {formatDate(order.date)}
                            </p>
                          </div>
                          <div className="flex flex-col sm:items-end">
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="text-2xl font-bold text-[#006d5b]">₹{(order.totalAmount || 0).toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Progress Tracker */}
                        {order.status !== 'Cancelled' && (
                          <div className="mt-8 relative">
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200">
                              <m.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(progressStep(order.status) / 5) * 100}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#006d5b]"
                              ></m.div>
                            </div>
                            <div className="flex justify-between text-xs font-medium text-gray-500">
                              <div className={`text-left ${progressStep(order.status) >= 1 ? 'text-[#006d5b]' : ''}`}>Placed</div>
                              <div className={`text-center ${progressStep(order.status) >= 2 ? 'text-[#006d5b]' : ''}`}>Confirmed</div>
                              <div className={`text-center ${progressStep(order.status) >= 3 ? 'text-[#006d5b]' : ''}`}>Shipped</div>
                              <div className={`text-right ${progressStep(order.status) >= 5 ? 'text-[#006d5b]' : ''}`}>Delivered</div>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Order Content */}
                      <div className="p-6 sm:p-8 space-y-8">
                        {/* Products Grid - Always Visible */}
                        <div>
                          <div className="flex items-center justify-between mb-6">
                            <h4 className="font-black text-gray-900 uppercase tracking-widest text-xs flex items-center gap-2">
                              <Package size={16} className="text-[#006d5b]" />
                              Products ({order.items?.length || 0})
                            </h4>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-white border border-gray-100 hover:border-[#006d5b]/20 transition-all group overflow-hidden">
                                <div className="w-full sm:w-20 h-24 sm:h-20 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100 shrink-0 group-hover:scale-105 transition-transform duration-300">
                                  {(item.image?.startsWith('http') || item.image?.startsWith('data:') || item.image?.startsWith('/') || (item.image || '').length > 20) ? (
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-2xl">{item.image || '📦'}</span>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                  <h5 className="font-bold text-xs sm:text-sm text-gray-900 truncate mb-1">{item.title}</h5>
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
                                    <p className="text-[10px] sm:text-sm font-medium text-gray-500">Qty: {item.quantity}</p>
                                    <p className="font-black text-xs sm:text-sm text-[#006d5b]">₹{(item.totalPrice || item.price).toLocaleString()}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Expandable Details Button */}
                        <div className="flex justify-center pt-2">
                          <button
                            onClick={() => toggleExpand(order.id)}
                            className="px-6 py-2 bg-[#e6f1f0] text-[#006d5b] text-sm font-black uppercase tracking-widest rounded-full hover:bg-[#006d5b] hover:text-white transition-all duration-300 flex items-center gap-2 group"
                          >
                            {expanded[order.id] ? 'Hide Details' : 'View Full Details'}
                            <m.div animate={{ rotate: expanded[order.id] ? 180 : 0 }}>
                              <ChevronDown size={16} />
                            </m.div>
                          </button>
                        </div>

                        <AnimatePresence>
                          {expanded[order.id] && (
                            <m.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                                {/* Shipping Info */}
                                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                  <h4 className="font-black text-gray-900 uppercase tracking-widest text-[10px] mb-4 flex items-center gap-2">
                                    <MapPin size={14} className="text-[#006d5b]" />
                                    Shipping Information
                                  </h4>
                                  <div className="space-y-3">
                                    <div>
                                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Recipient</p>
                                      <p className="font-bold text-gray-900">{order.customer?.fullName}</p>
                                      <p className="text-sm text-gray-600 font-medium">{order.customer?.phone}</p>
                                    </div>
                                    <div>
                                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Delivery Address</p>
                                      <p className="text-sm text-gray-800 font-medium leading-relaxed">
                                        {order.customer?.address}, {order.customer?.city}<br />
                                        {order.customer?.state || 'India'} - {order.customer?.zipCode}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Payment Info */}
                                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                  <h4 className="font-black text-gray-900 uppercase tracking-widest text-[10px] mb-4 flex items-center gap-2">
                                    <CreditCard size={14} className="text-[#006d5b]" />
                                    Payment Summary
                                  </h4>
                                  <div className="space-y-2.5">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-500 font-medium">Subtotal</span>
                                      <span className="font-bold text-gray-900">₹{(order.total_amount || 0).toLocaleString()}</span>
                                    </div>
                                    {order.discount_amount > 0 && (
                                      <div className="flex justify-between text-sm">
                                        <span className="text-green-600 font-medium">Discount</span>
                                        <span className="font-bold text-green-600">-₹{(order.discount_amount || 0).toLocaleString()}</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-500 font-medium">Shipping</span>
                                      <span className="font-bold text-green-600">FREE</span>
                                    </div>
                                    <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                                      <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Total Paid</p>
                                        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{order.payment_method} • {order.payment_status || 'Paid'}</p>
                                      </div>
                                      <span className="text-xl font-black text-[#006d5b]">₹{(order.final_amount || 0).toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </m.div>
                          )}
                        </AnimatePresence>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                          {order.status === 'Delivered' && (
                            <>
                              <button
                                onClick={() => reorder(order)}
                                className="flex-1 sm:flex-none px-6 py-2.5 bg-[#006d5b] text-white rounded-xl text-sm font-bold hover:bg-[#005c4b] transition shadow-lg shadow-green-900/10 flex items-center justify-center gap-2"
                              >
                                <RefreshCw size={16} />
                                Buy Again
                              </button>
                              <button
                                onClick={() => downloadInvoice(order)}
                                className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                              >
                                <FileDown size={16} />
                                Invoice
                              </button>
                              <button
                                onClick={() => {
                                  setReviewOrder(order);
                                  // Use item.id which is the enriched product ID string
                                  setReviewForm({
                                    product_id: order.items[0]?.id || '',
                                    rating: 5,
                                    review_text: ''
                                  });
                                  setShowReviewModal(true);
                                }}
                                className="flex-1 sm:flex-none px-6 py-2.5 bg-yellow-50 border border-yellow-100 text-yellow-700 rounded-xl text-sm font-bold hover:bg-yellow-100 transition flex items-center justify-center gap-2"
                              >
                                <Star size={16} />
                                Rate & Review
                              </button>
                            </>
                          )}
                          {(order.status === 'Placed' || order.status === 'Confirmed') && (
                            <button
                              onClick={() => cancelOrder(order.id)}
                              className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-red-100 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition flex items-center justify-center gap-2 ml-auto"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    </m.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        );
      case 'addresses':
        return (
          <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">My Addresses</h2>
                <p className="text-gray-500 mt-1">Manage your shipping addresses</p>
              </div>
              <button
                onClick={() => {
                  setEditingAddress(null);
                  setAddressForm({
                    street: '',
                    city: '',
                    state: '',
                    zip_code: '',
                    country: 'India',
                    phone: '',
                    is_default: false
                  });
                  setShowAddressForm(true);
                }}
                className="px-6 py-2.5 bg-[#006d5b] text-white rounded-xl font-bold hover:bg-[#005c4b] transition shadow-lg shadow-green-900/20 flex items-center gap-2"
              >
                <MapPin size={18} />
                Add New Address
              </button>
            </div>

            {showAddressForm && (
              <m.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h3>
                <form onSubmit={handleAddressSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                    <input
                      type="text"
                      required
                      value={addressForm.street}
                      onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#006d5b] focus:border-transparent outline-none transition-all"
                      placeholder="House No., Street Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      required
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#006d5b] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      required
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#006d5b] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                    <input
                      type="text"
                      required
                      value={addressForm.zip_code}
                      onChange={(e) => setAddressForm({ ...addressForm, zip_code: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#006d5b] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="text"
                      required
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#006d5b] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="is_default"
                      checked={addressForm.is_default}
                      onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                      className="w-5 h-5 rounded text-[#006d5b] focus:ring-[#006d5b]"
                    />
                    <label htmlFor="is_default" className="text-gray-700 font-medium">Set as default address</label>
                  </div>
                  <div className="md:col-span-2 flex gap-4 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-6 py-3 rounded-xl font-bold border border-gray-200 hover:bg-gray-50 text-gray-600 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-[#006d5b] text-white rounded-xl font-bold hover:bg-[#005c4b] transition shadow-lg shadow-green-900/20"
                    >
                      {editingAddress ? 'Update Address' : 'Save Address'}
                    </button>
                  </div>
                </form>
              </m.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((addr) => (
                <div key={addr.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group">
                  {addr.is_default && (
                    <span className="absolute top-6 right-6 px-3 py-1 bg-[#e6f1f0] text-[#006d5b] text-xs font-bold rounded-full border border-[#b3d4cf]">
                      Default
                    </span>
                  )}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-gray-50 rounded-2xl text-gray-600">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{addr.street}</h4>
                      <p className="text-gray-500">{addr.city}, {addr.state} - {addr.zip_code}</p>
                      <p className="text-gray-500">{addr.country}</p>
                      <p className="text-gray-500 mt-2 flex items-center gap-2">
                        <span className="font-medium text-gray-900">Phone:</span> {addr.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6 pt-6 border-t border-gray-50">
                    <button
                      onClick={() => handleEditAddress(addr)}
                      className="flex-1 py-2.5 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 hover:text-[#006d5b] transition flex items-center justify-center gap-2"
                    >
                      <Edit2 size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="flex-1 py-2.5 rounded-xl border border-red-100 font-bold text-red-600 hover:bg-red-50 transition flex items-center justify-center gap-2"
                    >
                      <LogOut size={16} className="rotate-0" /> Delete
                    </button>
                  </div>
                </div>
              ))}

              {!showAddressForm && addresses.length === 0 && !addressLoading && (
                <div className="md:col-span-2 flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-200 rounded-3xl">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                    <MapPin size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">No addresses found</h3>
                  <p className="text-gray-500 mb-6">Add a shipping address to speed up checkout</p>
                  <button
                    onClick={() => {
                      setEditingAddress(null);
                      setAddressForm({
                        street: '',
                        city: '',
                        state: '',
                        zip_code: '',
                        country: 'India',
                        phone: '',
                        is_default: false
                      });
                      setShowAddressForm(true);
                    }}
                    className="px-6 py-2.5 bg-[#006d5b] text-white rounded-xl font-bold hover:bg-[#005c4b] transition"
                  >
                    Add Address
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto pb-12">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-6">
                <div>
                  <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Our Story</h2>
                  <div className="w-20 h-2.5 bg-[#ff6b3d] rounded-full mb-8"></div>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed font-medium">
                  Welcome to <span className="text-[#006d5b] font-black underline decoration-4 decoration-[#ff6b3d]/20">Shrigurudeo Ayurved Rasashala</span>,
                  where tradition meets modern science to bring you the finest in natural health and wellness.
                  Founded on the principles of ancient Ayurvedic wisdom, we have been dedicated to crafting
                  pure, effective, and ethical products for decades.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed font-medium">
                  Our journey began with a simple mission: to make authentic Ayurvedic healing accessible
                  to every home. Today, we stand as a beacon of quality in the industry, sourcing only the
                  most pristine botanical ingredients and maintaining the highest standards of manufacturing.
                </p>
              </div>
              <div className="w-full md:w-80 h-96 bg-[#e6f1f0] rounded-[64px] border-8 border-white shadow-2xl overflow-hidden relative group shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-[#006d5b]/20 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center p-12 text-center flex-col gap-4">
                  <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform text-[#006d5b]">
                    <BookOpen size={48} />
                  </div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-4">Founded 1994</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
              {[
                { title: 'Pure Ingredients', desc: '100% natural and sustainably sourced botanicals.', icon: Heart, color: 'red' },
                { title: 'Ancient Wisdom', desc: 'Authentic formulas passed down through generations.', icon: ShieldCheck, color: 'blue' },
                { title: 'Global Reach', desc: 'Delivering the healing power of Ayurveda worldwide.', icon: Truck, color: 'emerald' }
              ].map((feature, i) => (
                <div key={i} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-${feature.color}-50 text-${feature.color}-600`}>
                    <feature.icon size={28} />
                  </div>
                  <h4 className="text-xl font-black text-gray-900 mb-3">{feature.title}</h4>
                  <p className="text-gray-500 font-medium leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'terms':
        return (
          <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto pb-12">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Terms & Conditions</h2>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Last updated: March 2024</p>
            </div>

            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 md:p-12 space-y-10">
                {[
                  {
                    title: '1. Use of Services',
                    content: 'By accessing and using our website, you agree to comply with all applicable laws and regulations. You are responsible for maintaining the confidentiality of your account credentials.'
                  },
                  {
                    title: '2. Product Accuracy',
                    content: 'While we strive for absolute accuracy, descriptions and prices are subject to change without notice. In the event of an error, we reserve the right to correct it and cancel any affected orders.'
                  },
                  {
                    title: '3. Intellectual Property',
                    content: 'All content on this site, including logos, text, and images, is the property of Shrigurudeo Ayurved and protected by copyright laws.'
                  },
                  {
                    title: '4. Limitation of Liability',
                    content: 'Shrigurudeo Ayurved shall not be liable for any direct, indirect, or incidental damages arising from your use of our products or services.'
                  }
                ].map((item, i) => (
                  <div key={i} className="space-y-4">
                    <h3 className="text-xl font-black text-[#006d5b] tracking-tight">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed font-medium">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 p-8 border-t border-gray-100 flex items-center gap-6">
                <div className="w-16 h-16 bg-[#006d5b] text-white rounded-2xl flex items-center justify-center shrink-0">
                  <FileText size={32} />
                </div>
                <p className="text-sm font-bold text-gray-500 max-w-md">
                  Questions about our terms? Please contact our legal team at <span className="text-gray-900 underline">legal@shrigurudeo.com</span>.
                </p>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto pb-12">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Privacy Policy</h2>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Protecting your data is our priority</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-6">
                <div className="w-24 h-24 bg-[#e6f1f0] text-[#006d5b] rounded-full flex items-center justify-center">
                  <ShieldCheck size={48} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Data Protection</h3>
                <p className="text-gray-500 font-medium leading-relaxed">
                  We use industry-standard encryption to protect your personal information. Your trust is our most valuable asset, and we never sell your data to third parties.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { title: 'Information We Collect', desc: 'We collect order details, shipping information, and communication history to improve your experience.' },
                  { title: 'How We Use Data', desc: 'Primarily for order fulfillment, customer support, and providing personalized health recommendations.' },
                  { title: 'Your Rights', desc: 'You have the right to request a copy of your data or ask for its deletion at any time.' }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-[#006d5b]/30 transition-colors">
                    <h4 className="font-black text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-blue-600 rounded-[32px] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-900/10">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-xl font-bold italic">Safe & Secure Shopping</h3>
                <p className="text-blue-100 text-sm font-medium">Your payment details are processed through secure gateways.</p>
              </div>
              <div className="flex gap-4">
                <div className="px-6 py-3 bg-white/20 rounded-xl font-black text-sm uppercase tracking-widest border border-white/20 backdrop-blur-sm">Verified</div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-8 animate-fadeIn">
            <h2 className="text-3xl font-bold text-gray-900">Account Settings</h2>

            {/* Personal Details Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-900">Personal Details</h3>
                <button className="text-[#006d5b] hover:bg-[#e6f1f0] p-2 rounded-full transition-colors">
                  <Edit2 size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
                  <p className="text-gray-900 font-medium">{user.full_name?.split(' ').slice(1).join(' ') || 'Singh'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
                  <p className="text-gray-900 font-medium">{user.full_name?.split(' ')[0] || 'Rudra'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                  <p className="text-gray-900 font-medium">{user.phone || '+91 9709056085'}</p>
                </div>
              </div>
            </div>

            {/* Email & Password Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-900">Email & Password</h3>
                <button className="text-[#006d5b] hover:bg-[#e6f1f0] p-2 rounded-full transition-colors">
                  <Edit2 size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <p className="text-gray-900 font-medium">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Password</label>
                  <p className="text-gray-900 font-medium text-2xl leading-none tracking-widest">•••••••••••••</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'overview':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Welcome back, {user.full_name?.split(' ')[0] || 'User'}</h1>
                <p className="text-gray-500 font-medium mt-1">Manage your orders and account settings.</p>
              </div>
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="md:hidden p-3 bg-white rounded-2xl border border-gray-100 shadow-sm text-[#006d5b] hover:bg-[#e6f1f0] transition-colors"
              >
                <Grid size={24} />
              </button>
            </div>

            {/* Refined Profile Card for Mobile */}
            <div className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#e6f1f0] rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
              <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center relative z-10">
                <div className="relative">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center text-[#006d5b] text-4xl font-black border-4 border-[#e6f1f0] shadow-xl overflow-hidden shrink-0">
                    {user.full_name?.charAt(0) || 'U'}
                  </div>
                  <div className="absolute bottom-1 right-1 w-8 h-8 bg-[#006d5b] rounded-full border-4 border-white flex items-center justify-center text-white">
                    <Edit2 size={12} />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">{user.full_name}</h2>
                  <p className="text-gray-500 font-bold mb-6">{user.email}</p>

                  <div className="grid grid-cols-2 md:grid-cols-2 gap-3 max-w-sm mx-auto md:mx-0">
                    <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-center md:text-left">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Phone</p>
                      <p className="text-xs md:text-sm font-bold text-gray-800 truncate">{user.phone || 'Not provided'}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-center md:text-left">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Joined</p>
                      <p className="text-xs md:text-sm font-bold text-gray-800">March 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Only: Quick Settings Menu replaces horizontal scroll */}
            <div className="md:hidden mt-8 space-y-3">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-2 mb-4">Account Settings</h3>
              {menuItems.filter(item => item.id !== 'overview').map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'wishlist') {
                      setIsWishlistOpen(true);
                    } else {
                      if (item.id === 'orders') {
                        loadOrders();
                      }
                      setActiveTab(item.id);
                    }
                  }}
                  className="w-full flex items-center justify-between p-5 bg-white rounded-3xl border border-gray-50 shadow-sm active:scale-95 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.id === 'orders' ? 'bg-blue-50 text-blue-600' :
                        item.id === 'wishlist' ? 'bg-red-50 text-red-600' :
                          item.id === 'addresses' ? 'bg-purple-50 text-purple-600' :
                            item.id === 'about' ? 'bg-[#e6f1f0] text-[#006d5b]' :
                              item.id === 'terms' ? 'bg-orange-50 text-orange-600' :
                                item.id === 'privacy' ? 'bg-indigo-50 text-indigo-600' :
                                  'bg-gray-100 text-gray-600'
                      }`}>
                      <item.icon size={22} />
                    </div>
                    <span className="font-bold text-gray-800">{item.label}</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-300" />
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-5 bg-red-50/50 rounded-3xl border border-red-100 active:scale-95 transition-all mt-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-sm">
                    <LogOut size={22} />
                  </div>
                  <span className="font-bold text-red-600">Logout</span>
                </div>
                <ChevronRight size={18} className="text-red-300" />
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Settings size={32} />
            </div>
            <h3 className="text-xl font-medium text-gray-900">Coming Soon</h3>
            <p className="text-center mt-2 max-w-sm">This section is currently under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col w-full overflow-x-hidden relative">
      <Navbar />

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[100] md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Content - Admin Style Slide-in */}
      <div className={`fixed inset-y-0 left-0 w-80 bg-white z-[110] transform transition-transform duration-300 ease-in-out md:hidden ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="p-8 border-b border-gray-100 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-xl font-black uppercase tracking-tighter brand-gradient">My Account</span>
              <span className="text-[10px] font-black text-[#ff6b3d] uppercase tracking-[0.3em]">Shrigurudeo Ayurved</span>
            </div>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
            >
              <LayoutDashboard size={20} />
            </button>
          </div>

          <nav className="p-6 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'wishlist') {
                    setIsWishlistOpen(true);
                  } else {
                    if (item.id === 'orders') {
                      loadOrders();
                    }
                    setActiveTab(item.id);
                  }
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === item.id && item.id !== 'wishlist'
                    ? 'bg-[#006d5b] text-white shadow-lg shadow-green-900/20'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-6 border-t border-gray-100 bg-gray-50 mt-auto">
            <button className="w-full flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-gray-900 transition-colors font-bold">
              <HelpCircle size={20} />
              Need Help?
            </button>
            <button
              onClick={() => {
                handleLogout();
                setIsMobileSidebarOpen(false);
              }}
              className="w-full flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors font-bold mt-2 border border-red-50"
            >
              <LogOut size={20} />
              LOGOUT
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-7xl overflow-hidden">
        {/* Mobile Header Toggle (Contextual) */}
        <div className="md:hidden flex items-center justify-between mb-6 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#e6f1f0] text-[#006d5b] rounded-2xl">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Navigation</p>
              <h2 className="text-lg font-black text-gray-900 tracking-tight uppercase leading-none">
                {menuItems.find(i => i.id === activeTab)?.label || 'Menu'}
              </h2>
            </div>
          </div>
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-3 bg-[#006d5b] text-white rounded-2xl shadow-lg shadow-green-900/20 active:scale-95 transition-all"
          >
            <Grid size={24} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar - Desktop Navigator */}
          <div className="hidden md:block w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <nav className="p-4 space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'wishlist') {
                        setIsWishlistOpen(true);
                      } else {
                        if (item.id === 'orders') {
                          loadOrders();
                        }
                        setActiveTab(item.id);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium ${activeTab === item.id
                        ? 'bg-[#e6f1f0] text-[#006d5b] font-bold border-l-4 border-[#006d5b]'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <item.icon size={20} className={activeTab === item.id ? 'text-[#006d5b]' : 'text-gray-400'} />
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="p-4 mt-4 border-t border-gray-100">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-900 transition-colors font-medium">
                  <HelpCircle size={20} />
                  Need Help?
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-600 transition-colors font-bold mt-1"
                >
                  <LogOut size={20} />
                  LOGOUT
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full overflow-hidden">
            {renderContent()}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && reviewOrder && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <m.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">WRITE A REVIEW</h2>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">Order #{reviewOrder.id.slice(-8).toUpperCase()}</p>
                  </div>
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <XCircle size={24} className="text-gray-400" />
                  </button>
                </div>

                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  {/* Reviewing Product - shown as info only, no selection needed */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-100">
                      {reviewOrder.items[0]?.image ? (
                        <img src={reviewOrder.items[0].image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center text-xl">📦</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-0.5">Reviewing</p>
                      <p className="font-bold text-gray-900 truncate">
                        {reviewOrder.items.length === 1
                          ? reviewOrder.items[0]?.title
                          : `${reviewOrder.items.length} products from this order`}
                      </p>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 text-center">Your Rating</label>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="transition-transform active:scale-90"
                        >
                          <Star
                            size={40}
                            className={star <= reviewForm.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Detailed Review</label>
                    <textarea
                      required
                      value={reviewForm.review_text}
                      onChange={(e) => setReviewForm({ ...reviewForm, review_text: e.target.value })}
                      placeholder="Tell us about your experience..."
                      className="w-full px-4 py-4 rounded-3xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-[#006d5b]/10 focus:border-[#006d5b] outline-none transition-all resize-none h-32 font-medium"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="w-full py-5 bg-[#006d5b] text-white rounded-[24px] font-black uppercase tracking-widest hover:bg-[#005c4b] active:scale-[0.98] transition-all shadow-xl shadow-green-900/20 flex items-center justify-center gap-3 disabled:bg-gray-400 disabled:shadow-none"
                  >
                    {isSubmittingReview ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        SUBMITTING...
                      </>
                    ) : (
                      'SUBMIT REVIEW'
                    )}
                  </button>
                </form>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
      <Footer />
      <Wishlist isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </div>
  );
};

export default Account;
