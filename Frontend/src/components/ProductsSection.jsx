import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { Heart, Star, X, ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart, ChevronDown, Check, SlidersHorizontal } from 'lucide-react';
import { translations } from '../translations';
import Navbar from './Navbar';
import Footer from './Footer';

const ProductsSection = ({ selectedCategory: propCategory, searchQuery }) => {
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
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState(null);

  // Filter & Sort States
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [sortBy, setSortBy] = useState('price-low-high');
  const [selectedCategory, setSelectedCategory] = useState(propCategory || 'All');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [openFilterAccordion, setOpenFilterAccordion] = useState('CATEGORY');

  // Update internal category state when prop changes
  useEffect(() => {
    if (propCategory) setSelectedCategory(propCategory);
  }, [propCategory]);

  // Mock Reviews Data
  const mockReviews = [
    { id: 1, user: 'Rengasamy Ra...', location: 'SUBRAMANIA NAGAR SALEM, TN', rating: 4, comment: 'Pretty guse it for peaceful sleep. Found it to be usefulood!', date: '1 WEEK AGO' },
    { id: 2, user: 'L P', location: 'BENGALURU, KA', rating: 5, comment: 'Fantastic!', date: '1 WEEK AGO' },
    { id: 3, user: 'K kantharaju', location: '', rating: 5, comment: 'Good stress. Very good product', date: '3 WEEKS AGO' },
    { id: 4, user: 'Hemant Kumar...', location: 'SECUNDERABAD, TELANGANA', rating: 5, comment: '', date: '3 WEEKS AGO' },
    { id: 5, user: 'shashank Shek...', location: 'DEHRADUN, UT', rating: 1, comment: '', date: '1 MONTH AGO' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  // Reset active image and variant when product changes
  useEffect(() => {
    if (selectedProduct) {
      setActiveImageIndex(0);
      setSelectedVariant(selectedProduct.variants?.[0] || null);
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

  const handleAddToCart = (product, specificImage = null, variant = null) => {
    const imageToUse = specificImage || product.images?.[0] || '📦';
    const priceToUse = variant ? variant.price : product.price;
    const titleToUse = variant ? `${product.name} (${variant.size})` : product.name;
    
    // Format product to match the expected cart structure
    const cartProduct = {
      id: variant ? `${product.id}_${variant.size}` : product.id,
      title: titleToUse,
      price: priceToUse,
      description: product.description,
      image: imageToUse,
      quantity: quantity, // Use the selected quantity
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

  const handleBuyNow = (product, specificImage = null, variant = null) => {
    const imageToUse = specificImage || product.images?.[0] || '📦';
    const priceToUse = variant ? variant.price : product.price;
    const titleToUse = variant ? `${product.name} (${variant.size})` : product.name;

    const cartProduct = {
      id: variant ? `${product.id}_${variant.size}` : product.id,
      title: titleToUse,
      price: priceToUse,
      description: product.description,
      image: imageToUse,
      quantity: 1,
    };
    dispatch(addToCart(cartProduct));
    navigate('/checkout');
  };

  const getMinPrice = (product) => {
    if (product.variants && product.variants.length > 0) {
      return Math.min(...product.variants.map(v => v.price));
    }
    return product.price;
  };

  const filteredProducts = products.filter(product => {
    const productPrice = getMinPrice(product);
    const matchesCategory = selectedCategory && selectedCategory !== 'All' 
      ? product.category === selectedCategory 
      : true;
      
    const matchesSearch = searchQuery
      ? (product.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (product.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (product.category?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      : true;

    const matchesPrice = productPrice >= priceRange[0] && productPrice <= priceRange[1];

    return matchesCategory && matchesSearch && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'price-low-high') return getMinPrice(a) - getMinPrice(b);
    if (sortBy === 'price-high-low') return getMinPrice(b) - getMinPrice(a);
    if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
    return 0;
  });

  if (loading) {
    return (
      <div className="py-8 px-4 sm:px-8 bg-white" id="products-section">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006d5b]"></div>
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
            className="mt-4 px-4 py-2 bg-[#006d5b] text-white rounded hover:bg-[#005c4b] transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const categories = ['All', ...new Set(products.map(p => p.category).filter(cat => 
    cat && 
    cat.length > 2 && 
    !['hgcdhs', 'fv', 'hcdc'].includes(cat.toLowerCase())
  ))];

  return (
    <div className="py-8 px-4 sm:px-8 bg-white" id="products-section">
      {/* Filter Drawer Overlay */}
      {showFilterDrawer && (
        <div 
          className="fixed inset-0 bg-black/40 z-[150] transition-opacity duration-300"
          onClick={() => setShowFilterDrawer(false)}
        />
      )}

      {/* Filter Drawer Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white z-[200] shadow-2xl transform transition-transform duration-300 ease-in-out p-8 flex flex-col ${showFilterDrawer ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-widest">Filters</h2>
          <button onClick={() => setShowFilterDrawer(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {/* CATEGORY Accordion */}
          <div className="border-b border-gray-100 pb-4">
            <button 
              onClick={() => setOpenFilterAccordion(openFilterAccordion === 'CATEGORY' ? null : 'CATEGORY')}
              className="w-full flex items-center justify-between py-4 group"
            >
              <span className="text-sm font-black text-gray-400 group-hover:text-gray-900 tracking-[0.2em] transition-colors uppercase">CATEGORY</span>
              <ChevronDown size={18} className={`text-gray-400 group-hover:text-gray-900 transition-transform ${openFilterAccordion === 'CATEGORY' ? 'rotate-180' : ''}`} />
            </button>
            {openFilterAccordion === 'CATEGORY' && (
              <div className="space-y-3 pl-2 animate-in slide-in-from-top-2 duration-300">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`block w-full text-left py-1 text-sm font-bold transition-all ${selectedCategory === cat ? 'text-[#006d5b] translate-x-2' : 'text-gray-500 hover:text-gray-900 hover:translate-x-1'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PRICE Accordion (Sorting) */}
          <div className="border-b border-gray-100 pb-4">
            <button 
              onClick={() => setOpenFilterAccordion(openFilterAccordion === 'PRICE' ? null : 'PRICE')}
              className="w-full flex items-center justify-between py-4 group"
            >
              <span className="text-sm font-black text-gray-400 group-hover:text-gray-900 tracking-[0.2em] transition-colors uppercase">PRICE</span>
              <ChevronDown size={18} className={`text-gray-400 group-hover:text-gray-900 transition-transform ${openFilterAccordion === 'PRICE' ? 'rotate-180' : ''}`} />
            </button>
            {openFilterAccordion === 'PRICE' && (
              <div className="space-y-3 pl-2 animate-in slide-in-from-top-2 duration-300">
                <button
                  onClick={() => setSortBy('price-low-high')}
                  className={`block w-full text-left py-1 text-sm font-bold transition-all ${sortBy === 'price-low-high' ? 'text-[#006d5b] translate-x-2' : 'text-gray-500 hover:text-gray-900 hover:translate-x-1'}`}
                >
                  Price, low to high
                </button>
                <button
                  onClick={() => setSortBy('price-high-low')}
                  className={`block w-full text-left py-1 text-sm font-bold transition-all ${sortBy === 'price-high-low' ? 'text-[#006d5b] translate-x-2' : 'text-gray-500 hover:text-gray-900 hover:translate-x-1'}`}
                >
                  Price, high to low
                </button>
                <button
                  onClick={() => setSortBy('newest')}
                  className={`block w-full text-left py-1 text-sm font-bold transition-all ${sortBy === 'newest' ? 'text-[#006d5b] translate-x-2' : 'text-gray-500 hover:text-gray-900 hover:translate-x-1'}`}
                >
                  Newest first
                </button>
              </div>
            )}
          </div>

          {/* PRICE RANGE (Slider) */}
          <div className="pt-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Price Range Limit</h3>
            <div className="space-y-4">
              <input 
                type="range" 
                min="0" 
                max="5000" 
                step="50"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full accent-[#006d5b]"
              />
              <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span>₹0</span>
                <span>₹{priceRange[1]}</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setShowFilterDrawer(false)}
          className="mt-auto w-full py-4 bg-[#006d5b] text-white font-black uppercase tracking-widest rounded-md active:scale-95 transition-transform"
        >
          Apply Filters
        </button>
      </div>

      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 py-6 border-y border-gray-100">
        <button 
          onClick={() => setShowFilterDrawer(true)}
          className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors font-bold text-sm text-gray-600 group"
        >
          <SlidersHorizontal size={18} className="group-hover:text-[#006d5b] transition-colors" />
          Filter
        </button>

        <div className="text-sm font-black text-gray-400 uppercase tracking-widest">
          {products.length} products
        </div>

        <div className="hidden md:block w-32"></div> {/* Spacer to keep count centered */}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-20 px-2">
        {filteredProducts.map((product) => {
          const minPrice = getMinPrice(product);
          const isSoldOut = product.stock_quantity === 0;

          return (
            <div key={product.id} className="group flex flex-col h-full animate-in fade-in duration-500 bg-white p-4 rounded-3xl border border-transparent hover:border-gray-100 transition-all duration-300">
              {/* Image Container */}
              <div 
                className="aspect-square bg-[#f9fafb] rounded-2xl mb-8 flex items-center justify-center p-10 relative cursor-pointer overflow-hidden border border-gray-200 group-hover:border-teal-500/20 group-hover:shadow-xl transition-all duration-500"
                onClick={() => setSelectedProduct(product)}
              >
                {product.discount && (
                  <div className="absolute top-5 left-5 bg-orange-500 text-white text-[10px] font-black px-2.5 py-1.5 rounded-md z-10 uppercase tracking-widest shadow-sm">
                    -{product.discount}%
                  </div>
                )}
                
                {/* Wishlist Button - Top Right (Visible on hover or if in wishlist) */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleWishlist(product);
                  }}
                  className={`absolute top-5 right-5 p-2.5 bg-white rounded-full shadow-lg transition-all z-20 ${
                    isItemInWishlist(product.id) 
                      ? 'text-red-500 scale-110 opacity-100' 
                      : 'text-gray-300 hover:text-red-500 hover:scale-110 md:opacity-0 md:group-hover:opacity-100'
                  }`}
                >
                  <Heart size={20} className={isItemInWishlist(product.id) ? 'fill-current' : ''} />
                </button>

                {isSoldOut && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                    <span className="bg-white/90 text-gray-400 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-sm border border-gray-100">
                      Sold Out
                    </span>
                  </div>
                )}
                
                <img 
                  src={product.images?.[0] || '📦'} 
                  alt={product.name} 
                  className={`w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 ${isSoldOut ? 'grayscale' : ''}`} 
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col flex-1 space-y-3 px-1">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-gray-800 line-clamp-2 min-h-[2.5rem] group-hover:text-[#006d5b] transition-colors cursor-pointer leading-relaxed" onClick={() => setSelectedProduct(product)}>
                    {product.name}
                  </h3>
                  
                  <div className="flex flex-col">
                    <span className="text-base font-black text-gray-900">
                      {product.variants?.length > 0 ? 'from ' : ''}₹{minPrice.toLocaleString()}
                    </span>
                    {product.discount && (
                      <span className="text-xs text-gray-300 line-through font-bold">₹{Math.round(minPrice * 1.2).toLocaleString()}</span>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-2">
                  <button 
                    disabled={isSoldOut}
                    onClick={() => handleAddToCart(product)}
                    className={`w-full py-3 rounded-tl-[30px] rounded-br-[30px] rounded-tr-none rounded-bl-none font-black text-[11px] uppercase tracking-[0.2em] transition-all ${
                      isSoldOut 
                        ? 'bg-[#004d44] text-white/50 cursor-not-allowed' 
                        : 'bg-[#006d5b] text-white hover:bg-[#005c4b] active:scale-[0.98]'
                    }`}
                  >
                    {isSoldOut ? 'SOLD OUT' : 'ADD TO CART'}
                  </button>
                  
                  {!isSoldOut && (
                    <button 
                      onClick={() => handleBuyNow(product)}
                      className="w-full py-3 rounded-md border-2 border-[#006d5b] text-[#006d5b] font-black text-[11px] uppercase tracking-[0.1em] hover:bg-[#006d5b]/5 transition-all active:scale-[0.98]"
                    >
                      BUY IT NOW
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white animate-in fade-in duration-300 overflow-hidden" onClick={() => setSelectedProduct(null)}>
          {/* Top Navbar Integration */}
          <div onClick={(e) => e.stopPropagation()}>
            <Navbar />
          </div>

          {/* Modal Content Scrollable Area */}
          <div 
            className="flex-1 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
              {/* Breadcrumbs / Back button */}
              <button 
                onClick={() => setSelectedProduct(null)}
                className="flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold text-sm mb-8 transition-colors group"
              >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                BACK TO PRODUCTS
              </button>

              <div className="flex flex-col lg:flex-row gap-16 mb-24">
                {/* Left: Vertical Thumbnails and Main Image */}
                <div className="w-full lg:w-3/5 flex gap-6">
                  {/* Thumbnails Column */}
                  <div className="hidden md:flex flex-col gap-4 w-20">
                    {selectedProduct.images?.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-20 h-20 rounded-lg border-2 transition-all overflow-hidden bg-gray-50 flex items-center justify-center p-2 ${
                          activeImageIndex === idx ? 'border-[#006d5b] shadow-md' : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>

                  {/* Main Image View */}
                  <div className="flex-1 bg-white rounded-2xl overflow-hidden flex items-center justify-center relative group min-h-[400px] md:min-h-[600px] border border-gray-50">
                    {selectedProduct.images && selectedProduct.images.length > 0 ? (
                      <img 
                        src={selectedProduct.images[activeImageIndex]} 
                        alt={selectedProduct.name} 
                        className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="text-9xl">📦</div>
                    )}
                    
                    {/* Mobile Navigation Arrows */}
                    <div className="md:hidden">
                      <button 
                        onClick={() => setActiveImageIndex(prev => prev === 0 ? selectedProduct.images.length - 1 : prev - 1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button 
                        onClick={() => setActiveImageIndex(prev => prev === selectedProduct.images.length - 1 ? 0 : prev + 1)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Product Info Panel */}
                <div className="w-full lg:w-2/5 space-y-8">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
                      {selectedProduct.name}
                    </h1>
                    <div className="flex items-center gap-4">
                      <div className="flex text-orange-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className={i < 4 ? "fill-current" : "fill-none"} />
                        ))}
                      </div>
                      <span className="text-gray-400 font-bold text-sm tracking-wide">4.6 (64)</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em]">MRP.</p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-black text-[#006d5b]">
                        ₹{(selectedVariant ? selectedVariant.price : selectedProduct.price).toLocaleString()}
                      </span>
                      <p className="text-gray-400 text-xs font-bold">Inclusive of all taxes. Shipping calculated at checkout.</p>
                    </div>
                  </div>

                  {/* Variant Selection Boxes */}
                  {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-3">
                        {selectedProduct.variants.map((variant, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedVariant(variant)}
                            className={`flex flex-col items-center justify-center px-6 py-3 rounded-md border-2 transition-all min-w-[120px] ${
                              selectedVariant?.size === variant.size
                                ? 'border-[#006d5b] bg-[#006d5b]/5'
                                : 'border-gray-100 hover:border-gray-200'
                            }`}
                          >
                            <div className={`text-xs font-black uppercase mb-1 ${selectedVariant?.size === variant.size ? 'text-[#006d5b]' : 'text-gray-400'}`}>
                              {variant.size}
                            </div>
                            <div className={`text-sm font-bold ${selectedVariant?.size === variant.size ? 'text-[#006d5b]' : 'text-gray-900'}`}>
                              ₹{variant.price}
                            </div>
                            {selectedVariant?.size === variant.size && (
                              <div className="absolute -top-2 -right-2 bg-[#006d5b] text-white rounded-full p-1 shadow-md">
                                <Check size={10} />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity and Add to Cart */}
                  <div className="space-y-6 pt-4">
                    <div className="space-y-3">
                      <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">QUANTITY</p>
                      <div className="flex items-center w-32 border-2 border-gray-100 rounded-md overflow-hidden h-12">
                        <button 
                          onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                          className="flex-1 flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <div className="flex-1 flex items-center justify-center font-bold text-gray-900">
                          {quantity}
                        </div>
                        <button 
                          onClick={() => setQuantity(prev => prev + 1)}
                          className="flex-1 flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Subscription Option Mock */}
                      <div className="border-2 border-gray-50 rounded-lg overflow-hidden">
                        <label className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50">
                          <input type="radio" name="purchase_type" defaultChecked className="accent-[#006d5b] w-4 h-4" />
                          <span className="text-sm font-black uppercase text-gray-900 tracking-tight">ONE TIME PURCHASE</span>
                        </label>
                        <label className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors opacity-50">
                          <input type="radio" name="purchase_type" className="accent-[#006d5b] w-4 h-4" />
                          <div className="flex-1">
                            <span className="text-sm font-black uppercase text-gray-900 tracking-tight">SUBSCRIBE AND DELIVER EVERY</span>
                            <div className="inline-block ml-4 px-3 py-1 border rounded text-xs">15 days</div>
                          </div>
                        </label>
                      </div>

                      <button 
                        onClick={() => handleAddToCart(selectedProduct, selectedProduct.images[activeImageIndex], selectedVariant)}
                        className="w-full py-5 bg-[#006d5b] text-white rounded-tl-[30px] rounded-br-[30px] rounded-tr-none rounded-bl-none font-black uppercase tracking-[0.2em] hover:bg-[#005c4b] transition-all flex items-center justify-center gap-3 shadow-xl shadow-teal-900/10 active:scale-[0.98]"
                      >
                        <ShoppingCart size={20} />
                        ADD TO CART
                      </button>
                    </div>
                  </div>

                  {/* Product Details Text */}
                  <div className="space-y-8 pt-12 border-t border-gray-100">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
                        {selectedProduct.description.split('.')[0]}.
                      </h3>
                      <p className="text-gray-500 font-medium leading-relaxed">
                        {selectedProduct.description}
                      </p>
                    </div>

                    {selectedProduct.ingredients && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">INGREDIENTS:</h4>
                        <p className="text-gray-500 font-medium leading-relaxed text-sm">
                          {selectedProduct.ingredients}
                        </p>
                      </div>
                    )}

                    {/* Accordion Sections */}
                    <div className="border-t border-gray-100">
                      {[
                        { title: 'ADDITIONAL INFORMATION', content: selectedProduct.uses },
                        { title: 'DOSAGE', content: selectedProduct.dose },
                        { title: 'BEST BEFORE', content: selectedProduct.expiry_date ? new Date(selectedProduct.expiry_date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : null }
                      ].map((section, idx) => (
                        section.content && (
                          <div key={idx} className="border-b border-gray-100">
                            <button 
                              onClick={() => setOpenAccordion(openAccordion === idx ? null : idx)}
                              className="w-full py-6 flex items-center justify-between group"
                            >
                              <span className="text-xs font-black text-gray-400 group-hover:text-gray-900 tracking-[0.2em] transition-colors uppercase">{section.title}</span>
                              <ChevronDown size={18} className={`text-gray-400 group-hover:text-gray-900 transition-transform ${openAccordion === idx ? 'rotate-180' : ''}`} />
                            </button>
                            {openAccordion === idx && (
                              <div className="pb-6 animate-in slide-in-from-top-2 duration-300">
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">{section.content}</p>
                              </div>
                            )}
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* "You may also like" Section */}
              <div className="mb-32">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">You may also like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                  {products.filter(p => p.id !== selectedProduct.id && p.category === selectedProduct.category).slice(0, 5).map((product) => (
                    <div key={product.id} className="group flex flex-col h-full bg-white rounded-xl border border-transparent hover:border-gray-100 transition-all p-4">
                      <div 
                        className="aspect-square bg-white mb-6 flex items-center justify-center cursor-pointer group-hover:scale-105 transition-transform duration-500"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <img src={product.images?.[0] || '📦'} alt={product.name} className="w-full h-full object-contain" />
                      </div>
                      <h3 className="text-sm font-black text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
                      <p className="text-sm font-bold text-gray-900 mb-6">₹{product.price}</p>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="w-full py-3 bg-[#006d5b] text-white rounded-tl-[30px] rounded-br-[30px] rounded-tr-none rounded-bl-none text-xs font-black uppercase tracking-[0.2em] hover:bg-[#005c4b] transition-all"
                      >
                        ADD TO CART
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Reviews Section */}
              <div className="mb-24">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Product Reviews</h2>
                    <button className="text-xs font-black text-gray-400 hover:text-gray-900 underline tracking-widest uppercase">Write a review</button>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className="text-7xl font-black text-gray-900">4.6</span>
                    <div className="space-y-1">
                      <div className="flex text-orange-500">
                        {[...Array(5)].map((_, i) => <Star key={i} size={20} className="fill-current" />)}
                      </div>
                      <p className="text-xs font-bold text-gray-400 tracking-widest">64 REVIEWS</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-12 border-t border-gray-100">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="pt-12 flex flex-col md:flex-row gap-8 md:gap-24 group">
                      <div className="md:w-64 flex items-center gap-4">
                        <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center text-[#006d5b] font-black">
                          {review.user.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-black text-gray-900 text-sm flex items-center gap-2">
                            {review.user}
                            <Check size={14} className="bg-[#006d5b] text-white rounded-full p-0.5" />
                          </h4>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{review.location}</p>
                        </div>
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex text-orange-500">
                            {[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < review.rating ? "fill-current" : "text-gray-200"} />)}
                          </div>
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{review.date}</span>
                        </div>
                        <p className="text-gray-600 font-bold leading-relaxed">{review.comment || 'Good product.'}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-20 text-center">
                  <button className="px-12 py-4 border-2 border-gray-100 text-xs font-black text-gray-400 hover:text-gray-900 hover:border-gray-200 transition-all uppercase tracking-widest">
                    SHOW MORE
                  </button>
                </div>
              </div>
            </div>
            
            {/* Footer Integration */}
            <Footer />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsSection;