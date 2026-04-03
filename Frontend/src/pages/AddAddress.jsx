import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Loader2, Save, Trash2, Home, Briefcase, Plus, User, Phone, Map, Building } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

const AddAddress = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'India',
    phone: '',
    is_default: true // As requested, automatically set as default
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Please login to add an address');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/addresses/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(addressForm)
      });

      if (response.ok) {
        toast.success('Address added and set as default');
        navigate('/checkout'); // Redirect back to checkout
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to add address');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-12 max-w-2xl">
        <button
          onClick={() => navigate('/checkout')}
          className="flex items-center gap-2 text-gray-400 hover:text-[#003d29] mb-10 transition-all font-black uppercase tracking-widest text-xs group"
        >
          <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-[#e6f1f0]">
            <ChevronLeft size={16} />
          </div>
          Back to Checkout
        </button>

        <div className="bg-white rounded-[48px] p-8 md:p-12 shadow-2xl shadow-green-900/5 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#e6f1f0] rounded-full -mr-20 -mt-20 opacity-50"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-16 h-16 bg-[#003d29] text-white rounded-3xl flex items-center justify-center shadow-xl shadow-green-900/20">
                <MapPin size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Add New Address</h2>
                <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1 opacity-60">This will be your default shipping address</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Street Address</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Home size={18} />
                  </div>
                  <input
                    required
                    type="text"
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-3xl focus:ring-4 focus:ring-[#003d29]/10 focus:bg-white outline-none transition-all font-bold text-gray-800"
                    placeholder="House No., Building, Street Name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">City</label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                      <Building size={18} />
                    </div>
                    <input
                      required
                      type="text"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-3xl focus:ring-4 focus:ring-[#003d29]/10 focus:bg-white outline-none transition-all font-bold text-gray-800"
                      placeholder="City Name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">State</label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                      <Map size={18} />
                    </div>
                    <input
                      required
                      type="text"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-3xl focus:ring-4 focus:ring-[#003d29]/10 focus:bg-white outline-none transition-all font-bold text-gray-800"
                      placeholder="State"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Zip Code</label>
                  <input
                    required
                    type="text"
                    value={addressForm.zip_code}
                    onChange={(e) => setAddressForm({ ...addressForm, zip_code: e.target.value })}
                    className="w-full px-6 py-5 bg-gray-50 border-none rounded-3xl focus:ring-4 focus:ring-[#003d29]/10 focus:bg-white outline-none transition-all font-bold text-gray-800"
                    placeholder="XXXXXX"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Contact Number</label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">
                      +91
                    </div>
                    <input
                      required
                      type="tel"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-3xl focus:ring-4 focus:ring-[#003d29]/10 focus:bg-white outline-none transition-all font-bold text-gray-800"
                      placeholder="XXXXX XXXXX"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-6 mt-8 bg-[#003d29] text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-green-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:bg-gray-200 disabled:shadow-none"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Save size={20} />
                    Save & Continue
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddAddress;
