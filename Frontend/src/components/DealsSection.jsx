import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { Heart, Star } from 'lucide-react';
import { translations } from '../translations';

const products = [
  // Tech
  {
    id: 1,
    title: 'HomePod mini',
    price: 239.00,
    description: '5 Colors Available',
    rating: 5,
    reviews: 121,
    image: '🔊',
    bgColor: 'bg-gray-100',
    category: 'Tech',
    discount: 10
  },
  {
    id: 2,
    title: 'Instax Mini 9',
    price: 99.00,
    description: 'Selfie mode and selfie mirror, Macro mode',
    rating: 5,
    reviews: 121,
    image: '📸',
    bgColor: 'bg-blue-100',
    category: 'Tech',
    discount: 20
  },
  {
    id: 11,
    title: 'Wireless Headphones',
    price: 199.00,
    description: 'Noise cancelling, 20h battery life',
    rating: 4,
    reviews: 89,
    image: '🎧',
    bgColor: 'bg-gray-100',
    category: 'Tech'
  },
  {
    id: 12,
    title: 'Smart Watch',
    price: 299.00,
    description: 'Fitness tracking, heart rate monitor',
    rating: 5,
    reviews: 210,
    image: '⌚',
    bgColor: 'bg-gray-100',
    category: 'Tech',
    discount: 15
  },
  
  // Groceries
  {
    id: 3,
    title: 'Organic Bananas',
    price: 4.99,
    description: 'Fresh organic bananas, bunch',
    rating: 5,
    reviews: 320,
    image: '🍌',
    bgColor: 'bg-yellow-100',
    category: 'Groceries'
  },
  {
    id: 13,
    title: 'Whole Milk',
    price: 3.50,
    description: 'Fresh whole milk, 1 gallon',
    rating: 4,
    reviews: 150,
    image: '🥛',
    bgColor: 'bg-blue-50',
    category: 'Groceries',
    discount: 5
  },
  {
    id: 16,
    title: 'Avocados',
    price: 5.99,
    description: 'Ripe hass avocados, bag of 4',
    rating: 5,
    reviews: 210,
    image: '🥑',
    bgColor: 'bg-green-100',
    category: 'Groceries'
  },
  {
    id: 17,
    title: 'Sourdough Bread',
    price: 6.00,
    description: 'Freshly baked sourdough loaf',
    rating: 5,
    reviews: 95,
    image: '🍞',
    bgColor: 'bg-orange-50',
    category: 'Groceries'
  },
  
  // Hand Bag
  {
    id: 4,
    title: 'Tote Medium',
    price: 259.00,
    description: 'Canvas, full grain leather',
    rating: 5,
    reviews: 121,
    image: '👜',
    bgColor: 'bg-pink-100',
    category: 'Hand Bag',
    discount: 30
  },
  {
    id: 14,
    title: 'Leather Satchel',
    price: 320.00,
    description: 'Genuine leather, multiple compartments',
    rating: 5,
    reviews: 78,
    image: '💼',
    bgColor: 'bg-gray-100',
    category: 'Hand Bag'
  },

  // Sneakers
  {
    id: 5,
    title: 'Air Max 90',
    price: 120.00,
    description: 'Iconic style, comfort cushioning',
    rating: 5,
    reviews: 340,
    image: '👟',
    bgColor: 'bg-gray-100',
    category: 'Sneakers',
    discount: 25
  },
  {
    id: 6,
    title: 'Classic Canvas',
    price: 60.00,
    description: 'Casual daily wear',
    rating: 4,
    reviews: 200,
    image: '👞',
    bgColor: 'bg-orange-100',
    category: 'Sneakers'
  },
  {
    id: 7,
    title: 'Running Pro',
    price: 140.00,
    description: 'Lightweight performance',
    rating: 5,
    reviews: 150,
    image: '🏃',
    bgColor: 'bg-green-100',
    category: 'Sneakers'
  },

  // Furniture
  {
    id: 8,
    title: 'Modern Sofa',
    price: 899.00,
    description: 'Velvet finish, 3-seater',
    rating: 5,
    reviews: 45,
    image: '🛋️',
    bgColor: 'bg-emerald-100',
    category: 'Furniture'
  },
  {
    id: 9,
    title: 'Wooden Chair',
    price: 129.00,
    description: 'Solid oak, ergonomic design',
    rating: 4,
    reviews: 88,
    image: '🪑',
    bgColor: 'bg-gray-100',
    category: 'Furniture'
  },
  
  // Books
  {
    id: 10,
    title: 'Design Principles',
    price: 45.00,
    description: 'Hardcover, Illustrated',
    rating: 5,
    reviews: 67,
    image: '📚',
    bgColor: 'bg-red-100',
    category: 'Books'
  },
  {
    id: 15,
    title: 'Cooking Masterclass',
    price: 35.00,
    description: 'Recipes from top chefs',
    rating: 5,
    reviews: 112,
    image: '📖',
    bgColor: 'bg-gray-100',
    category: 'Books'
  }
];

