import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { User, Bell, Lock, PaintBucket, Save, Globe, Moon, Sun } from 'lucide-react';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    updates: true,
    marketing: false
  });
  const [theme, setTheme] = useState('light');

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'appearance', label: 'Appearance', icon: PaintBucket },
  ];

  return (
    <AdminLayout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account preferences and system settings.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-3xl border border-orange-100 shadow-sm p-4 sticky top-24">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                    activeTab === tab.id
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl border border-orange-100 shadow-sm p-8 min-h-[500px]">
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="flex items-center gap-6 pb-8 border-b border-orange-50">
                  <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 text-3xl font-bold border-4 border-white shadow-lg shadow-orange-100">
                    A
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Admin User</h3>
                    <p className="text-gray-500 mb-3">Super Administrator</p>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                      Change Avatar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input 
                      type="text" 
                      defaultValue="Admin" 
                      className="w-full px-4 py-2.5 bg-[#FFFBF2] border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input 
                      type="text" 
                      defaultValue="User" 
                      className="w-full px-4 py-2.5 bg-[#FFFBF2] border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue="admin@velora.com" 
                      className="w-full px-4 py-2.5 bg-[#FFFBF2] border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea 
                      rows="4"
                      defaultValue="Super admin managing the Velora ecommerce platform." 
                      className="w-full px-4 py-2.5 bg-[#FFFBF2] border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition resize-none"
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition shadow-lg shadow-orange-500/20">
                    <Save size={18} />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h3>
                
                <div className="space-y-4">
                  {[
                    { id: 'email', label: 'Email Notifications', desc: 'Receive daily summaries and critical alerts via email.' },
                    { id: 'push', label: 'Push Notifications', desc: 'Get real-time updates on your desktop or mobile device.' },
                    { id: 'updates', label: 'System Updates', desc: 'Notify me about new features and system maintenance.' },
                    { id: 'marketing', label: 'Marketing Emails', desc: 'Receive offers, promotions, and news about Velora.' }
                  ].map((item) => (
                    <div key={item.id} className="flex items-start justify-between p-4 bg-[#FFFBF2] rounded-xl border border-orange-50">
                      <div>
                        <h4 className="font-bold text-gray-900">{item.label}</h4>
                        <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                      </div>
                      <button 
                        onClick={() => setNotifications(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                        className={`w-12 h-6 rounded-full transition-colors relative ${notifications[item.id] ? 'bg-orange-500' : 'bg-gray-200'}`}
                      >
                        <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${notifications[item.id] ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h3>
                
                <div className="p-6 bg-[#FFFBF2] rounded-2xl border border-orange-100 mb-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-orange-500 shadow-sm">
                      <Lock size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Change Password</h4>
                      <p className="text-sm text-gray-500">Ensure your account is secure with a strong password.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <input 
                      type="password" 
                      placeholder="Current Password"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition"
                    />
                    <input 
                      type="password" 
                      placeholder="New Password"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition"
                    />
                    <input 
                      type="password" 
                      placeholder="Confirm New Password"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition"
                    />
                    <button className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition mt-2">
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Globe size={20} className="text-gray-400" />
                    <div>
                      <h4 className="font-medium text-gray-900">Active Sessions</h4>
                      <p className="text-xs text-gray-500">Windows PC • Chrome • Indianapolis, US</p>
                    </div>
                  </div>
                  <button className="text-red-500 text-sm font-bold hover:underline">Sign out</button>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Appearance</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`p-4 rounded-2xl border-2 text-left transition ${
                      theme === 'light' 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="w-full h-24 bg-[#FFFBF2] rounded-lg mb-3 border border-orange-100 flex items-center justify-center">
                      <Sun size={32} className="text-orange-500" />
                    </div>
                    <h4 className="font-bold text-gray-900">Warm Light</h4>
                    <p className="text-sm text-gray-500">Cozy, warm aesthetic.</p>
                  </button>

                  <button 
                    onClick={() => setTheme('dark')}
                    className={`p-4 rounded-2xl border-2 text-left transition ${
                      theme === 'dark' 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="w-full h-24 bg-gray-900 rounded-lg mb-3 border border-gray-800 flex items-center justify-center">
                      <Moon size={32} className="text-indigo-400" />
                    </div>
                    <h4 className="font-bold text-gray-900">Dark Mode</h4>
                    <p className="text-sm text-gray-500">Easy on the eyes.</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;