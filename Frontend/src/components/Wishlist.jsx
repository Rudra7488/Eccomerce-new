import React from 'react';
import { X, Heart, Trash2, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromWishlist } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import { translations } from '../translations';
import { toast } from 'react-hot-toast';

const Wishlist = ({ isOpen, onClose }) => {
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const currentLang = useSelector((state) => state.language.currentLanguage);
  const t = translations[currentLang];

  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`, {
      style: {
        background: '#006d5b',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '12px'
      }
    });
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
              <div className="grid grid-cols-2 gap-4">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="flex flex-col gap-3 group bg-gray-50/50 p-3 rounded-2xl border border-gray-100/50 hover:bg-white hover:shadow-md transition-all relative">
                    {/* Product Image */}
                    <div className={`w-full aspect-square ${item.bgColor || 'bg-gray-100'} rounded-xl flex items-center justify-center p-3 relative overflow-hidden`}>
                      {item.images && item.images.length > 0 ? (
                        <img 
                          src={item.images[0]} 
                          alt={item.name} 
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
                        />
                      ) : (
                        <div className="text-3xl">📦</div>
                      )}
                      
                      <button 
                        onClick={() => dispatch(removeFromWishlist(item.id))}
                        className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500 rounded-full transition shadow-sm z-10"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <h3 className="font-bold text-gray-800 text-xs line-clamp-2 min-h-[2rem] leading-tight mb-2">
                        {item.name}
                      </h3>
                      <p className="text-[#006d5b] font-black text-xs mb-3">₹{item.price}</p>
                      
                      <button 
                        onClick={() => handleAddToCart(item)}
                        className="mt-auto w-full flex items-center justify-center gap-2 text-[8px] font-black text-white bg-[#006d5b] py-2 rounded-xl uppercase tracking-widest hover:bg-[#005c4b] transition-all shadow-md active:scale-95"
                      >
                        <ShoppingCart size={12} />
                        {t.add_to_cart_short || 'Add'}
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
