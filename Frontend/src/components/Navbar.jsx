import React, { useState, useEffect, useRef } from 'react';
import { Search, User, ShoppingCart, ChevronDown, Phone, Bell, Globe, Heart } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setLanguage } from '../store/slices/languageSlice';
import { translations } from '../translations';
import Cart from './Cart';
import Wishlist from './Wishlist';

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langRef = useRef(null);
  const notificationRef = useRef(null);
  
  const dispatch = useDispatch();
  const currentLang = useSelector((state) => state.language.currentLanguage);
  const t = translations[currentLang];
  
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        navigate(`/?search=${encodeURIComponent(searchTerm)}`);
      } else if (window.location.search.includes('search=')) {
        // Clear search if input is empty but URL has search param
        navigate('/');
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm, navigate]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (searchTerm.trim()) {
        navigate(`/?search=${encodeURIComponent(searchTerm)}`);
      }
    }
  };
  
  const handleAccountClick = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      navigate('/account');
    } else {
      navigate('/login');
    }
  };
  
  // Sample notifications data
  const notifications = [
    { id: 1, message: 'Order #12345 has been shipped!', time: '2 min ago', read: false },
    { id: 2, message: 'Special discount for you!', time: '1 hour ago', read: false },
    { id: 3, message: 'Welcome back to our store!', time: '1 day ago', read: true },
  ];
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Close notification and language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLangChange = (lang) => {
    dispatch(setLanguage(lang));
    setIsLangDropdownOpen(false);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Bar */}
      <div className="bg-[#003d29] text-white py-2 px-4 sm:px-8 flex justify-between items-center text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <Phone size={14} />
          <span>+001234567890</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span>Get 50% Off on Selected Items</span>
          <span className="border-l border-white/30 h-3 mx-2"></span>
          <a href="#" className="hover:underline">Shop Now</a>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative" ref={langRef}>
            <div 
              className="flex items-center gap-1 cursor-pointer hover:text-green-200 transition"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
            >
              <Globe size={14} />
              <span>
                {currentLang === 'en' ? 'Eng' : currentLang === 'hi' ? 'हिंदी' : 'मराठी'}
              </span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
            
            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <button 
                  onClick={() => handleLangChange('en')}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-green-50 transition flex items-center justify-between ${currentLang === 'en' ? 'text-[#003d29] font-bold bg-green-50' : 'text-gray-700'}`}
                >
                  English
                  {currentLang === 'en' && <div className="w-1.5 h-1.5 bg-[#003d29] rounded-full"></div>}
                </button>
                <button 
                  onClick={() => handleLangChange('hi')}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-green-50 transition flex items-center justify-between ${currentLang === 'hi' ? 'text-[#003d29] font-bold bg-green-50' : 'text-gray-700'}`}
                >
                  हिंदी (Hindi)
                  {currentLang === 'hi' && <div className="w-1.5 h-1.5 bg-[#003d29] rounded-full"></div>}
                </button>
                <button 
                  onClick={() => handleLangChange('mr')}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-green-50 transition flex items-center justify-between ${currentLang === 'mr' ? 'text-[#003d29] font-bold bg-green-50' : 'text-gray-700'}`}
                >
                  मराठी (Marathi)
                  {currentLang === 'mr' && <div className="w-1.5 h-1.5 bg-[#003d29] rounded-full"></div>}
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-green-200 transition">
            <span>{t.location}</span>
            <ChevronDown size={14} />
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white py-4 px-4 sm:px-8 flex flex-col md:flex-row justify-between items-center shadow-sm gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 text-2xl font-bold text-[#003d29]">
           <div className="relative">
             <ShoppingCart className="text-orange-500" size={28} />
             {/* Simple leaf decoration simulation */}
             <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
           </div>
           <span>Shopcart</span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 font-medium text-gray-700">
          <div className="flex items-center gap-1 cursor-pointer hover:text-green-700">
            Categories <ChevronDown size={16} />
          </div>
          <a href="#" className="hover:text-green-700">Deals</a>
          <a href="#" className="hover:text-green-700">What's New</a>
          <a href="#" className="hover:text-green-700">Delivery</a>
        </nav>

        {/* Search Bar */}
        <div className="relative w-full md:w-auto md:flex-1 md:max-w-md mx-4">
          <input 
            type="text" 
            placeholder={t.search_placeholder} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-100 rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
          <Search 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-green-500" 
            size={18} 
            onClick={(e) => handleSearch({ ...e, type: 'click' })}
          />
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-6 text-gray-700 font-medium">
          <div 
            onClick={handleAccountClick}
            className="flex items-center gap-2 cursor-pointer hover:text-green-700 transition"
          >
            <User size={20} />
            <span>{t.account}</span>
          </div>
          <div className="relative">
            <div 
              className="flex items-center gap-2 cursor-pointer hover:text-green-700 relative"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <Bell size={20} />
              <span>{t.notifications}</span>
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            
            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div ref={notificationRef} className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`p-4 border-b border-gray-100 ${!notification.read ? 'bg-blue-50' : 'bg-white'}`}
                      >
                        <p className="text-sm text-gray-800">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">No notifications</div>
                  )}
                </div>
                <div className="p-2 bg-gray-50 text-center">
                  <button 
                    className="text-sm text-green-700 hover:text-green-800 font-medium"
                    onClick={() => setIsNotificationOpen(false)}
                  >
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>
          <div 
            className="flex items-center gap-2 cursor-pointer hover:text-green-700 relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart size={20} />
            <span>{t.cart_label || 'Cart'}</span>
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      {/* Wishlist Drawer */}
      <Wishlist isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </div>
  );
};

export default Navbar;
