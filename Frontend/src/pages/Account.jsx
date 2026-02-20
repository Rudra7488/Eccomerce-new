import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, Heart, LogOut, ChevronRight, ShoppingBag, Settings, Bell, ShieldCheck } from 'lucide-react';
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

  const user = JSON.parse(localStorage.getItem('user')) || {
    full_name: 'Guest User',
    email: 'guest@example.com'
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

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-[#003d29] p-8 text-white">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30">
                <User size={40} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.full_name}</h1>
                <p className="text-green-100/80 text-sm">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Account Menu */}
          <div className="p-4 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Wishlist Button */}
              <button 
                onClick={() => setIsWishlistOpen(true)}
                className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                    <Heart size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-800">{t.wishlist || 'Wishlist'}</p>
                    <p className="text-xs text-gray-500">{wishlistCount} {t.items || 'items'} saved</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>

              {/* Orders Placeholder */}
              <button className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <ShoppingBag size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-800">My Orders</p>
                    <p className="text-xs text-gray-500">Track and manage orders</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>

              <button className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <Bell size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-800">{t.notifications}</p>
                    <p className="text-xs text-gray-500">Manage alerts</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>

              <button className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                    <Settings size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-800">Settings</p>
                    <p className="text-xs text-gray-500">Profile and preferences</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Logout Section */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <button 
                onClick={handleLogout}
                className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-red-600 hover:text-white transition shadow-sm"
              >
                <LogOut size={22} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <Wishlist isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </div>
  );
};

export default Account;
