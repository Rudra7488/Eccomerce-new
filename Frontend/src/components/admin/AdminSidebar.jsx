import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut, 
  Package,
  ChevronRight
} from 'lucide-react';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const menuItems = [
    { 
      title: 'Dashboard', 
      icon: LayoutDashboard, 
      path: '/admin/dashboard' 
    },
    { 
      title: 'Products', 
      icon: Package, 
      path: '/admin/products' 
    },
    { 
      title: 'Orders', 
      icon: ShoppingBag, 
      path: '/admin/orders' 
    },
    { 
      title: 'Customers', 
      icon: Users, 
      path: '/admin/customers' 
    },
    { 
      title: 'Profile', 
      icon: Users, 
      path: '/admin/profile' 
    },
    { 
      title: 'Settings', 
      icon: Settings, 
      path: '/admin/settings' 
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="hidden md:flex flex-col w-72 bg-white text-gray-800 h-screen sticky top-0 border-r border-orange-100 shadow-sm z-30">
      <div className="p-8">
        <div className="flex items-center gap-3 text-2xl font-bold mb-10">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center backdrop-blur-md border border-orange-100">
            <ShoppingBag className="text-orange-500" size={24} />
          </div>
          <span className="text-gray-900">Velora <span className="text-orange-500">Admin</span></span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                isActive(item.path) 
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                : 'text-gray-500 hover:bg-orange-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className={isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'} />
                <span className="font-semibold">{item.title}</span>
              </div>
              {isActive(item.path) && <ChevronRight size={16} className="text-white/80" />}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-4 text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all duration-200 font-bold border border-orange-100 hover:border-red-100"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
