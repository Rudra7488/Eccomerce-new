import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { Heart, Star, X, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Reset active image when product changes
  useEffect(() => {
    if (selectedProduct) {
      setActiveImageIndex(0);
    }
  }, [selectedProduct]);

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

  const handleAddToCart = (product, specificImage = null) => {
    const imageToUse = specificImage || product.images?.[0] || '📦';
    
    // Save image preference for this product
    if (specificImage) {
      localStorage.setItem(`cart_image_${product.id}`, specificImage);
    } else {
      // If added from main view (no specific image), reset to default
      localStorage.removeItem(`cart_image_${product.id}`);
    }

    // Format product to match the expected cart structure
    const cartProduct = {
      id: product.id,
      title: product.name,
      price: product.price,
      description: product.description,
      image: imageToUse,
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

  const handleBuyNow = (product, specificImage = null) => {
    const imageToUse = specificImage || product.images?.[0] || '📦';
    
    // Save image preference for this product
    if (specificImage) {
      localStorage.setItem(`cart_image_${product.id}`, specificImage);
    } else {
      localStorage.removeItem(`cart_image_${product.id}`);
    }

    const cartProduct = {
      id: product.id,
      title: product.name,
      price: product.price,
      description: product.description,
      image: imageToUse,
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
            <div 
              className={`h-64 ${product.category ? 'bg-gray-100' : 'bg-gray-100'} relative flex items-center justify-center p-8 group cursor-pointer`}
              onClick={() => setSelectedProduct(product)}
            >
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
                 onClick={(e) => {
                   e.stopPropagation();
                   handleToggleWishlist(product);
                 }}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-900 rounded-full font-medium text-xs hover:bg-gray-900 hover:text-white transition whitespace-nowrap"
                >
                  {t.add_to_cart}
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuyNow(product);
                  }}
                  className="flex-1 px-3 py-2 bg-[#003d29] text-white border border-[#003d29] rounded-full font-medium text-xs hover:bg-[#002a1c] transition whitespace-nowrap"
                >
                  {t.buy_now}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
          <div 
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl animate-in fade-in zoom-in duration-300 relative"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition z-10"
            >
              <X size={20} />
            </button>

            {/* Image Gallery Section */}
            <div className="w-full md:w-1/2 p-6 bg-gray-50 flex flex-col gap-4">
              {/* Main Image */}
              <div className="aspect-square bg-white rounded-xl overflow-hidden flex items-center justify-center border border-gray-200 relative group">
                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                  <img 
                    src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105" 
                  />
                ) : (
                  <div className="text-6xl">📦</div>
                )}
                
                {/* Navigation Arrows (if multiple images) */}
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex(prev => prev === 0 ? selectedProduct.images.length - 1 : prev - 1);
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex(prev => prev === selectedProduct.images.length - 1 ? 0 : prev + 1);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {selectedProduct.images && selectedProduct.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 flex-shrink-0 rounded-lg border-2 overflow-hidden ${
                        activeImageIndex === idx ? 'border-[#003d29]' : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div className="w-full md:w-1/2 p-8 flex flex-col">
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold mb-3 uppercase tracking-wider">
                    {selectedProduct.category || 'General'}
                  </span>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h2>
                </div>
                <button 
                   onClick={() => handleToggleWishlist(selectedProduct)}
                   className={`p-3 rounded-full transition ${
                     isItemInWishlist(selectedProduct.id) 
                       ? 'bg-red-50 text-red-500' 
                       : 'bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50'
                   }`}
                >
                  <Heart size={24} className={isItemInWishlist(selectedProduct.id) ? 'fill-current' : ''} />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-500">(4.8/5 Reviews)</span>
              </div>

              <div className="text-3xl font-bold text-[#003d29] mb-6">
                ₹{selectedProduct.price.toLocaleString()}
                {selectedProduct.discount && (
                  <span className="text-lg text-gray-400 font-normal line-through ml-3">
                    ₹{Math.round(selectedProduct.price * (100 / (100 - selectedProduct.discount))).toLocaleString()}
                  </span>
                )}
              </div>

              <div className="prose prose-sm text-gray-600 mb-8 flex-1 overflow-y-auto max-h-40 custom-scrollbar">
                <p>{selectedProduct.description}</p>
              </div>

              <div className="flex gap-4 mt-auto pt-6 border-t border-gray-100">
                <button 
                  onClick={() => {
                    handleAddToCart(selectedProduct, selectedProduct.images[activeImageIndex]);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 py-3.5 border-2 border-[#003d29] text-[#003d29] rounded-xl font-bold hover:bg-[#003d29] hover:text-white transition-all"
                >
                  {t.add_to_cart}
                </button>
                <button 
                  onClick={() => {
                    handleBuyNow(selectedProduct, selectedProduct.images[activeImageIndex]);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 py-3.5 bg-[#003d29] text-white rounded-xl font-bold hover:bg-[#002a1c] transition-all shadow-lg shadow-[#003d29]/20"
                >
                  {t.buy_now}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsSection;