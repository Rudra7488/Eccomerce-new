import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  Ticket, 
  Plus, 
  Calendar, 
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Edit,
  Percent,
  DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';

const CouponManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [coupons, setCoupons] = useState([
    {
      id: 1,
      code: 'WELCOME20',
      type: 'percentage',
      value: 20,
      minPurchase: 500,
      expiryDate: '2025-12-31',
      status: 'active',
      usageCount: 154,
      limit: 1000
    },
    {
      id: 2,
      code: 'SUMMER500',
      type: 'fixed',
      value: 500,
      minPurchase: 2000,
      expiryDate: '2025-06-30',
      status: 'active',
      usageCount: 45,
      limit: 500
    },
    {
      id: 3,
      code: 'FLASH50',
      type: 'percentage',
      value: 50,
      minPurchase: 1000,
      expiryDate: '2024-12-31',
      status: 'expired',
      usageCount: 1000,
      limit: 1000
    },
    {
      id: 4,
      code: 'FREESHIP',
      type: 'shipping',
      value: 0,
      minPurchase: 800,
      expiryDate: '2025-03-15',
      status: 'active',
      usageCount: 89,
      limit: 200
    }
  ]);

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minPurchase: '',
    expiryDate: '',
    limit: ''
  });

  const handleAddCoupon = (e) => {
    e.preventDefault();
    const coupon = {
      id: coupons.length + 1,
      ...newCoupon,
      status: 'active',
      usageCount: 0
    };
    setCoupons([coupon, ...coupons]);
    setShowAddModal(false);
    setNewCoupon({
      code: '',
      type: 'percentage',
      value: '',
      minPurchase: '',
      expiryDate: '',
      limit: ''
    });
    toast.success('Coupon created successfully!');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      setCoupons(coupons.filter(c => c.id !== id));
      toast.success('Coupon deleted successfully');
    }
  };

  const filteredCoupons = coupons.filter(coupon => 
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'expired': return 'bg-red-100 text-red-700 border-red-200';
      case 'disabled': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Coupon Management</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <Ticket size={16} />
            Manage discount codes and promotions
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-2.5 bg-white border border-gray-200 rounded-xl w-64 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30"
          >
            <Plus size={20} />
            Add Coupon
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Ticket size={24} />
            </div>
            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-lg">Total</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{coupons.length}</h3>
          <p className="text-gray-500 text-sm mt-1">Active Coupons</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <CheckCircle size={24} />
            </div>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg">Active</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">
            {coupons.filter(c => c.status === 'active').length}
          </h3>
          <p className="text-gray-500 text-sm mt-1">Currently Running</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
              <Clock size={24} />
            </div>
            <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded-lg">Expired</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">
            {coupons.filter(c => c.status === 'expired').length}
          </h3>
          <p className="text-gray-500 text-sm mt-1">Past Promotions</p>
        </div>
      </div>

      {/* Coupons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCoupons.map((coupon) => (
          <div key={coupon.id} className="bg-white rounded-3xl border border-orange-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            {/* Status Badge */}
            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(coupon.status)}`}>
              {coupon.status.toUpperCase()}
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center border-2 border-orange-100 border-dashed text-orange-500">
                  {coupon.type === 'percentage' ? <Percent size={24} /> : <DollarSign size={24} />}
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">{coupon.code}</h3>
                  <p className="text-sm font-medium text-gray-500">
                    {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Min. Purchase</span>
                  <span className="font-bold text-gray-900">₹{coupon.minPurchase}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Usage Limit</span>
                  <span className="font-bold text-gray-900">{coupon.usageCount} / {coupon.limit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Expires On</span>
                  <span className="font-bold text-gray-900 flex items-center gap-1">
                    <Calendar size={14} className="text-gray-400" />
                    {coupon.expiryDate}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 flex gap-3">
                <button className="flex-1 py-2.5 bg-gray-50 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                  <Edit size={16} />
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(coupon.id)}
                  className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            
            {/* Usage Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100">
              <div 
                className="h-full bg-orange-500 transition-all duration-500"
                style={{ width: `${(coupon.usageCount / coupon.limit) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add Coupon Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl transform transition-all animate-fadeIn">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Create New Coupon</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <XCircle size={24} />
              </button>
            </div>

            <form onSubmit={handleAddCoupon} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Coupon Code</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. SUMMER2024"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none uppercase font-bold tracking-wider"
                  value={newCoupon.code}
                  onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Discount Type</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                    value={newCoupon.type}
                    onChange={e => setNewCoupon({...newCoupon, type: e.target.value})}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Value</label>
                  <input 
                    type="number" 
                    required
                    placeholder="20"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                    value={newCoupon.value}
                    onChange={e => setNewCoupon({...newCoupon, value: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Min. Purchase (₹)</label>
                  <input 
                    type="number" 
                    required
                    placeholder="500"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                    value={newCoupon.minPurchase}
                    onChange={e => setNewCoupon({...newCoupon, minPurchase: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Usage Limit</label>
                  <input 
                    type="number" 
                    required
                    placeholder="100"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                    value={newCoupon.limit}
                    onChange={e => setNewCoupon({...newCoupon, limit: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Expiry Date</label>
                <input 
                  type="date" 
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                  value={newCoupon.expiryDate}
                  onChange={e => setNewCoupon({...newCoupon, expiryDate: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Create Coupon
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default CouponManagement;