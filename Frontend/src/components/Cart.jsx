import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
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

  const handleIncrement = (item) => {
    dispatch(addToCart(item));
  };

  const handleDecrement = (id) => {
    dispatch(removeFromCart(id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Cart Panel */}
      <div className="fixed inset-y-0 right-0 max-w-md w-full flex">
        <div className="w-full h-full bg-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#003d29] text-white">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <ShoppingBag size={20} />
              {t.shopping_cart} ({cart.totalQuantity})
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                   <ShoppingBag size={40} className="text-gray-400" />
                </div>
                <p className="text-lg font-medium">{t.empty_cart}</p>
                <p className="text-sm text-center max-w-xs">{t.empty_cart_desc}</p>
                <button 
                  onClick={onClose}
                  className="mt-4 px-6 py-2 bg-[#003d29] text-white rounded-full text-sm font-medium hover:bg-[#002a1c] transition"
                >
                  {t.start_shopping}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-green-100 transition">
                    {/* Image */}
                    <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center text-4xl shadow-sm shrink-0 overflow-hidden">
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

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800 line-clamp-1">{item.title}</h3>
                          <p className="text-green-600 font-bold mt-1">₹{item.price.toFixed(2)}</p>
                        </div>
                        <button 
                          onClick={() => handleDecrement(item.id)}
                          className="text-gray-400 hover:text-red-500 transition p-1"
                          title="Remove one"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm">
                          <button 
                            onClick={() => handleDecrement(item.id)}
                            className="p-1.5 hover:bg-gray-50 text-gray-600 rounded-l-lg transition"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => handleIncrement(item)}
                            className="p-1.5 hover:bg-gray-50 text-gray-600 rounded-r-lg transition"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="font-semibold text-gray-800">₹{item.totalPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.items.length > 0 && (
            <div className="p-6 bg-white border-t border-gray-100 space-y-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-center text-gray-600">
                <span>{t.subtotal}</span>
                <span className="font-bold text-gray-900">₹{cart.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>{t.shipping}</span>
                <span className="text-green-600 font-medium">{t.free}</span>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">{t.total}</span>
                <span className="text-xl font-bold text-[#003d29]">₹{cart.totalAmount.toFixed(2)}</span>
              </div>
              
              <button 
                onClick={() => {
                  onClose();
                  navigate('/checkout');
                }}
                className="w-full py-3.5 bg-[#003d29] text-white rounded-xl font-bold hover:bg-[#002a1c] transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {t.checkout}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
