import React, { useState, useEffect } from 'react';
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
  Edit2,
  Percent,
  DollarSign,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const CouponManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState([]);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minPurchase: '',
    startDate: '',
    endDate: '',
    limit: ''
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/coupons/admin/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCoupons(data);
      } else {
        const errorMsg = await response.text();
        console.error('Fetch coupons failed:', response.status, errorMsg);
        toast.error(`Failed to fetch coupons: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/coupons/admin/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: newCoupon.code,
          discount_type: newCoupon.type,
          value: parseFloat(newCoupon.value),
          min_purchase: parseFloat(newCoupon.minPurchase || 0),
          start_date: newCoupon.startDate,
          end_date: newCoupon.endDate,
          limit: parseInt(newCoupon.limit || 0)
        }),
      });

      if (response.ok) {
        toast.success('Coupon created successfully');
        setShowAddModal(false);
        setNewCoupon({
          code: '',
          type: 'percentage',
          value: '',
          minPurchase: '',
          startDate: '',
          endDate: '',
          limit: ''
        });
        fetchCoupons();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to create coupon');
      }
    } catch (error) {
      console.error('Error adding coupon:', error);
      toast.error('Error connecting to server');
    }
  };

  const handleEditClick = (coupon) => {
    setEditingCoupon({
      ...coupon,
      startDate: new Date(coupon.start_date).toISOString().split('T')[0],
      endDate: new Date(coupon.end_date).toISOString().split('T')[0]
    });
    setShowEditModal(true);
  };

  const handleUpdateCoupon = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/coupons/admin/${editingCoupon.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: editingCoupon.code,
          discount_type: editingCoupon.discount_type,
          value: parseFloat(editingCoupon.value),
          min_purchase: parseFloat(editingCoupon.min_purchase || 0),
          start_date: editingCoupon.startDate,
          end_date: editingCoupon.endDate,
          limit: parseInt(editingCoupon.limit || 0),
          is_active: editingCoupon.is_active
        }),
      });

      if (response.ok) {
        toast.success('Coupon updated successfully');
        setShowEditModal(false);
        setEditingCoupon(null);
        fetchCoupons();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update coupon');
      }
    } catch (error) {
      console.error('Error updating coupon:', error);
      toast.error('Error connecting to server');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/coupons/admin/${id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          toast.success('Coupon deleted successfully');
          fetchCoupons();
        } else {
          toast.error('Failed to delete coupon');
        }
      } catch (error) {
        console.error('Error deleting coupon:', error);
        toast.error('Error connecting to server');
      }
    }
  };

  const filteredCoupons = coupons.filter(coupon => 
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'expired': return 'bg-red-100 text-red-700 border-red-200';
      case 'upcoming': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'disabled': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'limit_reached': return 'bg-amber-100 text-amber-700 border-amber-200';
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Ticket size={24} />
            </div>
            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-lg">Total</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{coupons.length}</h3>
          <p className="text-gray-500 text-sm mt-1">All Coupons</p>
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
             <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
               <Calendar size={24} />
             </div>
             <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded-lg">Upcoming</span>
           </div>
           <h3 className="text-3xl font-bold text-gray-900">
             {coupons.filter(c => c.status === 'upcoming').length}
           </h3>
           <p className="text-gray-500 text-sm mt-1">Scheduled</p>
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
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Loading coupons...</p>
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <Ticket className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900">No Coupons Found</h3>
          <p className="text-gray-500 mt-2">Create your first discount code to get started</p>
        </div>
      ) : (
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
                    {coupon.discount_type === 'percentage' ? <Percent size={24} /> : <DollarSign size={24} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">{coupon.code}</h3>
                    <p className="text-sm font-medium text-gray-500">
                      {coupon.discount_type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Min. Purchase</span>
                    <span className="font-bold text-gray-900">₹{coupon.min_purchase}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Usage Limit</span>
                    <span className="font-bold text-gray-900">{coupon.usage_count} / {coupon.limit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Duration</span>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-xs">{new Date(coupon.start_date).toLocaleDateString()}</p>
                      <p className="text-gray-400 text-[10px] uppercase font-bold">to</p>
                      <p className="font-bold text-gray-900 text-xs">{new Date(coupon.end_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 flex gap-3">
                  <button 
                    onClick={() => handleEditClick(coupon)}
                    className="flex-1 py-2.5 bg-gray-50 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit2 size={16} />
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
                  style={{ width: `${coupon.limit > 0 ? (coupon.usage_count / coupon.limit) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Coupon Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
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

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
                  <input 
                    type="date" 
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                    value={newCoupon.startDate}
                    onChange={e => setNewCoupon({...newCoupon, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">End Date</label>
                  <input 
                    type="date" 
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                    value={newCoupon.endDate}
                    onChange={e => setNewCoupon({...newCoupon, endDate: e.target.value})}
                  />
                </div>
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
      {/* Edit Coupon Modal */}
      {showEditModal && editingCoupon && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl transform transition-all animate-fadeIn">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Edit Coupon</h2>
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setEditingCoupon(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <XCircle size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateCoupon} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Coupon Code</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. SUMMER2024"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none uppercase font-bold tracking-wider"
                  value={editingCoupon.code}
                  onChange={e => setEditingCoupon({...editingCoupon, code: e.target.value.toUpperCase()})}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Discount Type</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                    value={editingCoupon.discount_type}
                    onChange={e => setEditingCoupon({...editingCoupon, discount_type: e.target.value})}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                    <option value="shipping">Free Shipping</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Value</label>
                  <input 
                    type="number" 
                    required
                    placeholder="20"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                    value={editingCoupon.value}
                    onChange={e => setEditingCoupon({...editingCoupon, value: e.target.value})}
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
                    value={editingCoupon.min_purchase}
                    onChange={e => setEditingCoupon({...editingCoupon, min_purchase: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Usage Limit</label>
                  <input 
                    type="number" 
                    required
                    placeholder="100"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                    value={editingCoupon.limit}
                    onChange={e => setEditingCoupon({...editingCoupon, limit: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
                  <input 
                    type="date" 
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                    value={editingCoupon.startDate}
                    onChange={e => setEditingCoupon({...editingCoupon, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">End Date</label>
                  <input 
                    type="date" 
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                    value={editingCoupon.endDate}
                    onChange={e => setEditingCoupon({...editingCoupon, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="edit-is-active"
                  className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  checked={editingCoupon.is_active}
                  onChange={e => setEditingCoupon({...editingCoupon, is_active: e.target.checked})}
                />
                <label htmlFor="edit-is-active" className="text-sm font-bold text-gray-700">Coupon is Active</label>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
              >
                <Edit2 size={20} />
                Update Coupon
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default CouponManagement;