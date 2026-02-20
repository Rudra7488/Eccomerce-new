import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Mail, 
  Calendar, 
  User as UserIcon,
  ChevronRight,
  ArrowLeft,
  Shield,
  UserCheck,
  MoreVertical,
  Eye,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const CustomerManagement = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, customerId: null });

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchCustomers = async () => {
    setLoading(true);
    const loadingToast = toast.loading('Fetching customers...');
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vendor-admin/customers-list/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setCustomers(data);
        toast.success('Customers loaded successfully', { id: loadingToast });
      } else {
        toast.error(data.error || 'Failed to fetch customers', { id: loadingToast });
      }
    } catch (error) {
      toast.error('Network error occurred', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDeleteCustomer = (customerId) => {
    setDeleteModal({ show: true, customerId });
  };

  const confirmDelete = async () => {
    if (deleteModal.customerId) {
      await executeDelete(deleteModal.customerId);
      setDeleteModal({ show: false, customerId: null });
    }
  };

  const executeDelete = async (customerId) => {
    const loadingToast = toast.loading('Deleting customer...');
    try {
      const token = localStorage.getItem('accessToken');
      // Try the most likely endpoint pattern based on products
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vendor-admin/customers/${customerId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setCustomers(prev => prev.filter(c => c.id !== customerId));
        toast.success('Customer deleted successfully', { id: loadingToast });
      } else {
        // If the first pattern fails, try a fallback or just handle error
        const data = await response.json().catch(() => ({}));
        toast.error(data.error || 'Failed to delete customer', { id: loadingToast });
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Network error occurred', { id: loadingToast });
    }
  };

  const filteredCustomers = customers.filter(customer => 
    customer.full_name.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
    customer.email.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#F9FAFB] tracking-tight">Customer Management</h1>
            <p className="text-gray-400 mt-1 flex items-center gap-2">
              <Users size={16} />
              Manage and view all registered users
            </p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3.5 bg-[#111827] text-[#F9FAFB] border border-gray-800 rounded-2xl w-full md:w-[400px] focus:ring-4 focus:ring-indigo-500/20 focus:border-[#6366F1] transition-all outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#111827] p-6 rounded-3xl border border-gray-800 shadow-sm">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl">
                <Users size={24} />
              </div>
              <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">Total Customers</p>
            </div>
            <h3 className="text-3xl font-black text-[#F9FAFB]">{customers.length}</h3>
          </div>
          
          <div className="bg-[#111827] p-6 rounded-3xl border border-gray-800 shadow-sm">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
                <UserCheck size={24} />
              </div>
              <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">New This Month</p>
            </div>
            <h3 className="text-3xl font-black text-[#F9FAFB]">
              {customers.filter(c => new Date(c.created_at).getMonth() === new Date().getMonth()).length}
            </h3>
          </div>

          <div className="bg-[#111827] p-6 rounded-3xl border border-gray-800 shadow-sm">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-orange-500/10 text-orange-400 rounded-2xl">
                <Shield size={24} />
              </div>
              <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">Active Status</p>
            </div>
            <h3 className="text-3xl font-black text-[#F9FAFB]">100%</h3>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-[#111827] rounded-[2.5rem] border border-gray-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0F172A] border-b border-gray-800">
                  <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer</th>
                  <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Contact Information</th>
                  <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Registration Date</th>
                  <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Role</th>
                  <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  [1, 2, 3].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="5" className="px-8 py-6 h-20 bg-white/5"></td>
                    </tr>
                  ))
                ) : filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#6366F1] text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/20">
                            {customer.full_name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-[#F9FAFB]">{customer.full_name}</span>
                            <span className="text-xs text-gray-400">ID: {customer.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Mail size={14} className="text-gray-500" />
                            {customer.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                          <Calendar size={14} className="text-gray-500" />
                          {new Date(customer.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest">
                          <Shield size={12} />
                          {customer.role}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-3 bg-white/5 text-gray-400 hover:bg-[#6366F1] hover:text-white rounded-2xl transition-all shadow-sm">
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="p-3 bg-white/5 text-gray-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm group"
                            title="Delete Customer"
                          >
                            <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <div className="p-6 bg-[#0F172A] rounded-full mb-4">
                          <Users size={40} className="text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-[#F9FAFB]">No customers found</h3>
                        <p className="text-gray-400">Try adjusting your search term</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-[#111827] border border-gray-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="p-4 bg-red-500/10 text-red-500 rounded-full ring-4 ring-red-500/5">
                <Trash2 size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#F9FAFB]">Delete Customer?</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Are you sure you want to delete this customer? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setDeleteModal({ show: false, customerId: null })}
                  className="flex-1 py-3 px-4 bg-gray-800 text-gray-300 rounded-xl font-bold hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default CustomerManagement;
