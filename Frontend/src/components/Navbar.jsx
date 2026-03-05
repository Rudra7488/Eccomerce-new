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
      <div className="bg-[#006d5b] text-white py-2 px-4 sm:px-8 flex justify-between items-center text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <Phone size={14} />
          <span>+001234567890</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span>Get 50% Off on Selected Items</span>
          <span className="border-l border-white/30 h-3 mx-2"></span>
          <a href="#" className="hover:underline text-[#ff6b3d] font-bold">Shop Now</a>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative" ref={langRef}>
            <button 
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1 hover:text-[#ff6b3d] transition-colors"
            >
              <Globe size={14} />
              <span className="uppercase">{currentLang}</span>
              <ChevronDown size={14} />
            </button>
            
            {isLangDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 bg-white text-gray-800 rounded-lg shadow-xl py-2 w-32 z-[60] border border-gray-100">
                <button onClick={() => handleLangChange('en')} className="w-full text-left px-4 py-2 hover:bg-[#e6f1f0] hover:text-[#006d5b] transition-colors">English</button>
                <button onClick={() => handleLangChange('hi')} className="w-full text-left px-4 py-2 hover:bg-[#e6f1f0] hover:text-[#006d5b] transition-colors">Hindi</button>
                <button onClick={() => handleLangChange('bn')} className="w-full text-left px-4 py-2 hover:bg-[#e6f1f0] hover:text-[#006d5b] transition-colors">Bengali</button>
                <button onClick={() => handleLangChange('te')} className="w-full text-left px-4 py-2 hover:bg-[#e6f1f0] hover:text-[#006d5b] transition-colors">Telugu</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white py-4 px-4 sm:px-8 flex justify-between items-center border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-8 lg:gap-12">
          <Link to="/" className="flex flex-col items-center group">
            <span className="text-2xl sm:text-3xl font-black text-[#006d5b] tracking-tighter group-hover:text-[#ff6b3d] transition-colors">MOZARI</span>
            <div className="h-1 w-full bg-[#ff6b3d] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </Link>
          
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-bold text-gray-700">
            <Link to="/" className="flex flex-col items-center group">
              <span className="hover:text-[#006d5b] transition-colors">Home</span>
              <div className="h-0.5 w-full bg-[#ff6b3d] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </Link>
            <Link to="/products" className="flex flex-col items-center group">
              <span className="hover:text-[#006d5b] transition-colors">Shop</span>
              <div className="h-0.5 w-full bg-[#ff6b3d] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </Link>
            <Link to="/deals" className="flex flex-col items-center group">
              <span className="hover:text-[#006d5b] transition-colors">Deals</span>
              <div className="h-0.5 w-full bg-[#ff6b3d] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </Link>
            <Link to="/about" className="flex flex-col items-center group">
              <span className="hover:text-[#006d5b] transition-colors">About</span>
              <div className="h-0.5 w-full bg-[#ff6b3d] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <div className="relative hidden lg:block group">
            <input 
              type="text" 
              placeholder={t.search_placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
              className="bg-gray-50 border border-gray-200 rounded-full py-2 px-6 pr-12 w-64 xl:w-80 focus:outline-none focus:ring-2 focus:ring-[#006d5b]/20 focus:border-[#006d5b] transition-all"
            />
            <button 
              onClick={handleSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#006d5b] transition-colors"
            >
              <Search size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2 text-gray-600 hover:bg-[#e6f1f0] hover:text-[#006d5b] rounded-full transition-all relative"
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#ff6b3d] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {isNotificationOpen && (
                <div className="absolute top-full right-0 mt-4 bg-white rounded-2xl shadow-2xl py-4 w-72 sm:w-80 z-[60] border border-gray-100 overflow-hidden">
                  <div className="px-6 py-2 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">Notifications</h3>
                    <span className="text-xs text-[#006d5b] font-bold cursor-pointer">Mark all as read</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className={`px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 ${n.read ? 'border-transparent' : 'border-[#006d5b]'}`}>
                        <p className="text-sm text-gray-800 mb-1">{n.message}</p>
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{n.time}</span>
                      </div>
                    ))}
                  </div>
                  <div className="px-6 py-3 bg-gray-50 text-center">
                    <button className="text-sm font-bold text-[#006d5b] hover:underline">View all notifications</button>
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => setIsWishlistOpen(true)}
              className="p-2 text-gray-600 hover:bg-[#fff3ef] hover:text-[#ff6b3d] rounded-full transition-all relative"
            >
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#ff6b3d] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-gray-600 hover:bg-[#e6f1f0] hover:text-[#006d5b] rounded-full transition-all relative"
            >
              <ShoppingCart size={22} />
              {totalQuantity > 0 && (
                <span className="absolute top-1 right-1 bg-[#006d5b] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                  {totalQuantity}
                </span>
              )}
            </button>

            <button 
              onClick={handleAccountClick}
              className="flex items-center gap-2 p-1 pr-3 hover:bg-gray-50 rounded-full transition-all border border-transparent hover:border-gray-200"
            >
              <div className="w-8 h-8 bg-[#e6f1f0] text-[#006d5b] rounded-full flex items-center justify-center">
                <User size={18} />
              </div>
              <span className="hidden sm:block text-sm font-bold text-gray-700">{t.account}</span>
            </button>
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
