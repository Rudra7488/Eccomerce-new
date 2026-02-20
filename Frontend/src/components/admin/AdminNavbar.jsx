import React from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';

const AdminNavbar = ({ onMenuClick }) => {
  return (
    <header className="h-20 bg-white border-b border-orange-100 flex items-center justify-between px-6 md:px-10 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-orange-50 rounded-xl transition"
        >
          <Menu size={24} className="text-gray-600" />
        </button>
        
        <div className="relative hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search analytics, orders..." 
            className="pl-12 pr-6 py-2.5 bg-[#FFFBF2] border border-orange-100 text-gray-900 placeholder-gray-400 rounded-2xl w-80 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <button className="relative p-2.5 text-gray-500 hover:bg-orange-50 rounded-xl transition">
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-10 w-[1px] bg-orange-100 hidden md:block"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-gray-900 leading-none">Admin User</p>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-bold">Super Admin</p>
          </div>
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20">
            A
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
