import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  ShoppingCart, 
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Award,
  CreditCard,
  Banknote,
  XCircle,
  Activity
} from 'lucide-react';

const AdminReports = () => {
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState('this');
  const [data, setData] = useState({
    revenueData: [],
    dailyData: [],
    paymentData: [],
    topProducts: [],
    categoryData: [],
    stats: []
  });

  useEffect(() => {
    fetchAnalytics(year);
  }, [year]);

  const fetchAnalytics = async (selectedYear) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vendor-admin/analytics/?year=${selectedYear}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch analytics');
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      toast.error('Failed to load real-time reports');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  const PAYMENT_COLORS = ['#8b5cf6', '#f97316'];

  const getIcon = (type) => {
    switch (type) {
      case 'revenue': return DollarSign;
      case 'online': return CreditCard;
      case 'offline': return Banknote;
      case 'orders': return ShoppingCart;
      case 'cancelled_revenue': return XCircle;
      case 'cancelled_orders': return Activity;
      default: return TrendingUp;
    }
  };

  const getColors = (type) => {
    switch (type) {
      case 'revenue': return { color: 'text-green-600', bg: 'bg-green-50' };
      case 'online': return { color: 'text-purple-600', bg: 'bg-purple-50' };
      case 'offline': return { color: 'text-orange-600', bg: 'bg-orange-50' };
      case 'orders': return { color: 'text-blue-600', bg: 'bg-blue-50' };
      case 'cancelled_revenue': return { color: 'text-red-600', bg: 'bg-red-50' };
      case 'cancelled_orders': return { color: 'text-pink-600', bg: 'bg-pink-50' };
      default: return { color: 'text-gray-600', bg: 'bg-gray-50' };
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col justify-center items-center h-[70vh] bg-white rounded-3xl border border-orange-100 shadow-sm">
          <div className="h-16 w-16 rounded-full border-4 border-gray-100 border-t-orange-500 animate-spin"></div>
          <p className="mt-4 text-gray-500 font-medium">Generating your reports...</p>
        </div>
      </AdminLayout>
    );
  }

  const { revenueData, dailyData, paymentData, topProducts, categoryData, stats } = data;

  return (
    <AdminLayout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-500 mt-1">Detailed analysis of your store's performance.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = getIcon(stat.type);
          const { color, bg } = getColors(stat.type);
          return (
            <div key={index} className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 ${bg} ${color} rounded-2xl flex items-center justify-center`}>
                  <Icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${stat.isUp ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                  {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Revenue Analytics</h2>
            <select 
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-sm outline-none focus:border-orange-500"
            >
              <option value="this">This Year</option>
              <option value="last">Last Year</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#fdba74', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Trend */}
        <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Order Statistics</h2>
            <button className="text-sm font-bold text-orange-500 hover:text-orange-600">View Details</button>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#fff7ed'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="online" name="Online (Prepaid)" stackId="a" fill="#8b5cf6" barSize={20} />
                <Bar dataKey="offline" name="Offline (COD)" stackId="a" fill="#f97316" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Daily Sales Trend */}
      <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900">Weekly Sales Performance</h2>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#8b5cf6" 
                strokeWidth={3} 
                dot={{r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff'}}
                activeDot={{r: 6}}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Top Products & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Top Selling Products */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-orange-50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Award className="text-orange-500" size={20} />
              Top Selling Products
            </h2>
            <button className="text-sm font-bold text-orange-500 hover:text-orange-600">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-orange-50/50 text-xs uppercase tracking-wider text-gray-500 font-bold">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-center">Sold</th>
                  <th className="px-6 py-4">Revenue</th>
                  <th className="px-6 py-4 text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-50">
                {topProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-orange-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden shadow-sm border border-gray-200">
                          {product.image?.startsWith('http') || product.image?.startsWith('data') ? (
                            <img src={product.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xl">{product.image || '📦'}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{product.price}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-xs font-bold border border-blue-100">
                        {product.sold}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{product.revenue}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-green-600 text-xs font-bold flex items-center justify-end gap-1">
                        <TrendingUp size={12} />
                        {product.trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category & Payment Distribution */}
        <div className="flex flex-col gap-6">
          {/* Sales by Category */}
          <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm flex flex-col">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900">Sales by Category</h2>
            </div>
            <div className="flex-1 flex items-center justify-center min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm flex flex-col">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900">Payment Methods</h2>
            </div>
            <div className="flex-1 flex items-center justify-center min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {paymentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;