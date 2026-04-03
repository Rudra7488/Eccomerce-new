import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, Info, Tag, ChevronRight, Percent, DollarSign, Copy, Check, Loader2, Ticket } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart, removeFromCart, applyCoupon, removeCoupon } from '../store/slices/cartSlice';
import { translations } from '../translations';
import toast from 'react-hot-toast';

const Cart = ({ isOpen, onClose }) => {
  const cart = useSelector((state) => state.cart);
  const currentLang = useSelector((state) => state.language.currentLanguage);
  const t = translations[currentLang];
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [showOffers, setShowOffers] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  const fetchPublicCoupons = async () => {
    try {
      setCouponsLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/coupons/public/list/`, {
        headers
      });
      
      if (response.ok) {
        const data = await response.json();
        setCoupons(data);
      }
    } catch (error) {
      console.error('Error fetching public coupons:', error);
    } finally {
      setCouponsLoading(false);
    }
  };

  useEffect(() => {
    if (showOffers && coupons.length === 0) {
      fetchPublicCoupons();
    }
  }, [showOffers]);

  useEffect(() => {
    if (cart.appliedCoupon && cart.totalAmount < cart.appliedCoupon.min_purchase) {
      dispatch(removeCoupon());
      // Silently remove coupon if criteria no longer met during cart updates
    }
  }, [cart.totalAmount, cart.appliedCoupon, dispatch]);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setCouponCode(code);
    // Automatically apply the coupon when the user clicks 'Apply' in the list
    handleApplyCoupon(code);
  };

  const handleApplyCoupon = async (code = couponCode) => {
    if (!code) {
      toast.error('Please enter a coupon code');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Please login to apply coupons');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/coupons/validate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: code.toUpperCase(),
          purchase_amount: cart.totalAmount
        })
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(applyCoupon(data));
        toast.success('Coupon applied successfully!');
        setShowOffers(false); // Close the available offers list after applying
      } else {
        toast.error(data.error || 'Invalid coupon code');
        dispatch(removeCoupon());
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      toast.error('Failed to validate coupon');
    }
  };

  const handleIncrement = (item) => {
    dispatch(addToCart(item));
  };

  const handleDecrement = (id) => {
    dispatch(removeFromCart(id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Cart Panel */}
      <div className="fixed inset-y-0 right-0 max-w-md w-full flex">
        <div className="w-full h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
          
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {t.shopping_cart || 'Cart'}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
            >
              <X size={24} />
            </button>
          </div>

          {/* Savings Banner - Top (from reference image) */}
          {cart.discountAmount > 0 && (
            <div className="bg-[#006d5b] text-white py-3 px-4 text-center animate-fadeIn">
              <p className="text-sm font-black tracking-tight">
                You are saving ₹{cart.discountAmount.toFixed(2)} on this order.
              </p>
            </div>
          )}

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {cart.items.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-gray-500 p-8">
                <ShoppingBag size={48} className="text-gray-200 mb-4" />
                <p className="text-lg font-bold text-gray-900">{t.empty_cart}</p>
                <button 
                  onClick={onClose}
                  className="mt-4 text-[#006d5b] font-bold hover:underline"
                >
                  {t.start_shopping}
                </button>
              </div>
            ) : (
              <div className="p-8 space-y-8">
                {/* Cart Items List */}
                <div className="space-y-6">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-6 group">
                      <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 border border-gray-100">
                        {(item.image?.startsWith('http') || item.image?.startsWith('data:') || item.image?.startsWith('/') || (item.image || '').length > 20) ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-contain p-2" />
                        ) : (
                          <span className="text-3xl">{item.image || '📦'}</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-gray-900 truncate pr-2">{item.title}</h3>
                          <p className="font-bold text-gray-900">₹{item.price.toFixed(2)}</p>
                        </div>
                        <p className="text-xs text-gray-500 mb-4 font-medium uppercase tracking-wider">Net Quantity: {item.quantity}</p>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center bg-gray-50 rounded-xl border border-gray-100 p-1">
                            <button 
                              onClick={() => handleDecrement(item.id)}
                              className="p-1.5 hover:bg-white hover:shadow-sm text-gray-600 rounded-lg transition-all"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-black text-gray-900">{item.quantity}</span>
                            <button 
                              onClick={() => handleIncrement(item)}
                              className="p-1.5 hover:bg-white hover:shadow-sm text-gray-600 rounded-lg transition-all"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Bottom Actions */}
          {cart.items.length > 0 && (
            <div className="p-8 bg-white border-t border-gray-100 space-y-6">
              {/* Offers Accordion */}
              <div className="space-y-4">
                <div 
                  onClick={() => setShowOffers(!showOffers)}
                  className="flex items-center justify-between py-4 px-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-100/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#ff6b3d] shadow-sm">
                      <Tag size={20} />
                    </div>
                    <span className="font-black text-gray-900 text-sm">Available Offers</span>
                  </div>
                  <ChevronRight size={20} className={`text-gray-400 transition-transform duration-300 ${showOffers ? 'rotate-90' : ''}`} />
                </div>

                {/* Coupons List */}
                {showOffers && (
                  <div className="space-y-3 px-1 animate-fadeIn">
                    {couponsLoading ? (
                      <div className="py-4 flex justify-center">
                        <Loader2 className="w-6 h-6 text-[#006d5b] animate-spin" />
                      </div>
                    ) : coupons.length === 0 ? (
                      <p className="text-center py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">No active offers available</p>
                    ) : (
                      coupons.map((coupon) => (
                        <div 
                          key={coupon.id} 
                          className="bg-white rounded-2xl border-2 border-dashed border-[#006d5b]/10 p-5 flex flex-col gap-4 relative overflow-hidden hover:border-[#006d5b]/40 transition-all group shadow-sm hover:shadow-md"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#e6f1f0] rounded-2xl flex items-center justify-center text-[#006d5b] shrink-0">
                              {coupon.discount_type === 'percentage' ? <Percent size={24} /> : <DollarSign size={24} />}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-black text-gray-900 truncate tracking-tight">{coupon.code}</h3>
                              <p className="text-xs font-bold text-[#006d5b] uppercase tracking-wider">
                                {coupon.discount_type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                              </p>
                            </div>

                            <button 
                              onClick={() => handleCopy(coupon.code)}
                              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                cart.appliedCoupon?.code === coupon.code 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-[#006d5b] text-white hover:bg-[#005c4b] shadow-lg shadow-green-900/20'
                              }`}
                            >
                              {cart.appliedCoupon?.code === coupon.code ? 'Applied' : 'Apply'}
                            </button>
                          </div>

                          <div className="pt-3 border-t-2 border-dashed border-gray-100 flex items-center justify-between">
                            <p className="text-[11px] font-bold text-gray-500 italic">
                              Save {coupon.discount_type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`} on orders above ₹{coupon.min_purchase}
                            </p>
                          </div>

                          {/* Decorative semi-circles for coupon look */}
                          <div className="absolute top-[52px] -left-3 w-6 h-6 bg-white rounded-full border-r-2 border-[#006d5b]/10 group-hover:border-[#006d5b]/40 transition-colors"></div>
                          <div className="absolute top-[52px] -right-3 w-6 h-6 bg-white rounded-full border-l-2 border-[#006d5b]/10 group-hover:border-[#006d5b]/40 transition-colors"></div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Pricing Details */}
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Subtotal</span>
                    <Info size={12} className="text-gray-300" />
                  </div>
                  <div className="flex items-center gap-2 font-black text-sm">
                    {cart.discountAmount > 0 && (
                      <span className="text-gray-300 line-through">
                        ₹{cart.totalAmount.toFixed(2)}
                      </span>
                    )}
                    <span className="text-gray-900">
                      ₹{cart.discountedTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Coupon Input Area */}
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Discount code or gift card"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#006d5b] transition-all"
                    />
                    <button 
                      onClick={() => handleApplyCoupon()}
                      disabled={cart.appliedCoupon?.code === (couponCode || '').toUpperCase() && couponCode}
                      className={`px-6 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                        cart.appliedCoupon?.code === (couponCode || '').toUpperCase() && couponCode
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                          : 'bg-[#006d5b] text-white hover:bg-[#005c4b]'
                      }`}
                    >
                      Apply
                    </button>
                  </div>

                  {/* Applied Coupon Tag (Matching Reference Image Style) */}
                  {cart.appliedCoupon && (
                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#f0f0f0] rounded-md border border-gray-200 animate-fadeIn">
                        <Tag size={12} className="text-gray-500 rotate-90" />
                        <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">
                          {cart.appliedCoupon.code}
                        </span>
                        <button 
                          onClick={() => {
                            dispatch(removeCoupon());
                            setCouponCode('');
                          }}
                          className="ml-2 p-0.5 hover:bg-gray-200 rounded-full transition-colors"
                        >
                          <X size={10} className="text-gray-500" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Final Breakdown */}
                <div className="pt-4 space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                    <span>Discount:</span>
                    <span className="text-gray-900">-₹{cart.discountAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-black text-gray-900 pt-2">
                    <span>Total:</span>
                    <span>₹{cart.discountedTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {/* Final CTA */}
              <button 
                onClick={() => {
                  onClose();
                  navigate('/checkout');
                }}
                className="w-full py-5 bg-[#52ceb4] text-white rounded-xl font-black uppercase tracking-[0.2em] text-xs hover:bg-[#45bba2] transition shadow-lg shadow-teal-100 transform hover:-translate-y-1 active:translate-y-0"
              >
                Check Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
