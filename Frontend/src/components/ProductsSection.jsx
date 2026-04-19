import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { Heart, Star, X, ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart, ChevronDown, Check, SlidersHorizontal, Truck, MapPin } from 'lucide-react';
import { translations } from '../translations';
import Navbar from './Navbar';
import Footer from './Footer';

const ProductsSection = ({ selectedCategory: propCategory, searchQuery }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
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
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);

  // Filter & Sort States
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [sortBy, setSortBy] = useState('price-low-high');
  const [selectedCategory, setSelectedCategory] = useState(propCategory || 'All');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [openFilterAccordion, setOpenFilterAccordion] = useState('CATEGORY');

  // Temporary Filter States (inside drawer)
  const [tempSortBy, setTempSortBy] = useState('price-low-high');
  const [tempCategory, setTempCategory] = useState(propCategory || 'All');
  const [tempPriceRange, setTempPriceRange] = useState([0, 5000]);

  // Sync temp states when drawer opens
  useEffect(() => {
    if (showFilterDrawer) {
      setTempSortBy(sortBy);
      setTempCategory(selectedCategory);
      setTempPriceRange(priceRange);
    }
  }, [showFilterDrawer, sortBy, selectedCategory, priceRange]);

  // Update internal category state when prop changes
  useEffect(() => {
    if (propCategory) {
      setSelectedCategory(propCategory);
    } else if (propCategory === null) {
      // If we're on the home page root with no query params (Home button scenario)
      if (location.pathname === '/' && !location.search) {
        setSortBy('price-low-high');
        setSelectedCategory('All');
        setPriceRange([0, 5000]);

        setTempSortBy('price-low-high');
        setTempCategory('All');
        setTempPriceRange([0, 5000]);
      }
    }
  }, [propCategory, location.pathname, location.search, location.key]);


  useEffect(() => {
    fetchProducts();
  }, []);

  // Reset active image and variant when product changes
  useEffect(() => {
    if (selectedProduct && !selectedProduct.isFullyLoaded) {
      setActiveImageIndex(0);
      setSelectedVariant(selectedProduct.variants?.[0] || null);
      fetchReviews(selectedProduct.id);
      fetchProductDetail(selectedProduct.id);
      setPincode('');
      setPincodeStatus(null);
    }
  }, [selectedProduct]);

  const fetchReviews = async (productId) => {
    try {
      setReviewsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reviews/product/${productId}/`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchProductDetail = async (productId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/public/${productId}/`);
      if (response.ok) {
        const data = await response.json();
        // Update selected product with fresh data from backend
        setSelectedProduct(prev => ({ ...prev, ...data, isFullyLoaded: true }));
        
        // If variants exist and none is selected, select the first one
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching product details:', err);
    }
  };

  const handleCheckPincode = async () => {
    if (pincode.length !== 6) {
      setPincodeStatus('invalid');
      return;
    }
    setIsCheckingPincode(true);
    // Mocking an API call
    setTimeout(() => {
      setIsCheckingPincode(false);
      setPincodeStatus('valid');
    }, 800);
  };

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

 

  const getMinPrice = (product) => {
    if (product.variants && product.variants.length > 0) {
      return Math.min(...product.variants.map(v => v.price));
    }
    return product.price;
  };

  const filteredProducts = products.filter(product => {
    const productPrice = getMinPrice(product);
    const matchesCategory = selectedCategory && selectedCategory !== 'All'
      ? product.category?.toLowerCase() === selectedCategory.toLowerCase()
      : true;

    const matchesSearch = searchQuery
      ? (product.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (product.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (product.category?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      : true;

    const matchesPrice = productPrice >= priceRange[0] && productPrice <= priceRange[1];
    // Show if is_active is true (or undefined for backward compatibility)
    const isAvailable = product.is_active !== false; 

    return matchesCategory && matchesSearch && matchesPrice && isAvailable;
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
                    onClick={() => setTempCategory(cat)}
                    className={`block w-full text-left py-1 text-sm font-bold transition-all ${tempCategory === cat ? 'text-[#006d5b] translate-x-2' : 'text-gray-500 hover:text-gray-900 hover:translate-x-1'}`}
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
                  onClick={() => setTempSortBy('price-low-high')}
                  className={`block w-full text-left py-1 text-sm font-bold transition-all ${tempSortBy === 'price-low-high' ? 'text-[#006d5b] translate-x-2' : 'text-gray-500 hover:text-gray-900 hover:translate-x-1'}`}
                >
                  Price, low to high
                </button>
                <button
                  onClick={() => setTempSortBy('price-high-low')}
                  className={`block w-full text-left py-1 text-sm font-bold transition-all ${tempSortBy === 'price-high-low' ? 'text-[#006d5b] translate-x-2' : 'text-gray-500 hover:text-gray-900 hover:translate-x-1'}`}
                >
                  Price, high to low
                </button>
                <button
                  onClick={() => setTempSortBy('newest')}
                  className={`block w-full text-left py-1 text-sm font-bold transition-all ${tempSortBy === 'newest' ? 'text-[#006d5b] translate-x-2' : 'text-gray-500 hover:text-gray-900 hover:translate-x-1'}`}
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
                value={tempPriceRange[1]}
                onChange={(e) => setTempPriceRange([0, parseInt(e.target.value)])}
                className="w-full accent-[#006d5b]"
              />
              <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span>₹0</span>
                <span>₹{tempPriceRange[1]}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto space-y-4">
          <button
            onClick={() => {
              setSortBy(tempSortBy);
              setSelectedCategory(tempCategory);
              setPriceRange(tempPriceRange);
              setShowFilterDrawer(false);
            }}
            className="w-full py-4 bg-[#006d5b] text-white font-black uppercase tracking-widest rounded-md active:scale-95 transition-transform"
          >
            Apply Filters
          </button>

          <button
            onClick={() => {
              const defaultSortBy = 'price-low-high';
              const defaultCategory = 'All';
              const defaultPriceRange = [0, 5000];

              setTempSortBy(defaultSortBy);
              setTempCategory(defaultCategory);
              setTempPriceRange(defaultPriceRange);

              setSortBy(defaultSortBy);
              setSelectedCategory(defaultCategory);
              setPriceRange(defaultPriceRange);
              setShowFilterDrawer(false);
            }}
            className="w-full py-3 border border-gray-200 text-gray-400 font-black uppercase tracking-widest text-[10px] rounded-md hover:bg-gray-50 transition-colors"
          >
            Clear All
          </button>
        </div>
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
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-12 gap-y-10 sm:gap-y-20 px-1 sm:px-2">
        {filteredProducts.map((product) => {
          const minPrice = getMinPrice(product);
          return (
            <div key={product.id} className="group flex flex-col h-full animate-in fade-in duration-500 bg-white p-2 sm:p-4 rounded-2xl sm:rounded-3xl border border-transparent hover:border-gray-100 transition-all duration-300">
              {/* Image Container */}
              <div
                className="aspect-square bg-[#f9fafb] rounded-xl sm:rounded-2xl mb-3 sm:mb-8 flex items-center justify-center p-4 sm:p-10 relative cursor-pointer overflow-hidden border border-gray-200 group-hover:border-teal-500/20 group-hover:shadow-xl transition-all duration-500"
                onClick={() => setSelectedProduct(product)}
              >
                {product.discount && (
                  <div className="absolute top-2 sm:top-5 left-2 sm:left-5 bg-orange-500 text-white text-[8px] sm:text-[10px] font-black px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-md z-10 uppercase tracking-widest shadow-sm">
                    -{product.discount}%
                  </div>
                )}

                {/* Wishlist Button - Top Right (Visible on hover or if in wishlist) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleWishlist(product);
                  }}
                  className={`absolute top-2 sm:top-5 right-2 sm:right-5 p-1.5 sm:p-2.5 bg-white rounded-full shadow-lg transition-all z-20 ${isItemInWishlist(product.id)
                    ? 'text-red-500 scale-110 opacity-100'
                    : 'text-gray-300 hover:text-red-500 hover:scale-110 md:opacity-0 md:group-hover:opacity-100'
                    }`}
                >
                  <Heart size={16} className={isItemInWishlist(product.id) ? 'fill-current' : ''} />
                </button>



                <img
                  src={product.images?.[0] || '📦'}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col flex-1 space-y-2 sm:space-y-3 px-1">
                <div className="space-y-1">
                  <h3 className="text-[11px] sm:text-sm font-bold text-gray-800 line-clamp-2 min-h-[2.5rem] group-hover:text-[#006d5b] transition-colors cursor-pointer leading-tight sm:leading-relaxed" onClick={() => setSelectedProduct(product)}>
                    {product.name}
                  </h3>

                  <div className="flex flex-col">
                    <span className="text-xs sm:text-base font-black text-gray-900">
                      {product.variants?.length > 0 ? 'from ' : ''}₹{minPrice.toLocaleString()}
                    </span>
                    {product.discount && (
                      <span className="text-[10px] sm:text-xs text-gray-300 line-through font-bold">₹{Math.round(minPrice * 1.2).toLocaleString()}</span>
                    )}
                  </div>
                </div>

                <div className="pt-2 sm:pt-4 flex flex-col gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full py-2 sm:py-3 rounded-tl-[15px] sm:rounded-tl-[30px] rounded-br-[15px] sm:rounded-br-[30px] rounded-tr-none rounded-bl-none font-black text-[8px] sm:text-[11px] uppercase tracking-[0.1em] sm:tracking-[0.2em] transition-all bg-[#006d5b] text-white hover:bg-[#005c4b] active:scale-[0.98] cursor-pointer"
                  >
                    ADD TO CART
                  </button>
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
                <div className="w-full lg:w-3/5 flex flex-col md:flex-row gap-6 h-fit lg:sticky lg:top-32">
                  {/* Thumbnails Column */}
                  <div className="hidden md:flex flex-col gap-4 w-24">
                    {selectedProduct.images?.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-24 h-24 rounded-xl border-2 transition-all overflow-hidden bg-white flex items-center justify-center p-2 cursor-pointer ${activeImageIndex === idx ? 'border-[#006d5b] shadow-lg scale-105' : 'border-gray-100 hover:border-gray-300'
                          }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>

                  {/* Mobile Thumbnails (Horizontal) */}
                  <div className="flex md:hidden gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {selectedProduct.images?.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`min-w-[80px] h-20 rounded-lg border-2 transition-all overflow-hidden bg-white flex items-center justify-center p-2 cursor-pointer ${activeImageIndex === idx ? 'border-[#006d5b]' : 'border-gray-100'
                          }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>

                  {/* Main Image View */}
                  <div className="flex-1 bg-white rounded-[32px] overflow-hidden flex items-center justify-center relative min-h-[400px] md:min-h-[700px] border border-gray-100 shadow-sm">
                    {selectedProduct.images && selectedProduct.images.length > 0 ? (
                      <img
                        src={selectedProduct.images[activeImageIndex]}
                        alt={selectedProduct.name}
                        className="w-full h-full object-contain p-4"
                      />
                    ) : (
                      <div className="text-9xl">📦</div>
                    )}
                  </div>

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
                  {( (selectedProduct.variants && selectedProduct.variants.length > 0) || selectedProduct.unit_value || selectedProduct.unit_type || selectedProduct.dose ) && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-4">
                        {/* If variants exist, show them. Otherwise, show a single box with dose or unit info */}
                        {selectedProduct.variants && selectedProduct.variants.length > 0 ? (
                          selectedProduct.variants.map((variant, idx) => {
                            // Smart format for variants: 
                            // 1. If size is just a number (e.g. "50") -> "50 Tablets"
                            // 2. If it already has a unit (e.g. "50ml", "50g") -> keep as is
                            const displaySize = /^\d+$/.test(variant.size.toString()) 
                              ? `${variant.size} ${selectedProduct.unit_type === 'tablet' ? 'Tablets' : selectedProduct.unit_type || ''}`.trim()
                              : variant.size;

                            return (
                              <button
                                key={idx}
                                onClick={() => setSelectedVariant(variant)}
                                className={`group relative flex flex-col w-32 rounded-xl border-2 transition-all overflow-hidden ${
                                  selectedVariant?.size === variant.size
                                    ? 'border-[#4dc7b5] shadow-lg scale-105'
                                    : 'border-gray-100 hover:border-[#4dc7b5]/50'
                                }`}
                              >
                                <div className={`w-full py-2 px-2 text-center text-[11px] font-bold transition-colors ${
                                  selectedVariant?.size === variant.size
                                    ? 'bg-[#4dc7b5] text-white'
                                    : 'bg-gray-50 text-gray-500 group-hover:bg-[#4dc7b5]/10 group-hover:text-[#4dc7b5]'
                                }`}>
                                  {displaySize}
                                </div>
                                <div className="w-full py-3 px-2 bg-white text-center">
                                  <div className={`text-base font-bold ${
                                    selectedVariant?.size === variant.size ? 'text-gray-900' : 'text-gray-600'
                                  }`}>
                                    ₹{variant.price}
                                  </div>
                                </div>
                                {selectedVariant?.size === variant.size && (
                                  <div className="absolute top-1 right-1 bg-white/20 rounded-full p-0.5">
                                    <Check size={8} className="text-white" />
                                  </div>
                                )}
                              </button>
                            );
                          })
                        ) : (
                          /* Default single box when no variants exist */
                          <button
                            className="group relative flex flex-col w-40 rounded-xl border-2 border-[#4dc7b5] shadow-lg scale-105 transition-all overflow-hidden"
                          >
                            <div className="w-full py-2 px-3 text-center text-[10px] font-black bg-[#4dc7b5] text-white uppercase tracking-widest">
                              {selectedProduct.dose 
                                ? (/^\d+$/.test(selectedProduct.dose.toString()) ? `${selectedProduct.dose} Tablets` : selectedProduct.dose)
                                : (selectedProduct.unit_type === 'tablet'
                                  ? `${selectedProduct.unit_value} Tablets`
                                  : `${selectedProduct.unit_value || ''} ${selectedProduct.unit_type || ''}`.trim()) || 'Product Info'}
                            </div>
                            <div className="w-full py-3 px-3 bg-white text-center">
                              <div className="text-base font-bold text-gray-900">
                                ₹{selectedProduct.price}
                              </div>
                            </div>
                            <div className="absolute top-1 right-1 bg-white/20 rounded-full p-0.5">
                              <Check size={8} className="text-white" />
                            </div>
                          </button>
                        )}
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

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => handleAddToCart(selectedProduct, selectedProduct.images[activeImageIndex], selectedVariant)}
                        className="flex-1 py-5 bg-[#006d5b] text-white rounded-tl-[30px] rounded-br-[30px] rounded-tr-none rounded-bl-none font-black uppercase tracking-[0.2em] hover:bg-[#005c4b] transition-all flex items-center justify-center gap-3 shadow-xl shadow-teal-900/10 active:scale-[0.98] cursor-pointer"
                      >
                        <ShoppingCart size={20} />
                        ADD TO CART
                      </button>
                      <button
                        onClick={() => handleToggleWishlist(selectedProduct)}
                        className={`flex-1 py-5 rounded-tl-[30px] rounded-br-[30px] rounded-tr-none rounded-bl-none border-2 transition-all flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] font-black uppercase tracking-[0.2em] text-xs cursor-pointer ${
                          isItemInWishlist(selectedProduct.id)
                            ? 'border-red-500 text-red-500 bg-red-50'
                            : 'border-gray-100 text-gray-400 hover:border-red-200 hover:text-red-400 bg-white'
                        }`}
                      >
                        <Heart size={20} className={isItemInWishlist(selectedProduct.id) ? 'fill-current' : ''} />
                        WISHLIST
                      </button>
                    </div>

                    {/* Delivery Options */}
                    <div className="pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-2 mb-4 text-[#006d5b]">
                        <Truck size={20} className="stroke-[2.5]" />
                        <span className="text-xs font-black uppercase tracking-widest">Delivery options</span>
                      </div>
                      
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#006d5b] transition-colors">
                          <MapPin size={18} />
                        </div>
                        <input
                          type="text"
                          maxLength="6"
                          placeholder="Enter Pincode"
                          value={pincode}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setPincode(val);
                            setPincodeStatus(null);
                          }}
                          className="w-full pl-12 pr-24 py-4 bg-gray-50 border-2 border-transparent focus:border-[#006d5b] focus:bg-white rounded-xl outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                        />
                        <button
                          onClick={handleCheckPincode}
                          disabled={isCheckingPincode || pincode.length !== 6}
                          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gray-900 text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all disabled:bg-gray-200 disabled:text-gray-400"
                        >
                          {isCheckingPincode ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'CHECK'}
                        </button>
                      </div>

                      {pincodeStatus === 'valid' && (
                        <p className="mt-3 text-[10px] font-black text-[#006d5b] uppercase tracking-widest flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                          <Check size={14} />
                          Delivery available at {pincode}
                        </p>
                      )}
                      {pincodeStatus === 'invalid' && (
                        <p className="mt-3 text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                          <X size={14} />
                          Invalid pincode. Please try again.
                        </p>
                      )}
                      
                      <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                        Please enter PIN code to check delivery time & Pay on Delivery availability.
                      </p>
                    </div>
                  </div>

                  {/* Product Details Text */}
                  <div className="space-y-8 pt-12 border-t border-gray-100">
                    {selectedProduct.ingredients && selectedProduct.ingredients.trim() !== "" && (
                      <div className="flex items-baseline gap-2">
                        <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest flex-shrink-0">INGREDIENTS:</h4>
                        <p className="text-gray-500 font-medium leading-relaxed text-sm whitespace-pre-wrap">
                          {selectedProduct.ingredients.split(/[,\n]/).map(i => i.trim()).filter(i => i).join(', ')}
                        </p>
                      </div>
                    )}

                    {/* Accordion Sections */}
                    <div className="border-t border-gray-100">
                      {[
                        { 
                          title: 'ADDITIONAL INFORMATION:', 
                          content: (
                            <div className="space-y-8 py-2">
                              {/* Detailed Description */}
                              <div className="space-y-2">
                                <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Description:</h4>
                                <p className="text-gray-500 font-medium leading-relaxed text-sm">{selectedProduct.description}</p>
                              </div>

                              {/* Uses */}
                              {selectedProduct.uses && (
                                <div className="space-y-2">
                                  <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Uses:</h4>
                                  <p className="text-gray-500 font-medium leading-relaxed text-sm">{selectedProduct.uses}</p>
                                </div>
                              )}

                              {/* Contra Indications */}
                              {selectedProduct.contra_indications && (
                                <div className="space-y-2">
                                  <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Contra Indications:</h4>
                                  <p className="text-gray-500 font-medium leading-relaxed text-sm">{selectedProduct.contra_indications}</p>
                                </div>
                              )}

                              {/* Best Before */}
                              {selectedProduct.expiry_date && (
                                <div className="space-y-2">
                                  <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Best Before:</h4>
                                  <p className="text-gray-500 font-medium leading-relaxed text-sm">
                                    {new Date(selectedProduct.expiry_date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                                  </p>
                                </div>
                              )}
                            </div>
                          )
                        }
                      ].map((section, idx) => (
                        section.content && (
                          <div key={idx} className="border-b border-gray-100">
                            <button
                              onClick={() => setOpenAccordion(openAccordion === idx ? null : idx)}
                              className="w-full py-6 flex items-center justify-between group cursor-pointer"
                            >
                              <span className="text-xs font-black text-gray-900 tracking-[0.1em] transition-colors uppercase">{section.title}</span>
                              <ChevronDown size={18} className={`text-gray-400 group-hover:text-gray-900 transition-transform duration-300 ${openAccordion === idx ? 'rotate-180' : ''}`} />
                            </button>
                            {openAccordion === idx && (
                              <div className="pb-6 animate-in slide-in-from-top-2 duration-300">
                                <div className="text-sm text-gray-500 font-medium leading-relaxed">{section.content}</div>
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
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">Similar Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                  {products.filter(p => p.id !== selectedProduct.id && p.category === selectedProduct.category && p.stock_quantity > 0).slice(0, 5).map((product) => (
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
                        className="w-full py-3 bg-[#006d5b] text-white rounded-tl-[30px] rounded-br-[30px] rounded-tr-none rounded-bl-none text-xs font-black uppercase tracking-[0.2em] hover:bg-[#005c4b] transition-all cursor-pointer"
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
                    <span className="text-7xl font-black text-gray-900">
                      {reviews.length > 0
                        ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
                        : '0.0'
                      }
                    </span>
                    <div className="space-y-1">
                      <div className="flex text-orange-500">
                        {[...Array(5)].map((_, i) => {
                          const avgRating = reviews.length > 0
                            ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length
                            : 0;
                          return <Star key={i} size={20} className={i < Math.round(avgRating) ? "fill-current" : "text-gray-200"} />;
                        })}
                      </div>
                      <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">{reviews.length} REVIEWS</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-12 border-t border-gray-100">
                  {reviewsLoading ? (
                    <div className="py-12 flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#006d5b]"></div>
                    </div>
                  ) : reviews.length === 0 ? (
                    <div className="py-20 text-center">
                      <p className="text-gray-500 font-bold">No reviews yet for this product.</p>
                      <p className="text-sm text-gray-400 mt-2 tracking-wide uppercase">Be the first to share your thoughts!</p>
                    </div>
                  ) : (
                    reviews.map((review, idx) => (
                      <div key={idx} className="pt-12 flex flex-col md:flex-row gap-8 md:gap-24 group">
                        <div className="md:w-64 flex items-center gap-4">
                          <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center text-[#006d5b] font-black">
                            {review.user_name?.charAt(0) || 'A'}
                          </div>
                          <div>
                            <h4 className="font-black text-gray-900 text-sm flex items-center gap-2">
                              {review.user_name}
                              <Check size={14} className="bg-[#006d5b] text-white rounded-full p-0.5" />
                            </h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Verified Buyer</p>
                          </div>
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex text-orange-500">
                              {[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < review.rating ? "fill-current" : "text-gray-200"} />)}
                            </div>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                              {new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-600 font-bold leading-relaxed">{review.review_text || 'Good product.'}</p>
                        </div>
                      </div>
                    ))
                  )}
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
