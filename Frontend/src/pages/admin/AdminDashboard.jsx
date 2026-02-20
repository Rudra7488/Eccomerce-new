import React from 'react';
import { 
  ShoppingBag, 
  TrendingUp, 
  Package, 
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminDashboard = () => {
  const stats = [
    { 
      title: 'Total Sales', 
      value: '₹1,24,500', 
      trend: '+12.5%', 
      isUp: true,
      icon: TrendingUp, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      title: 'Total Orders', 
      value: '456', 
      trend: '+5.2%', 
      isUp: true,
      icon: ShoppingBag, 
      color: 'text-green-600', 
      bg: 'bg-green-50' 
    },
    { 
      title: 'Pending Orders', 
      value: '23', 
      trend: '-2.1%', 
      isUp: false,
      icon: Clock, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50' 
    },
    { 
      title: 'Completed', 
      value: '433', 
      trend: '+8.4%', 
      isUp: true,
      icon: CheckCircle, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50' 
    },
  ];

  return (
    <AdminLayout>
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Monitor your store's performance and activities.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm transition-all hover:shadow-md hover:shadow-orange-100/50">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${stat.isUp ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-orange-100 shadow-sm p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
            <button className="text-sm font-bold text-orange-500 hover:underline">View All</button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-orange-50 last:border-0 hover:bg-[#FFFBF2] transition rounded-xl px-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-xl text-gray-700 border border-orange-100">
                    {i % 2 === 0 ? '📦' : '🛍️'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">New Order #ORD-{1000 + i}</p>
                    <p className="text-sm text-gray-500">2 items worth ₹4,500 • 2 mins ago</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                    i % 3 === 0 ? 'bg-orange-100 text-orange-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {i % 3 === 0 ? 'Processing' : 'Completed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products Placeholder */}
        <div className="bg-white rounded-3xl p-8 text-gray-900 border border-orange-100 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Top Products</h2>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-[#FFFBF2] rounded-2xl border border-orange-100 hover:border-orange-200 transition">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm border border-orange-50">
                  {i === 1 ? '🎧' : i === 2 ? '⌚' : '📱'}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">Product Name {i}</p>
                  <p className="text-xs text-gray-500 mt-0.5">124 sales this week</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-500">₹{2400 * i}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20">
            Inventory Report
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
