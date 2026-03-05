import React from 'react';
import { X, Heart, Trash2, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromWishlist } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import { translations } from '../translations';

const Wishlist = ({ isOpen, onClose }) => {
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const currentLang = useSelector((state) => state.language.currentLanguage);
  const t = translations[currentLang];
  
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    // Optional: remove from wishlist when added to cart
    // dispatch(removeFromWishlist(product.id));
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-red-500 text-white">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Heart size={20} className="fill-current" />
              {t.wishlist || 'Wishlist'} ({wishlistItems.length})
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {wishlistItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                   <Heart size={40} className="text-gray-400" />
                </div>
                <p className="text-lg font-medium">{t.empty_wishlist || 'Your wishlist is empty'}</p>
                <button 
                  onClick={onClose}
                  className="mt-4 px-6 py-2 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition"
                >
                  {t.start_shopping}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    {/* Product Image */}
                    <div className={`w-24 h-24 ${item.bgColor || 'bg-gray-100'} rounded-2xl flex items-center justify-center p-4 relative flex-shrink-0 overflow-hidden`}>
                      {(item.image?.startsWith('http') || item.image?.startsWith('data:') || item.image?.startsWith('/') || item.image?.length > 20) ? (
                        <img 
                          src={item.image.startsWith('http') || item.image.startsWith('data:') || item.image.startsWith('/') ? item.image : `data:image/jpeg;base64,${item.image}`} 
                          alt={item.title} 
                          className="w-full h-full object-cover rounded-xl" 
                        />
                      ) : (
                        <div className="text-4xl">{item.image}</div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-900 truncate pr-2">
                          {t[item.title] || item.title}
                        </h3>
                        <button 
                          onClick={() => dispatch(removeFromWishlist(item.id))}
                          className="text-gray-400 hover:text-red-500 transition p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-[#003d29] font-bold mt-1">₹{item.price}</p>
                      
                      <button 
                        onClick={() => handleAddToCart(item)}
                        className="mt-3 flex items-center gap-2 text-[10px] font-black text-white bg-[#006d5b] px-4 py-2 rounded-tl-[15px] rounded-br-[15px] rounded-tr-none rounded-bl-none uppercase tracking-[0.2em] hover:bg-[#005c4b] transition-all shadow-md active:scale-95"
                      >
                        <ShoppingCart size={14} />
                        {t.add_to_cart}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
