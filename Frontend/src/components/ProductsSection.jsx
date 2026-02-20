import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { Heart, Star } from 'lucide-react';
import { translations } from '../translations';

const ProductsSection = ({ selectedCategory, searchQuery }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentLang = useSelector((state) => state.language.currentLanguage);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const t = translations[currentLang];
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/public/`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    // Format product to match the expected cart structure
    const cartProduct = {
      id: product.id,
      title: product.name,
      price: product.price,
      description: product.description,
      image: product.images?.[0] || '📦', // Use first image or default icon
      quantity: 1,
    };
    dispatch(addToCart(cartProduct));
  };

  const handleToggleWishlist = (product) => {
    const wishlistProduct = {
      id: product.id,
      title: product.name,
      price: product.price,
      description: product.description,
      image: product.images?.[0] || '📦',
    };
    dispatch(toggleWishlist(wishlistProduct));
  };

  const isItemInWishlist = (id) => {
    return wishlistItems.some((item) => item.id === id);
  };

  const handleBuyNow = (product) => {
    const cartProduct = {
      id: product.id,
      title: product.name,
      price: product.price,
      description: product.description,
      image: product.images?.[0] || '📦',
      quantity: 1,
    };
    dispatch(addToCart(cartProduct));
    navigate('/checkout');
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory && selectedCategory !== 'All' 
      ? product.category === selectedCategory 
      : true;
      
    const matchesSearch = searchQuery
      ? (product.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (product.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (product.category?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      : true;

    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="py-8 px-4 sm:px-8 bg-white" id="products-section">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003d29]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 px-4 sm:px-8 bg-white" id="products-section">
        <div className="text-center text-red-500 py-8">
          <p>Error loading products: {error}</p>
          <button 
            onClick={fetchProducts}
            className="mt-4 px-4 py-2 bg-[#003d29] text-white rounded hover:bg-[#002a1c] transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-8 bg-white" id="products-section">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition duration-300 border border-transparent hover:border-gray-200 flex flex-col h-full">
            <div className={`h-64 ${product.category ? 'bg-gray-100' : 'bg-gray-100'} relative flex items-center justify-center p-8 group`}>
               {product.discount && (
                 <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                   {product.discount}% {t.off}
                 </div>
               )}
               <div className="text-9xl drop-shadow-lg transform group-hover:scale-110 transition duration-500">
                 {product.images && product.images.length > 0 ? (
                   <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain" />
                 ) : (
                   '📦'
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
                <h3 className="font-bold text-gray-900 text-lg">{product.name}</h3>
                <span className="font-bold text-gray-900">₹{product.price}</span>
              </div>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className="fill-green-500 text-green-500" />
                ))}
                <span className="text-xs text-gray-500 ml-1">(10+)</span>
              </div>
              <div className="flex items-center gap-2 mt-auto">
                <button 
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 px-3 py-2 border border-gray-900 rounded-full font-medium text-xs hover:bg-gray-900 hover:text-white transition whitespace-nowrap"
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

export default ProductsSection;