const DealsSection = ({ selectedCategory }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentLang = useSelector((state) => state.language.currentLanguage);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const t = translations[currentLang];

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleToggleWishlist = (product) => {
    dispatch(toggleWishlist(product));
  };

  const isItemInWishlist = (id) => {
    return wishlistItems.some((item) => item.id === id);
  };

  const handleBuyNow = (product) => {
    dispatch(addToCart(product));
    navigate('/checkout');
  };

  const filteredProducts = selectedCategory && selectedCategory !== 'All'
    ? products.filter(product => product.category === selectedCategory)
    : products;

  return (
    <div className="py-8 px-4 sm:px-8 bg-white" id="products-section">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition duration-300 border border-transparent hover:border-gray-200 flex flex-col h-full">
            <div className={`h-64 ${product.bgColor} relative flex items-center justify-center p-8 group`}>
               {product.discount && (
                 <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                   {product.discount}% {t.off}
                 </div>
               )}
               <div className="text-9xl drop-shadow-lg transform group-hover:scale-110 transition duration-500 w-full h-full flex items-center justify-center">
                 {(product.image?.startsWith('http') || product.image?.startsWith('data:') || product.image?.startsWith('/') || product.image?.length > 20) ? (
                   <img 
                     src={product.image.startsWith('http') || product.image.startsWith('data:') || product.image.startsWith('/') ? product.image : `data:image/jpeg;base64,${product.image}`} 
                     alt={product.title} 
                     className="w-full h-full object-contain" 
                   />
                 ) : (
                   <span>{product.image}</span>
                 )}
               </div>
               <button 
                 onClick={() => handleToggleWishlist(product)}
                 className={`absolute top-4 right-4 p-2 bg-white rounded-full transition shadow-sm ${
                   isItemInWishlist(product.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                 }`}
               >
                 <Heart size={20} className={isItemInWishlist(product.id) ? 'fill-current' : ''} />
               </button>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 text-lg">{product.title}</h3>
                <span className="font-bold text-gray-900">₹{product.price}</span>
              </div>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className="fill-green-500 text-green-500" />
                ))}
                <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
              </div>
              <div className="flex items-center gap-2 mt-auto">
                <button 
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 px-3 py-2 bg-[#006d5b] text-white rounded-tl-[15px] rounded-br-[15px] rounded-tr-none rounded-bl-none font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#005c4b] transition-all whitespace-nowrap"
                >
                  {t.add_to_cart}
                </button>
                <button 
                  onClick={() => handleBuyNow(product)}
                  className="flex-1 px-3 py-2 bg-[#003d29] text-white border border-[#003d29] rounded-full font-medium text-xs hover:bg-[#002a1c] transition whitespace-nowrap"
                >
                  {t.buy_now}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealsSection;
