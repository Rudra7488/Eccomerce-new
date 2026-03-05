import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, Info, Tag, ChevronRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart, removeFromCart } from '../store/slices/cartSlice';
import { translations } from '../translations';

const Cart = ({ isOpen, onClose }) => {
  const cart = useSelector((state) => state.cart);
  const currentLang = useSelector((state) => state.language.currentLanguage);
  const t = translations[currentLang];
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');

  const handleIncrement = (item) => {
    dispatch(addToCart(item));
  };

  const handleDecrement = (id) => {
    dispatch(removeFromCart(id));
  };

  // Mock recommended products based on the image
  const recommendedProducts = [
    {
      id: 'rec1',
      name: 'Diabecon (DS)',
      sub: '60 Tablets',
      price: 285.0,
      image: 'https://himalayawellness.in/cdn/shop/products/diabecon-ds-60-tablets_500x.jpg?v=1621254123'
    },
    {
      id: 'rec2',
      name: 'Liv.52 DS Syrup',
      sub: '100ml',
      price: 182.0,
      image: 'https://himalayawellness.in/cdn/shop/products/liv-52-ds-syrup-100ml_500x.jpg?v=1621254123'
    }
  ];

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
                          <button 
                            onClick={() => dispatch(removeFromCart(item.id))}
                            className="text-xs font-bold text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recommended Products Section */}
                <div className="pt-8 border-t border-gray-100">
                  <h3 className="text-xl font-black text-gray-900 mb-6 tracking-tight">Recommended Products</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {recommendedProducts.map((prod) => (
                      <div key={prod.id} className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-lg hover:shadow-gray-100 transition-all group relative">
                        <button className="absolute top-3 left-3 w-6 h-6 bg-[#006d5b] text-white rounded-md flex items-center justify-center shadow-lg shadow-green-900/20 z-10">
                          <Plus size={14} strokeWidth={3} />
                        </button>
                        <div className="aspect-square mb-4 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-2">
                          <img src={prod.image} alt={prod.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1 truncate">{prod.name}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">{prod.sub}</p>
                        <p className="font-black text-[#006d5b]">₹{prod.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Bottom Actions */}
          {cart.items.length > 0 && (
            <div className="p-8 bg-white border-t border-gray-100 space-y-6">
              {/* Offers Accordion */}
              <div className="flex items-center justify-between py-4 px-6 bg-[#fdfbf0] rounded-2xl border border-orange-100 group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#ff6b3d] shadow-sm">
                    <Tag size={20} />
                  </div>
                  <span className="font-black text-gray-900 text-sm">Available Offers</span>
                </div>
                <ChevronRight size={20} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Pricing Details */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Subtotal</span>
                    <Info size={14} className="text-gray-300" />
                  </div>
                  <span className="font-black text-gray-900 text-lg">₹{cart.totalAmount.toFixed(2)}</span>
                </div>

                {/* Coupon Input */}
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Discount code or gift card"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006d5b]/20 focus:border-[#006d5b] transition-all"
                  />
                  <button className="px-6 py-3 bg-[#006d5b] text-white rounded-xl text-sm font-black uppercase tracking-wider hover:bg-[#005c4b] transition-colors">
                    Apply
                  </button>
                </div>
              </div>
              
              {/* Final CTA */}
              <button 
                onClick={() => {
                  onClose();
                  navigate('/checkout');
                }}
                className="w-full py-5 bg-[#006d5b] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-[#005c4b] transition shadow-2xl shadow-green-900/20 transform hover:-translate-y-1 active:translate-y-0"
              >
                {t.checkout || 'Check Out'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
