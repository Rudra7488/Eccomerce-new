import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, CreditCard, ShoppingBag } from 'lucide-react';
import { clearCart } from '../store/slices/cartSlice';
import { translations } from '../translations';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Checkout = () => {
  const cart = useSelector((state) => state.cart);
  const currentLang = useSelector((state) => state.language.currentLanguage);
  const t = translations[currentLang];
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    phone: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    // In a real app, we would send formData and cart items to backend
    // Persist a mock order locally so it shows under "My Orders"
    try {
      const orderId = `ORD-${Date.now()}`;
      const order = {
        id: orderId,
        date: new Date().toISOString(),
        status: 'Placed',
        items: cart.items.map(i => ({
          id: i.id,
          title: i.title,
          price: i.price,
          quantity: i.quantity,
          totalPrice: i.totalPrice,
          image: i.image
        })),
        totalAmount: cart.totalAmount,
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode
        }
      };
      const key = 'orders';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(order);
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (err) {
      console.error('Failed to save mock order:', err);
    }
    
    // Clear cart and navigate to success
    dispatch(clearCart());
    navigate('/success');
  };

  if (cart.items.length === 0) {
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
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
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
          {/* Left: Shipping Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-[#003d29]">
                  <MapPin size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">{t.shipping_address}</h2>
              </div>

              <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.full_name}</label>
                  <input 
                    required
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder={t.full_name}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003d29]/20 focus:border-[#003d29] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.email_address}</label>
                  <input 
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003d29]/20 focus:border-[#003d29] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.phone_number}</label>
                  <input 
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003d29]/20 focus:border-[#003d29] transition"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.street_address}</label>
                  <input 
                    required
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder={t.street_address}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003d29]/20 focus:border-[#003d29] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.city}</label>
                  <input 
                    required
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder={t.city}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003d29]/20 focus:border-[#003d29] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.zip_code}</label>
                  <input 
                    required
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="XXXXXX"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003d29]/20 focus:border-[#003d29] transition"
                  />
                </div>
                
                <div className="md:col-span-2 pt-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-[#003d29]">
                      <CreditCard size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">{t.payment_method}</h2>
                  </div>
                  <div className="p-4 border-2 border-[#003d29] bg-green-50/30 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border-4 border-[#003d29]"></div>
                      <span className="font-semibold text-gray-800">{t.cod}</span>
                    </div>
                    <span className="text-xs font-medium text-[#003d29] bg-green-100 px-2 py-1 rounded-md">{t.available}</span>
                  </div>
                </div>

                <div className="md:col-span-2 pt-6">
                  <button 
                    type="submit"
                    className="w-full py-4 bg-[#003d29] text-white rounded-xl font-bold text-lg hover:bg-[#002a1c] transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {t.place_order} (₹{cart.totalAmount.toFixed(2)})
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6">{t.order_summary}</h2>
              
              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                      {(item.image?.startsWith('http') || item.image?.startsWith('data:') || item.image?.startsWith('/') || item.image?.length > 20) ? (
                        <img 
                          src={item.image.startsWith('http') || item.image.startsWith('data:') || item.image.startsWith('/') ? item.image : `data:image/jpeg;base64,${item.image}`} 
                          alt={item.title} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <span>{item.image}</span>
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
                <div className="flex justify-between text-gray-600">
                  <span>{t.subtotal}</span>
                  <span className="font-semibold">₹{cart.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t.shipping}</span>
                  <span className="text-green-600 font-medium">{t.free}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-3">
                  <span className="text-lg font-bold text-gray-800">{t.total}</span>
                  <span className="text-2xl font-bold text-[#003d29]">₹{cart.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
