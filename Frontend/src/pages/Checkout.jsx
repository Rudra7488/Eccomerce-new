import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useBlocker } from 'react-router-dom';
import { ChevronLeft, MapPin, CreditCard, ShoppingBag, Loader2, CheckCircle, Home, Briefcase, Plus, Info, Edit2, ChevronDown, Wallet } from 'lucide-react';
import { clearCart } from '../store/slices/cartSlice';
import { translations } from '../translations';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Checkout = () => {
  const cart = useSelector((state) => state.cart);
  const currentLang = useSelector((state) => state.language.currentLanguage);
  const t = translations[currentLang];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('data:')) return imagePath;
    
    const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
    if (imagePath.startsWith('/')) return `${baseUrl}${imagePath}`;
    
    // If it looks like base64 but doesn't have the prefix
    if (imagePath.length > 100) return `data:image/jpeg;base64,${imagePath}`;
    return imagePath;
  };

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });

  const [isPlacing, setIsPlacing] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [showAddresses, setShowAddresses] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip_code: '',
    phone: '',
    country: 'India',
    is_default: false
  });
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      !showSuccessModal && cart.items.length > 0 && currentLocation.pathname !== nextLocation.pathname
  );

  const fetchAddresses = async () => {
    try {
      setAddressLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/addresses/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
        const defaultAddr = data.find(a => a.is_default) || data[0];
        if (defaultAddr) selectAddress(defaultAddr);
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    } finally {
      setAddressLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const selectAddress = (addr) => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    setFormData({
      fullName: user.full_name || '',
      email: user.email || '',
      address: addr.street,
      city: addr.city,
      state: addr.state,
      zipCode: addr.zip_code,
      phone: addr.phone || user.phone || ''
    });
    setShowAddresses(false);
    toast.success('Address applied');
  };

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    setIsSavingAddress(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/addresses/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newAddress)
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Address saved successfully!');
        setShowAddAddressModal(false);
        setNewAddress({ street: '', city: '', state: '', zip_code: '', phone: '', country: 'India', is_default: false });
        await fetchAddresses();
        
        // The backend returns the single new address object
        if (data && data.street) {
          selectAddress(data);
        }
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save address');
      }
    } catch (err) {
      console.error('Error saving address:', err);
      toast.error('An error occurred');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsPlacing(true);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Please login to place an order');
        navigate('/login');
        return;
      }

      const orderData = {
        customer_info: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          phone: formData.phone,
          country: 'India'
        },
        items: cart.items.map(i => ({
          product_id: i.id,
          quantity: i.quantity,
          price: i.price
        })),
        total_amount: cart.totalAmount,
        discount_amount: cart.discountAmount,
        final_amount: cart.discountedTotal,
        payment_method: paymentMethod
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders/place-order/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const data = await response.json();
        setOrderId(data.order_id || data.id);
        setShowSuccessModal(true);
        dispatch(clearCart());
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to place order');
      }
    } catch (err) {
      console.error('Order error:', err);
      toast.error('An error occurred while placing order');
    } finally {
      setIsPlacing(false);
    }
  };

  if (cart.items.length === 0 && !showSuccessModal) {
    return (
      <div className="min-h-screen bg-white font-sans flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag size={40} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.empty_cart}</h2>
          <p className="text-gray-500 mb-6">{t.empty_cart_desc}</p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-[#003d29] text-white rounded-full font-bold hover:bg-[#002a1c] transition"
          >
            {t.start_shopping}
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col relative">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-8 sm:px-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-[#003d29] mb-8 transition font-medium"
        >
          <ChevronLeft size={20} />
          {t.back_to_shopping}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-[#003d29]">
                  <MapPin size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  {currentLang === 'hi' ? 'आपका पता' : currentLang === 'mr' ? 'तुमचा पत्ता' : 'Saved Addresses'}
                </h2>
              </div>

              {addressLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="w-8 h-8 text-[#003d29] animate-spin" />
                </div>
              ) : addresses.length > 0 ? (
                <div className="mb-8">
                  <div 
                    onClick={() => setShowAddresses(!showAddresses)}
                    className="p-5 rounded-2xl border-2 border-[#003d29] bg-green-50/30 cursor-pointer flex items-center justify-between group transition-all mb-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-[#003d29] text-white rounded-xl shadow-lg shadow-green-900/20">
                        <MapPin size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-gray-900 text-sm tracking-tight truncate">
                          {formData.address || 'Select From Saved Addresses'}
                        </p>
                        {formData.city && <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{formData.city}, {formData.state}</p>}
                      </div>
                    </div>
                    <ChevronDown size={18} className={`text-[#003d29] transition-transform duration-300 ${showAddresses ? 'rotate-180' : ''}`} />
                  </div>

                  {showAddresses && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-3xl border border-gray-100 animate-in slide-in-from-top-4 duration-300">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => selectAddress(addr)}
                          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative group ${formData.address === addr.street
                              ? 'border-[#003d29] bg-white shadow-xl shadow-green-900/5'
                              : 'border-transparent hover:border-gray-200 bg-white/50 hover:bg-white'
                            }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-1 p-2 rounded-lg ${formData.address === addr.street ? 'bg-[#003d29] text-white' : 'bg-white text-gray-400 border border-gray-100'}`}>
                              {addr.is_default ? <Home size={16} /> : <MapPin size={16} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-black text-gray-800 text-xs mb-1 truncate uppercase tracking-tight">{addr.street}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">{addr.city}, {addr.state}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setShowAddAddressModal(true)}
                        className="p-5 rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#003d29] hover:bg-white transition-all flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-[#003d29] group bg-white/30"
                      >
                        <Plus size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">New Address</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-8 p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[32px] text-center flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-400 shadow-sm">
                    <MapPin size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">No saved addresses</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Please add a shipping address to continue</p>
                  </div>
                  <button
                    onClick={() => setShowAddAddressModal(true)}
                    className="mt-2 px-8 py-4 bg-[#003d29] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-green-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Add Shipping Address
                  </button>
                </div>
              )}

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                  <CreditCard size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                <div 
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative group ${paymentMethod === 'COD' ? 'border-[#003d29] bg-green-50/20' : 'border-gray-50 bg-white'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${paymentMethod === 'COD' ? 'bg-[#003d29] text-white shadow-xl shadow-green-900/20' : 'bg-gray-100 text-gray-400'}`}>
                      <Wallet size={24} />
                    </div>
                    <div>
                      <span className="font-black text-gray-900 text-sm block uppercase tracking-tight">{t.cod}</span>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Pay on delivery</p>
                    </div>
                  </div>
                  {paymentMethod === 'COD' && <div className="absolute top-4 right-4 text-[#003d29]"><CheckCircle size={20} fill="currentColor" className="text-white" /></div>}
                </div>

                <div 
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative group ${paymentMethod === 'UPI' ? 'border-blue-500 bg-blue-50/20' : 'border-gray-50 bg-white'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${paymentMethod === 'UPI' ? 'bg-blue-500 text-white shadow-xl shadow-blue-500/20' : 'bg-gray-100 text-gray-400'}`}>
                      <CreditCard size={24} />
                    </div>
                    <div>
                      <span className="font-black text-gray-900 text-sm block uppercase tracking-tight">ONLINE / UPI</span>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Secure payment</p>
                    </div>
                  </div>
                  {paymentMethod === 'UPI' && <div className="absolute top-4 right-4 text-blue-500"><CheckCircle size={20} fill="currentColor" className="text-white" /></div>}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacing || !formData.address}
                  className="w-full py-6 bg-gray-900 text-white rounded-[32px] font-black uppercase tracking-[0.25em] text-sm hover:bg-black disabled:bg-gray-100 disabled:text-gray-400 transition-all shadow-2xl active:scale-[0.98]"
                >
                  {isPlacing ? <Loader2 className="animate-spin mx-auto text-white" /> : `Confirm Order • ₹${cart.discountedTotal.toFixed(2)}`}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6">{t.order_summary}</h2>
              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                      {getImageUrl(item.image) ? (
                        <img src={getImageUrl(item.image)} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag className="text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 truncate">{t[item.title] || item.title}</h4>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-500">{t.qty}: {item.quantity}</span>
                        <span className="font-semibold text-gray-800">₹{item.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3 border-t border-gray-100 pt-4">
                <div className="flex justify-between text-gray-600"><span>{t.subtotal}</span><span>₹{cart.totalAmount.toFixed(2)}</span></div>
                {cart.discountAmount > 0 && <div className="flex justify-between text-green-600 font-medium"><span>Discount</span><span>-₹{cart.discountAmount.toFixed(2)}</span></div>}
                <div className="flex justify-between text-gray-600"><span>{t.shipping}</span><span className="text-green-600 font-medium">{t.free}</span></div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-3">
                  <span className="text-lg font-bold text-gray-800">{t.total}</span>
                  <span className="text-2xl font-bold text-[#003d29]">₹{cart.discountedTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals outside main flow */}
      {blocker.state === "blocked" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="bg-white rounded-[40px] p-10 max-w-sm w-full relative z-10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mx-auto mb-6"><Info size={40} /></div>
            <h3 className="text-2xl font-black text-gray-900 text-center mb-2">Wait! Not done?</h3>
            <p className="text-gray-500 text-center text-sm mb-8 font-bold uppercase tracking-widest opacity-60">Leaving will cancel your checkout process.</p>
            <div className="flex flex-col gap-3 font-black uppercase tracking-widest text-[10px]">
              <button onClick={() => blocker.proceed()} className="w-full py-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all">Leave Anyway</button>
              <button onClick={() => blocker.reset()} className="w-full py-4 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-900/20">Stay Here</button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#003d29]/95 backdrop-blur-md" />
          <div className="bg-white rounded-[48px] p-10 max-w-lg w-full relative z-10 shadow-2xl animate-in fade-in zoom-in duration-500 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-8 overflow-hidden relative">
              <CheckCircle size={48} />
              <div className="absolute inset-0 bg-green-500/10 animate-ping rounded-full" />
            </div>
            <h3 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Order Placed!</h3>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-8">Thank you for your purchase.</p>
            <div className="bg-gray-50 rounded-3xl p-6 w-full mb-8 border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Transaction ID</p>
              <p className="text-2xl font-black text-[#003d29]">#{orderId || 'SUCCESS'}</p>
            </div>
            <div className="flex flex-col gap-4 w-full">
              <button onClick={() => navigate('/account', { state: { activeTab: 'orders' } })} className="w-full py-5 bg-[#003d29] text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-green-900/20">Track My Order</button>
              <button onClick={() => navigate('/')} className="w-full py-5 text-[#003d29] font-black uppercase tracking-widest text-xs">Back to Home</button>
            </div>
          </div>
        </div>
      )}

      {showAddAddressModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddAddressModal(false)} />
          <div className="bg-white rounded-[40px] p-8 max-w-xl w-full relative z-10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-[#003d29]">
                  <Plus size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Add Address</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">New shipping destination</p>
                </div>
              </div>
              <button onClick={() => setShowAddAddressModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <form onSubmit={handleAddNewAddress} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Street Address</label>
                  <input
                    required
                    type="text"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#003d29] focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-800"
                    placeholder="House No, Building, Street"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">City</label>
                    <input
                      required
                      type="text"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#003d29] focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-800"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">State</label>
                    <input
                      required
                      type="text"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#003d29] focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-800"
                      placeholder="State"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Zip Code</label>
                    <input
                      required
                      type="text"
                      value={newAddress.zip_code}
                      onChange={(e) => setNewAddress({ ...newAddress, zip_code: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#003d29] focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-800"
                      placeholder="Zip Code"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Phone</label>
                    <input
                      required
                      type="text"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#003d29] focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-800"
                      placeholder="Mobile Number"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Country</label>
                  <input
                    required
                    type="text"
                    value={newAddress.country}
                    onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#003d29] focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-800"
                    placeholder="Country"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-2">
                <input
                  type="checkbox"
                  id="default-address"
                  checked={newAddress.is_default}
                  onChange={(e) => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                  className="w-5 h-5 accent-[#003d29] rounded cursor-pointer"
                />
                <label htmlFor="default-address" className="text-xs font-bold text-gray-600 cursor-pointer">Set as default address</label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
                  className="flex-1 py-5 bg-gray-100 text-gray-600 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingAddress}
                  className="flex-2 px-12 py-5 bg-[#003d29] text-white rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-green-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isSavingAddress ? <Loader2 className="animate-spin" /> : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Checkout;
