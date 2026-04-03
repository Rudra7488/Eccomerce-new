import React, { useState, useEffect, useRef } from 'react';
import { Search, User, ShoppingCart, ChevronDown, Phone, Bell, Globe, Heart, Menu, X } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const langRef = useRef(null);
  const notificationRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const dispatch = useDispatch();
  const currentLang = useSelector((state) => state.language.currentLanguage);
  const t = translations[currentLang];

  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

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
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
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
        <div className="flex items-center gap-4 md:gap-8 lg:gap-12">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-[#e6f1f0] hover:text-[#006d5b] rounded-xl transition-all"
          >
            <Menu size={24} />
          </button>

          <Link to="/" onClick={() => setSearchTerm('')} className="flex flex-col items-start group">
            <span className="text-sm sm:text-2xl md:text-3xl font-black tracking-tighter group-hover:tracking-tight transition-all uppercase leading-none brand-gradient animate-brand">
              Shrigurudeo Ayurved
            </span>
            <span className="text-[8px] sm:text-xs md:text-sm font-bold text-[#ff6b3d] tracking-[0.3em] uppercase mt-1 animate-brand" style={{ animationDelay: '0.2s' }}>
              Rasashala
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-bold text-gray-700">
            <Link to="/" onClick={() => setSearchTerm('')} className="flex flex-col items-center group text-center min-w-max">
              <span className="hover:text-[#006d5b] transition-colors">Home</span>
              <div className="h-0.5 w-full bg-[#ff6b3d] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </Link>
            <Link to="/products" className="flex flex-col items-center group text-center min-w-max">
              <span className="hover:text-[#006d5b] transition-colors">Shop</span>
              <div className="h-0.5 w-full bg-[#ff6b3d] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </Link>
            <Link to="/deals" className="flex flex-col items-center group text-center min-w-max">
              <span className="hover:text-[#006d5b] transition-colors">Deals</span>
              <div className="h-0.5 w-full bg-[#ff6b3d] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </Link>
            <Link to="/about" className="flex flex-col items-center group text-center min-w-max">
              <span className="hover:text-[#006d5b] transition-colors">About</span>
              <div className="h-0.5 w-full bg-[#ff6b3d] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden lg:block relative group">
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



          <div className="flex items-center gap-1.5 sm:gap-4">
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
              className="p-2 text-gray-600 hover:bg-[#e6f1f0] hover:text-[#006d5b] rounded-full transition-all relative"
            >
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
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
              className="flex items-center gap-1.5 p-1 hover:bg-gray-50 rounded-full transition-all border border-transparent"
            >
              <div className="w-8 h-8 bg-[#e6f1f0] text-[#006d5b] rounded-full flex items-center justify-center shrink-0">
                <User size={18} />
              </div>
              <span className="hidden sm:block text-sm font-bold text-gray-700">{t.account}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar - Always Visible */}
      <div className="lg:hidden px-4 pb-4 bg-white border-b border-gray-100">
        <div className="relative">
          <input
            type="text"
            placeholder={t.search_placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(e);
              }
            }}
            className="bg-gray-50 border border-gray-200 rounded-2xl py-2.5 px-6 pr-12 w-full focus:outline-none focus:ring-2 focus:ring-[#006d5b]/10 focus:border-[#006d5b] transition-all"
          />
          <button
            onClick={() => {
              handleSearch();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#006d5b]"
          >
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Sidebar */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[100] md:hidden backdrop-blur-sm transition-all"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div ref={mobileMenuRef} className={`fixed inset-y-0 left-0 w-80 bg-white z-[110] transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <Link to="/" onClick={() => { setIsMobileMenuOpen(false); setSearchTerm(''); }} className="flex flex-col items-start">
              <span className="text-xl font-black tracking-tighter uppercase leading-none brand-gradient">
                Shrigurudeo
              </span>
              <span className="text-[10px] font-bold text-[#ff6b3d] tracking-[0.2em] uppercase mt-1">
                Ayurved
              </span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 p-6 space-y-4">
            <Link to="/" onClick={() => { setIsMobileMenuOpen(false); setSearchTerm(''); }} className="flex items-center gap-4 text-lg font-bold text-gray-800 hover:text-[#006d5b] transition-colors">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-[#006d5b]">
                <Globe size={20} />
              </div>
              Home
            </Link>
            <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-lg font-bold text-gray-800 hover:text-[#006d5b] transition-colors">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                <ShoppingCart size={20} />
              </div>
              Shop Products
            </Link>
            <Link to="/deals" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-lg font-bold text-gray-800 hover:text-[#006d5b] transition-colors">
              <div className="w-10 h-10 bg-[#fff3ef] rounded-xl flex items-center justify-center text-[#ff6b3d]">
                <Bell size={20} />
              </div>
              Hot Deals
            </Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-lg font-bold text-gray-800 hover:text-[#006d5b] transition-colors">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                <User size={20} />
              </div>
              About Us
            </Link>
          </nav>

          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#006d5b] text-white rounded-full flex items-center justify-center text-xl font-bold">
                U
              </div>
              <div>
                <p className="font-bold text-gray-900">Guest User</p>
                <p className="text-xs text-gray-500">Welcome to Shrigurudeo</p>
              </div>
            </div>
            <button
              onClick={() => {
                handleAccountClick();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-4 bg-[#006d5b] text-white rounded-2xl font-bold shadow-lg shadow-green-900/20 hover:bg-[#005c4b] transition-all"
            >
              My Account
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
