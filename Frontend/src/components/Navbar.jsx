import React, { useState } from 'react';
import { Search, User, ShoppingCart, ChevronDown, Phone } from 'lucide-react';
import { useSelector } from 'react-redux';
import Cart from './Cart';

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

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
          <div className="flex items-center gap-1 cursor-pointer">
            <span>Eng</span>
            <ChevronDown size={14} />
          </div>
          <div className="flex items-center gap-1 cursor-pointer">
            <span>Location</span>
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
            placeholder="Search Product" 
            className="w-full bg-gray-100 rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-6 text-gray-700 font-medium">
          <div className="flex items-center gap-2 cursor-pointer hover:text-green-700">
            <User size={20} />
            <span>Account</span>
          </div>
          <div 
            className="flex items-center gap-2 cursor-pointer hover:text-green-700 relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart size={20} />
            <span>Cart</span>
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
    </div>
  );
};

export default Navbar;
