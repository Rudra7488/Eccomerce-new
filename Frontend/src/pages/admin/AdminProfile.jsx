import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, CheckCircle, ChevronLeft, Camera } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminProfile = () => {
  const navigate = useNavigate();
  
  // Mock Admin Data
  const [adminData, setAdminData] = useState({
    name: 'Admin User',
    email: 'admin@velora.com',
    role: 'Super Admin'
  });

  const [formData, setFormData] = useState({
    fullName: adminData.name,
    email: adminData.email,
    newPassword: '',
    confirmPassword: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleUpdate = (e) => {
    e.preventDefault();
    setAdminData(prev => ({
      ...prev,
      name: formData.fullName,
      email: formData.email
    }));
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-[#F9FAFB]">Admin Profile</h1>
          <p className="text-gray-400 mt-1">Update your account information and security settings.</p>
        </header>

        {showSuccess && (
          <div className="mb-8 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-6 py-4 rounded-3xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <CheckCircle size={20} />
            <span className="font-bold">Profile updated successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-[#111827] rounded-[2.5rem] shadow-sm border border-gray-800 p-8 text-center sticky top-28">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 bg-[#6366F1] rounded-[2rem] flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-indigo-500/30">
                  {adminData.name.charAt(0)}
                </div>
                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#F59E0B] text-white rounded-xl flex items-center justify-center border-4 border-[#111827] hover:bg-orange-500 transition shadow-lg">
                  <Camera size={18} />
                </button>
              </div>
              <h2 className="text-2xl font-bold text-[#F9FAFB]">{adminData.name}</h2>
              <p className="text-gray-400 text-sm mt-1">{adminData.email}</p>
              <span className="mt-4 inline-block px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full uppercase tracking-widest border border-emerald-500/20">
                {adminData.role}
              </span>

              <div className="mt-8 pt-8 border-t border-gray-800 text-left space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Account Status</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Last Login</span>
                  <span className="font-bold text-[#F9FAFB]">2 hours ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-2">
            <div className="bg-[#111827] rounded-[2.5rem] shadow-sm border border-gray-800 p-8 md:p-10">
              <form onSubmit={handleUpdate} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                        <User size={18} />
                      </div>
                      <input 
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        className="w-full pl-11 pr-4 py-4 bg-[#0F172A] border border-gray-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-[#6366F1] transition-all font-medium text-[#F9FAFB]"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                        <Mail size={18} />
                      </div>
                      <input 
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-11 pr-4 py-4 bg-[#0F172A] border border-gray-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-[#6366F1] transition-all font-medium text-[#F9FAFB]"
                        placeholder="admin@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-800">
                  <h3 className="text-lg font-bold text-[#F9FAFB] mb-6">Security Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                          <Lock size={18} />
                        </div>
                        <input 
                          type="password"
                          className="w-full pl-11 pr-4 py-4 bg-[#0F172A] border border-gray-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-[#6366F1] transition-all font-medium text-[#F9FAFB]"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                          <Lock size={18} />
                        </div>
                        <input 
                          type="password"
                          className="w-full pl-11 pr-4 py-4 bg-[#0F172A] border border-gray-800 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-[#6366F1] transition-all font-medium text-[#F9FAFB]"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full md:w-auto px-10 py-4 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98] hover:-translate-y-0.5"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
    );
  };

export default AdminProfile;
