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
  LayoutDashboard
} from 'lucide-react';
import { translations } from '../translations';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Wishlist from '../components/Wishlist';
import { logoutUser } from '../store/slices/userSlice';
import { clearCartLocal } from '../store/slices/cartSlice';

const Account = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentLang = useSelector((state) => state.language.currentLanguage);
  const t = translations[currentLang];
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');

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

  const renderContent = () => {
    switch (activeTab) {
      case 'settings':
        return (
          <div className="space-y-8 animate-fadeIn">
            <h2 className="text-3xl font-bold text-gray-900">Account Settings</h2>
            
            {/* Personal Details Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-900">Personal Details</h3>
                <button className="text-[#003d29] hover:bg-green-50 p-2 rounded-full transition-colors">
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
                <button className="text-[#003d29] hover:bg-green-50 p-2 rounded-full transition-colors">
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
             <div className="bg-[#003d29] rounded-2xl p-8 text-white mb-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30">
                  <User size={40} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Welcome, {user.full_name}</h1>
                  <p className="text-green-100/80 text-sm">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button onClick={() => setActiveTab('orders')} className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all text-left group">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                  <ShoppingBag size={24} />
                </div>
                <h3 className="font-bold text-gray-900">My Orders</h3>
                <p className="text-sm text-gray-500 mt-1">Track active orders and history</p>
              </button>
              
              <button onClick={() => setIsWishlistOpen(true)} className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all text-left group">
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-600 mb-4 group-hover:scale-110 transition-transform">
                  <Heart size={24} />
                </div>
                <h3 className="font-bold text-gray-900">Wishlist</h3>
                <p className="text-sm text-gray-500 mt-1">{wishlistCount} items saved</p>
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
                        setActiveTab(item.id);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium ${
                      activeTab === item.id
                        ? 'bg-green-50 text-[#003d29] font-bold border-l-4 border-[#003d29]'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon size={20} className={activeTab === item.id ? 'text-[#003d29]' : 'text-gray-400'} />
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
