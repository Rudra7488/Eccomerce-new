import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  X, 
  Upload, 
  Package, 
  Tag, 
  IndianRupee, 
  Layers,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';

const ProductManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: 0,
    category: '',
    is_active: true
  });
  
  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      window.location.href = '/login';
    }
  }, []);
  
  const currentUser = useSelector(state => state.user);

  useEffect(() => {
    if (currentUser) {
      fetchProducts();
    }
  }, [currentUser]);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        description: editingProduct.description || '',
        price: editingProduct.price || '',
        stock_quantity: editingProduct.stock_quantity || 0,
        category: editingProduct.category || '',
        is_active: editingProduct.is_active || true
      });
      if (editingProduct.images && editingProduct.images.length > 0) {
        setUploadedImages(editingProduct.images.map(img => ({
          url: img,
          file: null
        })));
      }
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock_quantity: 0,
        category: '',
        is_active: true
      });
      setUploadedImages([]);
    }
  }, [editingProduct]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = currentUser?.role === 'admin' 
        ? `${import.meta.env.VITE_API_BASE_URL}/api/vendor-admin/products/`
        : `${import.meta.env.VITE_API_BASE_URL}/api/vendor-admin/vendor/products/`;
        
      const token = localStorage.getItem('accessToken');
      
      if (!token) throw new Error('Authentication token not found');
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      toast.error('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    (product.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (product.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (product.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleDeleteProduct = async (productId) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-medium">Are you sure you want to delete this product?</p>
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 text-sm bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              await executeDelete(productId);
            }}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const executeDelete = async (productId) => {
    const loadingToast = toast.loading('Deleting product...');
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vendor-admin/products/${productId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchProducts();
        toast.success('Product deleted successfully', { id: loadingToast });
      } else {
        toast.error('Failed to delete product', { id: loadingToast });
      }
    } catch (err) {
      toast.error('An error occurred', { id: loadingToast });
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedImages(prev => [...prev, { file, url: e.target.result }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateProduct = async () => {
    const loadingToast = toast.loading('Creating product...');
    try {
      const imageUrls = uploadedImages.map(image => image.url);
      const productData = { ...formData, images: imageUrls };
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vendor-admin/products/create/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });
      
      if (response.ok) {
        setShowForm(false);
        fetchProducts();
        toast.success('Product created successfully!', { id: loadingToast });
      } else {
        toast.error('Failed to create product', { id: loadingToast });
      }
    } catch (error) {
      toast.error('An error occurred', { id: loadingToast });
    }
  };

  const handleUpdateProduct = async () => {
    const loadingToast = toast.loading('Updating product...');
    try {
      const imageUrls = uploadedImages.map(image => image.url);
      const productData = { ...formData, images: imageUrls };
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vendor-admin/products/${editingProduct.id}/update/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });
      
      if (response.ok) {
        setShowForm(false);
        fetchProducts();
        toast.success('Product updated successfully!', { id: loadingToast });
      } else {
        toast.error('Failed to update product', { id: loadingToast });
      }
    } catch (error) {
      toast.error('An error occurred', { id: loadingToast });
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#F9FAFB] tracking-tight">Product Catalog</h1>
            <p className="text-gray-400 mt-1 flex items-center gap-2">
              <Layers size={16} />
              {currentUser?.role === 'admin' ? 'Administrative Control Center' : 'Vendor Dashboard'}
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-3.5 bg-[#111827] text-[#F9FAFB] border border-gray-800 rounded-2xl w-full md:w-80 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none shadow-sm"
              />
            </div>
            <button
              onClick={() => {
                setEditingProduct(null);
                setUploadedImages([]);
                setShowForm(true);
              }}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#6366F1] text-white rounded-2xl font-bold hover:bg-[#4F46E5] hover:scale-105 transition-all shadow-lg shadow-indigo-500/20"
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-80 bg-[#111827] rounded-3xl border border-gray-800 shadow-sm">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-gray-800 border-t-[#6366F1] animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-400 font-medium">Fetching your products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="bg-[#111827] rounded-3xl shadow-sm border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0F172A] border-b border-gray-800">
                    <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Product Detail</th>
                    <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Pricing</th>
                    <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Inventory</th>
                    <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-2xl bg-[#0F172A] overflow-hidden border border-gray-800 flex-shrink-0">
                            {product.images?.[0] ? (
                              <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-600">
                                <Package size={24} />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-[#F9FAFB] truncate">{product.name}</h3>
                            <p className="text-sm text-gray-400 truncate max-w-[200px]">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F172A] text-gray-400 text-xs font-bold">
                          <Tag size={12} />
                          {product.category || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center text-[#F9FAFB] font-bold">
                          <IndianRupee size={14} />
                          <span>{product.price.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <span className={`text-sm font-bold ${product.stock_quantity < 10 ? 'text-orange-400' : 'text-gray-400'}`}>
                            {product.stock_quantity} Units
                          </span>
                          <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${product.stock_quantity < 10 ? 'bg-orange-500' : 'bg-emerald-500'}`}
                              style={{ width: `${Math.min(product.stock_quantity, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        {product.is_active ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg text-xs font-bold">
                            <CheckCircle size={12} /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-gray-400 bg-white/5 px-2.5 py-1 rounded-lg text-xs font-bold">
                            <AlertCircle size={12} /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => {
                              setEditingProduct(product);
                              setShowForm(true);
                            }}
                            className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                            title="Edit Product"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                            title="Delete Product"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button 
                            onClick={() => {
                              setViewingProduct(product);
                              setShowViewModal(true);
                            }}
                            className="p-2.5 rounded-xl bg-white/5 text-gray-400 hover:bg-[#6366F1] hover:text-white transition-all shadow-sm"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-[#111827] rounded-3xl border border-dashed border-gray-800 p-20 text-center">
            <div className="bg-[#0F172A] h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={40} className="text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-[#F9FAFB]">No products found</h3>
            <p className="text-gray-400 mt-2 max-w-xs mx-auto">Try adjusting your search or add a new product to get started.</p>
          </div>
        )}
      </div>

      {/* Modern Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[100] transition-all">
          <div className="bg-[#111827] rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300 border border-gray-800">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-800 flex items-center justify-between bg-[#111827] sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-black text-[#F9FAFB]">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </h2>
                <p className="text-gray-400 text-sm">Enter the details of your masterpiece</p>
              </div>
              <button 
                onClick={() => setShowForm(false)}
                className="p-3 bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-400 rounded-2xl transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-8 overflow-y-auto custom-scrollbar">
              <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
                {/* Basic Info Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-[#6366F1] font-bold text-sm uppercase tracking-wider">
                    <span className="h-1 w-6 bg-[#6366F1] rounded-full"></span>
                    General Information
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 ml-1">Product Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Premium Silk Scarf"
                      className="w-full px-5 py-4 bg-[#0F172A] text-[#F9FAFB] border border-gray-800 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 ml-1">Detailed Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows="4"
                      placeholder="Tell customers about your product's story, materials, and unique features..."
                      className="w-full px-5 py-4 bg-[#0F172A] text-[#F9FAFB] border border-gray-800 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Pricing & Stock Section */}
                <div className="space-y-6 pt-2">
                  <div className="flex items-center gap-2 text-[#6366F1] font-bold text-sm uppercase tracking-wider">
                    <span className="h-1 w-6 bg-[#6366F1] rounded-full"></span>
                    Inventory & Pricing
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-400 ml-1">Price (INR)</label>
                      <div className="relative group">
                        <IndianRupee size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6366F1] transition-colors" />
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                          className="w-full pl-12 pr-5 py-4 bg-[#0F172A] text-[#F9FAFB] border border-gray-800 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-400 ml-1">Stock Level</label>
                      <div className="relative group">
                        <Layers size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6366F1] transition-colors" />
                        <input
                          type="number"
                          value={formData.stock_quantity}
                          onChange={(e) => setFormData({...formData, stock_quantity: parseInt(e.target.value) || 0})}
                          className="w-full pl-12 pr-5 py-4 bg-[#0F172A] text-[#F9FAFB] border border-gray-800 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 ml-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-5 py-4 bg-[#0F172A] text-[#F9FAFB] border border-gray-800 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none appearance-none"
                    >
                      <option value="">Select Category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Home">Home & Living</option>
                      <option value="Beauty">Beauty</option>
                      <option value="Books">Books</option>
                    </select>
                  </div>
                </div>

                {/* Media Section */}
                <div className="space-y-6 pt-2">
                  <div className="flex items-center gap-2 text-[#6366F1] font-bold text-sm uppercase tracking-wider">
                    <span className="h-1 w-6 bg-[#6366F1] rounded-full"></span>
                    Product Visuals
                  </div>
                  
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      id="image-upload"
                      className="hidden"
                    />
                    <label 
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-800 rounded-3xl bg-[#0F172A] hover:bg-[#111827] hover:border-[#6366F1] transition-all cursor-pointer group"
                    >
                      <div className="bg-[#111827] p-4 rounded-2xl shadow-sm group-hover:scale-110 transition-transform mb-3">
                        <Upload size={24} className="text-[#6366F1]" />
                      </div>
                      <span className="text-sm font-bold text-[#F9FAFB]">Drop images here or click to browse</span>
                      <span className="text-xs text-gray-400 mt-1">Supports: JPG, PNG, WEBP (Max 5MB)</span>
                    </label>
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative group aspect-square">
                          <img 
                            src={image.url} 
                            alt="" 
                            className="w-full h-full object-cover rounded-2xl border border-gray-800"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Settings Section */}
                <div className="pt-4 border-t border-gray-800">
                  <label className="flex items-center cursor-pointer group p-2">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                        className="sr-only"
                      />
                      <div className={`w-12 h-6 rounded-full transition-colors ${formData.is_active ? 'bg-[#6366F1]' : 'bg-gray-800'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.is_active ? 'translate-x-6' : ''}`}></div>
                    </div>
                    <span className="ml-4 font-bold text-gray-400 group-hover:text-[#F9FAFB] transition-colors">Make product visible in store</span>
                  </label>
                </div>
              </form>
            </div>
            
            {/* Modal Footer */}
            <div className="px-8 py-6 border-t border-gray-800 flex items-center justify-end gap-4 bg-[#0F172A]">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-8 py-3.5 text-gray-400 font-bold hover:text-[#F9FAFB] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}
                className="px-10 py-3.5 bg-[#6366F1] text-white rounded-2xl font-bold hover:bg-[#4F46E5] transition-all shadow-xl shadow-indigo-500/20"
              >
                {editingProduct ? 'Save Changes' : 'Publish Product'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Product View Modal */}
      {showViewModal && viewingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[100] transition-all">
          <div className="bg-[#111827] rounded-[2.5rem] w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300 border border-gray-800">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-800 flex items-center justify-between bg-[#111827] sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-black text-[#F9FAFB]">Product Details</h2>
                <p className="text-gray-400 text-sm">Full overview of the product</p>
              </div>
              <button 
                onClick={() => setShowViewModal(false)}
                className="p-3 bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-400 rounded-2xl transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-8 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div className="space-y-4">
                  <div className="aspect-square rounded-3xl bg-[#0F172A] overflow-hidden border border-gray-800">
                    {viewingProduct.images?.[0] ? (
                      <img src={viewingProduct.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <Package size={80} />
                      </div>
                    )}
                  </div>
                  {viewingProduct.images?.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {viewingProduct.images.slice(1).map((img, idx) => (
                        <div key={idx} className="aspect-square rounded-xl bg-[#0F172A] overflow-hidden border border-gray-800">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Info Content */}
                <div className="space-y-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                      <Tag size={12} />
                      {viewingProduct.category || 'General'}
                    </span>
                    <h1 className="text-3xl font-black text-[#F9FAFB] leading-tight">{viewingProduct.name}</h1>
                  </div>

                  <div className="flex items-center gap-4 py-4 border-y border-gray-800">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Price</p>
                      <div className="flex items-center text-2xl font-black text-[#F9FAFB]">
                        <IndianRupee size={20} />
                        <span>{viewingProduct.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="h-10 w-px bg-gray-800"></div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Stock</p>
                      <p className={`text-xl font-black ${viewingProduct.stock_quantity < 10 ? 'text-orange-400' : 'text-[#F9FAFB]'}`}>
                        {viewingProduct.stock_quantity} Units
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</p>
                    <p className="text-gray-400 leading-relaxed text-sm">
                      {viewingProduct.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[#0F172A] rounded-2xl border border-gray-800">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                      <div className="flex items-center gap-2">
                        {viewingProduct.is_active ? (
                          <><CheckCircle size={16} className="text-emerald-400" /><span className="text-sm font-bold text-emerald-400">Active</span></>
                        ) : (
                          <><AlertCircle size={16} className="text-gray-400" /><span className="text-sm font-bold text-gray-400">Inactive</span></>
                        )}
                      </div>
                    </div>
                    <div className="p-4 bg-[#0F172A] rounded-2xl border border-gray-800">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Product ID</p>
                      <p className="text-[10px] font-mono text-gray-400 break-all">{viewingProduct.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-8 py-6 border-t border-gray-800 flex items-center justify-end gap-4 bg-[#0F172A]">
              <button
                type="button"
                onClick={() => {
                  setShowViewModal(false);
                  setEditingProduct(viewingProduct);
                  setShowForm(true);
                }}
                className="flex items-center gap-2 px-6 py-3.5 bg-blue-500/10 text-blue-400 rounded-2xl font-bold hover:bg-blue-600 hover:text-white transition-all"
              >
                <Edit size={18} />
                Edit Product
              </button>
              <button
                type="button"
                onClick={() => setShowViewModal(false)}
                className="px-8 py-3.5 bg-[#6366F1] text-white rounded-2xl font-bold hover:bg-[#4F46E5] transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}} />
    </AdminLayout>
  );
};

export default ProductManagement;
