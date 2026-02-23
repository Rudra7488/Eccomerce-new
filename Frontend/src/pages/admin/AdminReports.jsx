import React from 'react';
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
  Banknote
} from 'lucide-react';

const AdminReports = () => {
  // Mock Data
  const revenueData = [
    { name: 'Jan', revenue: 4000, orders: 240, online: 180, offline: 60 },
    { name: 'Feb', revenue: 3000, orders: 139, online: 100, offline: 39 },
    { name: 'Mar', revenue: 2000, orders: 980, online: 700, offline: 280 },
    { name: 'Apr', revenue: 2780, orders: 390, online: 290, offline: 100 },
    { name: 'May', revenue: 1890, orders: 480, online: 380, offline: 100 },
    { name: 'Jun', revenue: 2390, orders: 380, online: 280, offline: 100 },
    { name: 'Jul', revenue: 3490, orders: 430, online: 330, offline: 100 },
    { name: 'Aug', revenue: 4200, orders: 520, online: 420, offline: 100 },
    { name: 'Sep', revenue: 3800, orders: 460, online: 360, offline: 100 },
    { name: 'Oct', revenue: 5100, orders: 610, online: 510, offline: 100 },
    { name: 'Nov', revenue: 4800, orders: 580, online: 480, offline: 100 },
    { name: 'Dec', revenue: 6200, orders: 740, online: 640, offline: 100 },
  ];

  const dailyData = [
    { day: 'Mon', sales: 1200 },
    { day: 'Tue', sales: 1500 },
    { day: 'Wed', sales: 1800 },
    { day: 'Thu', sales: 1300 },
    { day: 'Fri', sales: 2100 },
    { day: 'Sat', sales: 2400 },
    { day: 'Sun', sales: 1900 },
  ];

  const paymentData = [
    { name: 'Online (Prepaid)', value: 854 },
    { name: 'Offline (COD)', value: 380 },
  ];

  const topProducts = [
    { id: 1, name: 'Premium Leather Jacket', category: 'Fashion', price: '₹4,500', sold: 124, revenue: '₹5,58,000', trend: '+12%', image: '🧥' },
    { id: 2, name: 'Wireless Headphones', category: 'Electronics', price: '₹2,999', sold: 98, revenue: '₹2,93,902', trend: '+8%', image: '🎧' },
    { id: 3, name: 'Smart Watch Series 5', category: 'Electronics', price: '₹5,499', sold: 85, revenue: '₹4,67,415', trend: '+15%', image: '⌚' },
    { id: 4, name: 'Running Shoes', category: 'Sports', price: '₹1,899', sold: 76, revenue: '₹1,44,324', trend: '+5%', image: '👟' },
    { id: 5, name: 'Cotton T-Shirt', category: 'Fashion', price: '₹499', sold: 245, revenue: '₹1,22,255', trend: '+22%', image: '👕' },
  ];

  const categoryData = [
    { name: 'Electronics', value: 400 },
    { name: 'Fashion', value: 300 },
    { name: 'Home', value: 300 },
    { name: 'Sports', value: 200 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const PAYMENT_COLORS = ['#8b5cf6', '#f97316'];

  const stats = [
    {
      title: 'Total Revenue',
      value: '₹12,45,000',
      change: '+12.5%',
      isUp: true,
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Online Orders (Prepaid)',
      value: '854',
      change: '+15.3%',
      isUp: true,
      icon: CreditCard,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      title: 'Offline Orders (COD)',
      value: '380',
      change: '-5.2%',
      isUp: false,
      icon: Banknote,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+8.2%',
      isUp: true,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    }
  ];

  return (
    <AdminLayout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-500 mt-1">Detailed analysis of your store's performance.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                <stat.icon size={24} />
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
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Revenue Analytics</h2>
            <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-sm outline-none focus:border-orange-500">
              <option>This Year</option>
              <option>Last Year</option>
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
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl shadow-sm border border-gray-200">
                          {product.image}
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