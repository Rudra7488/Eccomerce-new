import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  Grid, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Image as ImageIcon,
  MoreVertical,
  CheckCircle,
  XCircle,
  FolderOpen,
  Layers
} from 'lucide-react';
import toast from 'react-hot-toast';

const CategoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Mock Data for Categories
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'Men\'s Fashion',
      description: 'Clothing, footwear, and accessories for men',
      productsCount: 1240,
      status: 'active',
      image: '👔',
      slug: 'mens-fashion'
    },
    {
      id: 2,
      name: 'Women\'s Fashion',
      description: 'Trendy apparel, bags, and jewelry for women',
      productsCount: 2150,
      status: 'active',
      image: '👗',
      slug: 'womens-fashion'
    },
    {
      id: 3,
      name: 'Electronics',
      description: 'Gadgets, smartphones, and home appliances',
      productsCount: 850,
      status: 'active',
      image: '🔌',
      slug: 'electronics'
    },
    {
      id: 4,
      name: 'Home & Living',
      description: 'Furniture, decor, and kitchen essentials',
      productsCount: 640,
      status: 'active',
      image: '🏠',
      slug: 'home-living'
    },
    {
      id: 5,
      name: 'Beauty & Personal Care',
      description: 'Skincare, makeup, and grooming products',
      productsCount: 420,
      status: 'inactive',
      image: '💄',
      slug: 'beauty-care'
    },
    {
      id: 6,
      name: 'Kids & Toys',
      description: 'Clothing for kids and fun toys',
      productsCount: 380,
      status: 'active',
      image: '🧸',
      slug: 'kids-toys'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    image: ''
  });

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        status: category.status,
        image: category.image
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        status: 'active',
        image: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      // Update existing category
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData, slug: formData.name.toLowerCase().replace(/\s+/g, '-') } 
          : cat
      ));
      toast.success('Category updated successfully!');
    } else {
      // Add new category
      const newCategory = {
        id: categories.length + 1,
        ...formData,
        productsCount: 0,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        image: formData.image || '📦' // Default icon if empty
      };
      setCategories([...categories, newCategory]);
      toast.success('Category created successfully!');
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category? All associated products might be affected.')) {
      setCategories(categories.filter(c => c.id !== id));
      toast.success('Category deleted successfully');
    }
  };

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Category Management</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <Grid size={16} />
            Organize your product catalog
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-2.5 bg-white border border-gray-200 rounded-xl w-64 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30"
          >
            <Plus size={20} />
            Add Category
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Layers size={24} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{categories.length}</h3>
          <p className="text-gray-500 text-sm mt-1">Total Categories</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <CheckCircle size={24} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{categories.filter(c => c.status === 'active').length}</h3>
          <p className="text-gray-500 text-sm mt-1">Active Categories</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
              <FolderOpen size={24} />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">
            {categories.reduce((acc, curr) => acc + curr.productsCount, 0).toLocaleString()}
          </h3>
          <p className="text-gray-500 text-sm mt-1">Total Products Linked</p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-3xl border border-orange-100 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col">
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl border border-gray-100 shadow-inner">
                  {category.image}
                </div>
                <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                  category.status === 'active' 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                    : 'bg-gray-100 text-gray-500 border-gray-200'
                }`}>
                  {category.status === 'active' ? 'Active' : 'Inactive'}
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-xs text-gray-400 font-mono mb-3">/{category.slug}</p>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">
                {category.description}
              </p>
              
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-50 px-3 py-2 rounded-xl w-fit">
                <FolderOpen size={16} className="text-orange-500" />
                {category.productsCount} Products
              </div>
            </div>

            <div className="border-t border-gray-100 p-4 flex gap-2 bg-gray-50/50">
              <button 
                onClick={() => handleOpenModal(category)}
                className="flex-1 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
              >
                <Edit size={16} />
                Edit
              </button>
              <button 
                onClick={() => handleDelete(category.id)}
                className="p-2 bg-white border border-gray-200 text-red-500 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl transform transition-all animate-fadeIn">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <XCircle size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Summer Collection"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Icon / Emoji</label>
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    placeholder="e.g. 👗"
                    className="w-20 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-center text-2xl"
                    value={formData.image}
                    onChange={e => setFormData({...formData, image: e.target.value})}
                  />
                  <div className="flex-1 flex items-center text-sm text-gray-500 bg-blue-50 px-4 rounded-xl border border-blue-100">
                    <ImageIcon size={16} className="mr-2 text-blue-500" />
                    Use an emoji or short text as an icon
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea 
                  rows="3"
                  placeholder="Describe this category..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none resize-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                <div className="flex gap-4">
                  <label className={`flex-1 cursor-pointer border-2 rounded-xl p-3 flex items-center justify-center gap-2 transition-all ${formData.status === 'active' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                    <input 
                      type="radio" 
                      name="status" 
                      value="active"
                      checked={formData.status === 'active'}
                      onChange={() => setFormData({...formData, status: 'active'})}
                      className="hidden"
                    />
                    <CheckCircle size={18} />
                    Active
                  </label>
                  <label className={`flex-1 cursor-pointer border-2 rounded-xl p-3 flex items-center justify-center gap-2 transition-all ${formData.status === 'inactive' ? 'border-gray-500 bg-gray-100 text-gray-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                    <input 
                      type="radio" 
                      name="status" 
                      value="inactive"
                      checked={formData.status === 'inactive'}
                      onChange={() => setFormData({...formData, status: 'inactive'})}
                      className="hidden"
                    />
                    <XCircle size={18} />
                    Inactive
                  </label>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
              >
                {editingCategory ? <Edit size={20} /> : <Plus size={20} />}
                {editingCategory ? 'Update Category' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default CategoryManagement;