import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  TrendingUp, 
  Package, 
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  TrendingDown,
  Activity
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    dashboardStats: {
      totalSales: '₹0',
      totalOrders: '0',
      pendingOrders: '0',
      completedOrders: '0'
    },
    recentActivities: [],
    topProducts: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vendor-admin/analytics/?year=this`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      toast.error('Failed to load dashboard overview');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { 
      title: 'Total Sales', 
      value: data.dashboardStats.totalSales, 
      trend: '+0%', 
      isUp: true,
      icon: TrendingUp, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      title: 'Active Orders', 
      value: data.dashboardStats.totalOrders, 
      trend: '+0%', 
      isUp: true,
      icon: ShoppingBag, 
      color: 'text-green-600', 
      bg: 'bg-green-50' 
    },
    { 
      title: 'Pending Orders', 
      value: data.dashboardStats.pendingOrders, 
      trend: '0', 
      isUp: false,
      icon: Clock, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50' 
    },
    { 
      title: 'Completed', 
      value: data.dashboardStats.completedOrders, 
      trend: '+0%', 
      isUp: true,
      icon: CheckCircle, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50' 
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col justify-center items-center h-[70vh] bg-white rounded-3xl border border-orange-100 shadow-sm">
          <div className="h-16 w-16 rounded-full border-4 border-gray-100 border-t-orange-500 animate-spin"></div>
          <p className="mt-4 text-gray-500 font-medium">Loading Overview...</p>
        </div>
      </AdminLayout>
    );
  }

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
            {data.recentActivities.length > 0 ? data.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-4 border-b border-orange-50 last:border-0 hover:bg-[#FFFBF2] transition rounded-xl px-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-xl text-gray-700 border border-orange-100">
                    <Package size={20} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{activity.short_id} - {activity.customer_name}</p>
                    <p className="text-sm text-gray-500">
                      {activity.items_count} items worth ₹{activity.total_amount.toLocaleString()} • {formatDistanceToNow(new Date(activity.created_at))} ago
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                    activity.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 
                    activity.status === 'Cancelled' ? 'bg-red-50 text-red-600' : 
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-10">
                <Activity size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No recent activities found</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Products Placeholder */}
        <div className="bg-white rounded-3xl p-8 text-gray-900 border border-orange-100 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Top Products</h2>
          <div className="space-y-6">
            {data.topProducts.length > 0 ? data.topProducts.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center gap-4 p-3 bg-[#FFFBF2] rounded-2xl border border-orange-100 hover:border-orange-200 transition">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-sm border border-orange-50">
                  {product.image?.startsWith('http') || product.image?.startsWith('data') ? (
                    <img src={product.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">{product.image || '📦'}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm truncate max-w-[120px]">{product.name}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{product.sold} sales</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-500 text-sm">{product.revenue}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-6">
                <Package size={30} className="mx-auto text-gray-300 mb-2" />
                <p className="text-xs text-gray-500">No top products yet</p>
              </div>
            )}
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
