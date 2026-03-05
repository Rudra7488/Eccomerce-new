import React, { useState } from 'react';
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
  Clock
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Wishlist from '../components/Wishlist';
import { AnimatePresence, motion as m } from 'framer-motion';
import { logoutUser } from '../store/slices/userSlice';
import { clearCartLocal, addToCart } from '../store/slices/cartSlice';

const Account = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [ordersLoading, setOrdersLoading] = useState(false);

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
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ];

  const loadOrders = () => {
    try {
      setOrdersLoading(true);
      const raw = JSON.parse(localStorage.getItem('orders') || '[]');
      let filtered = raw;
      if (user?.email) {
        const byEmail = raw.filter(o => o.customer?.email === user.email);
        filtered = byEmail.length > 0 ? byEmail : raw;
      }
      setOrders(filtered.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch {
      setOrders([]);
    }
    setTimeout(() => setOrdersLoading(false), 200);
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

  const cancelOrder = (orderId) => {
    try {
      const raw = JSON.parse(localStorage.getItem('orders') || '[]');
      const updated = raw.map(o => o.id === orderId ? { ...o, status: 'Cancelled' } : o);
      localStorage.setItem('orders', JSON.stringify(updated));
      loadOrders();
    } catch (err) {
      console.error(err);
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
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                    className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    {/* Order Header */}
                    <div className="p-6 sm:p-8 border-b border-gray-100 bg-gray-50/50">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-gray-900">Order #{order.id.slice(-8).toUpperCase()}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                              order.status === 'Delivered' ? 'bg-[#e6f1f0] text-[#006d5b] border-[#b3d4cf]' :
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

                    {/* Order Items */}
                    <div className="p-6 sm:p-8">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                          <Package size={18} />
                          Items ({order.items?.length || 0})
                        </h4>
                        <button
                          onClick={() => toggleExpand(order.id)}
                          className="text-sm font-bold text-[#006d5b] hover:underline flex items-center gap-1"
                        >
                          {expanded[order.id] ? 'Hide Details' : 'View Details'}
                          {expanded[order.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                              {order.items?.map((item, idx) => (
                                <div key={idx} className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors">
                                  <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-100 shrink-0">
                                    {(item.image?.startsWith('http') || item.image?.startsWith('data:') || item.image?.startsWith('/') || (item.image || '').length > 20) ? (
                                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="text-2xl">{item.image || '📦'}</span>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-bold text-gray-900 truncate mb-1">{item.title}</h5>
                                    <p className="text-sm text-gray-500 mb-2">Qty: {item.quantity}</p>
                                    <p className="font-bold text-[#006d5b]">₹{(item.totalPrice || item.price).toLocaleString()}</p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-8">
                              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin size={18} />
                                Shipping Details
                              </h4>
                              <div className="grid sm:grid-cols-2 gap-6 text-sm">
                                <div>
                                  <p className="text-gray-500 mb-1">Delivering To</p>
                                  <p className="font-bold text-gray-900">{order.customer?.fullName}</p>
                                  <p className="text-gray-700">{order.customer?.phone}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500 mb-1">Address</p>
                                  <p className="text-gray-900">{order.customer?.address}</p>
                                  <p className="text-gray-900">{order.customer?.city} - {order.customer?.zipCode}</p>
                                </div>
                              </div>
                            </div>
                          </m.div>
                        )}
                      </AnimatePresence>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
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
                        {order.status === 'Placed' && (
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
                      onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
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
                      onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#006d5b] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      required
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#006d5b] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                    <input
                      type="text"
                      required
                      value={addressForm.zip_code}
                      onChange={(e) => setAddressForm({...addressForm, zip_code: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#006d5b] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="text"
                      required
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#006d5b] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="is_default"
                      checked={addressForm.is_default}
                      onChange={(e) => setAddressForm({...addressForm, is_default: e.target.checked})}
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
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.full_name?.split(' ')[0] || 'User'}</h1>
              <p className="text-gray-500 mt-1">Here's what's happening with your account today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <m.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { loadOrders(); setActiveTab('orders'); }} 
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center group hover:shadow-md transition-all h-64"
              >
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ShoppingBag size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Orders</h3>
                <p className="text-sm text-gray-500 mt-2">Check your order status</p>
              </m.button>
              
              <m.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsWishlistOpen(true)} 
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center group hover:shadow-md transition-all h-64"
              >
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Heart size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Wishlist</h3>
                <p className="text-sm text-gray-500 mt-2">Your saved items</p>
              </m.button>

              <m.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('addresses')} 
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center group hover:shadow-md transition-all h-64"
              >
                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MapPin size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Addresses</h3>
                <p className="text-sm text-gray-500 mt-2">Manage delivery addresses</p>
              </m.button>

              <m.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('settings')} 
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center group hover:shadow-md transition-all h-64"
              >
                <div className="w-16 h-16 bg-[#fff3ef] rounded-2xl flex items-center justify-center text-[#ff6b3d] mb-6 group-hover:scale-110 transition-transform duration-300">
                  <User size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Profile Info</h3>
                <p className="text-sm text-gray-500 mt-2">Update personal details</p>
              </m.button>

              <m.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('settings')} 
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center group hover:shadow-md transition-all h-64"
              >
                <div className="w-16 h-16 bg-[#e6f1f0] rounded-2xl flex items-center justify-center text-[#006d5b] mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Security</h3>
                <p className="text-sm text-gray-500 mt-2">Change password & settings</p>
              </m.button>

              <m.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center group hover:shadow-md transition-all h-64"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <LogOut size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Logout</h3>
                <p className="text-sm text-gray-500 mt-2">Sign out of your account</p>
              </m.button>
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
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-72 flex-shrink-0">
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
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium ${
                      activeTab === item.id
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
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>

      <Footer />
      <Wishlist isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </div>
  );
};

export default Account;
