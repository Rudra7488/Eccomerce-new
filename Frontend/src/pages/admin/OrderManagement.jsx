import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Truck, 
  Clock, 
  Filter,
  ArrowLeft,
  ChevronRight,
  Calendar,
  User,
  CreditCard,
  MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';

const OrderManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Mock Orders Data
  const orders = [
    {
      id: 'ORD-2026-001',
      customer: 'Rahul Kumar',
      email: 'rahul@example.com',
      date: '2026-02-12',
      amount: 4500,
      status: 'confirmed',
      items: 3,
      payment: 'UPI',
      address: 'Sector 62, Noida, UP'
    },
    {
      id: 'ORD-2026-002',
      customer: 'Priya Singh',
      email: 'priya@example.com',
      date: '2026-02-11',
      amount: 12500,
      status: 'delivered',
      items: 5,
      payment: 'COD',
      address: 'Andheri West, Mumbai, MH'
    },
    {
      id: 'ORD-2026-003',
      customer: 'Amit Patel',
      email: 'amit@example.com',
      date: '2026-02-10',
      amount: 2100,
      status: 'cancelled',
      items: 1,
      payment: 'Card',
      address: 'Navrangpura, Ahmedabad, GJ'
    },
    {
      id: 'ORD-2026-004',
      customer: 'Suresh Raina',
      email: 'suresh@example.com',
      date: '2026-02-09',
      amount: 8900,
      status: 'confirmed',
      items: 2,
      payment: 'UPI',
      address: 'Civil Lines, Kanpur, UP'
    },
    {
      id: 'ORD-2026-005',
      customer: 'Anjali Gupta',
      email: 'anjali@example.com',
      date: '2026-02-08',
      amount: 5600,
      status: 'delivered',
      items: 2,
      payment: 'COD',
      address: 'Salt Lake, Kolkata, WB'
    }
  ];

  const tabs = [
    { id: 'all', label: 'All Orders', icon: ShoppingBag, color: 'text-slate-600', bg: 'bg-slate-50' },
    { id: 'confirmed', label: 'Confirmed', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'delivered', label: 'Delivered', icon: Truck, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'delivered': return 'bg-green-50 text-green-600 border-green-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle size={14} />;
      case 'delivered': return <Truck size={14} />;
      case 'cancelled': return <XCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div>
              <h1 className="text-3xl font-extrabold text-[#090b0b] tracking-tight">Order Management</h1>
              <p className="text-slate-500 mt-1 flex items-center gap-2">
                <ShoppingBag size={16} />
                Manage and track all customer orders
              </p>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Search by Order ID or Customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-[2rem] w-full md:w-[400px] focus:ring-4 focus:ring-[#00a76f]/10 focus:border-[#00a76f] transition-all outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Tabs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-4 rounded-3xl flex flex-col items-center gap-3 transition-all border-2 ${
                  isActive 
                    ? `border-[#00a76f] ${tab.bg} shadow-md scale-[1.02]` 
                    : 'border-white bg-white hover:border-slate-100 shadow-sm'
                }`}
              >
                <div className={`p-3 rounded-2xl ${tab.bg} ${tab.color}`}>
                  <tab.icon size={24} />
                </div>
                <span className={`font-bold text-sm ${isActive ? 'text-[#003d29]' : 'text-slate-500'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Orders Table/List */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Order Details</th>
                  <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer</th>
                  <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                  <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#003d29] mb-1">{order.id}</span>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Calendar size={12} />
                          {order.date}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{order.customer}</span>
                        <span className="text-xs text-slate-400">{order.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-800">₹{order.amount.toLocaleString()}</span>
                        <span className="text-xs text-slate-400">{order.items} items • {order.payment}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusStyle(order.status)} uppercase tracking-wider`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderDetails(true);
                          }}
                          className="p-3 bg-slate-100 text-slate-600 hover:bg-[#003d29] hover:text-white rounded-2xl transition-all shadow-sm group"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <div className="p-6 bg-slate-50 rounded-full mb-4">
                          <ShoppingBag size={40} className="text-slate-200" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">No orders found</h3>
                        <p className="text-slate-400">Try adjusting your filters or search term</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-[#003d29]/40 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-2xl font-black text-[#003d29]">Order Details</h2>
                <p className="text-slate-500 text-sm">Full information for {selectedOrder.id}</p>
              </div>
              <button 
                onClick={() => setShowOrderDetails(false)}
                className="p-3 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
              {/* Status Header */}
              <div className={`p-6 rounded-[2rem] border flex items-center justify-between ${getStatusStyle(selectedOrder.status)}`}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/50 rounded-2xl">
                    {getStatusIcon(selectedOrder.status)}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Current Status</p>
                    <p className="text-xl font-black uppercase">{selectedOrder.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Order Date</p>
                  <p className="font-bold">{selectedOrder.date}</p>
                </div>
              </div>

              {/* Customer & Payment Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <div className="flex items-center gap-3 mb-4 text-[#003d29]">
                    <User size={20} />
                    <h3 className="font-black uppercase text-xs tracking-widest">Customer Information</h3>
                  </div>
                  <div className="space-y-3">
                    <p className="font-bold text-slate-800">{selectedOrder.customer}</p>
                    <p className="text-sm text-slate-500">{selectedOrder.email}</p>
                    <div className="flex items-start gap-2 text-sm text-slate-500">
                      <MapPin size={16} className="shrink-0 mt-0.5" />
                      <span>{selectedOrder.address}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <div className="flex items-center gap-3 mb-4 text-[#003d29]">
                    <CreditCard size={20} />
                    <h3 className="font-black uppercase text-xs tracking-widest">Payment Information</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">Method</span>
                      <span className="font-bold text-slate-800">{selectedOrder.payment}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">Items Count</span>
                      <span className="font-bold text-slate-800">{selectedOrder.items}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                      <span className="font-bold text-[#003d29]">Total Amount</span>
                      <span className="text-xl font-black text-[#003d29]">₹{selectedOrder.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="p-6 bg-[#003d29]/5 rounded-[2rem] border border-[#003d29]/10">
                <h3 className="font-black uppercase text-xs tracking-widest text-[#003d29] mb-4">Update Status</h3>
                <div className="flex flex-wrap gap-3">
                  {['confirmed', 'delivered', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all border-2 ${
                        selectedOrder.status === status
                          ? 'bg-[#003d29] text-white border-[#003d29]'
                          : 'bg-white text-slate-600 border-slate-100 hover:border-[#003d29]/30'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-8 py-6 border-t border-slate-100 flex justify-end bg-slate-50/50">
              <button 
                onClick={() => setShowOrderDetails(false)}
                className="px-8 py-3.5 bg-[#003d29] text-white rounded-2xl font-bold hover:bg-[#002a1c] transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}} />
    </AdminLayout>
  );
};

export default OrderManagement;
