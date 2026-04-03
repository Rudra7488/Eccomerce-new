import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  ImagePlus, 
  Plus, 
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  Edit2,
  Loader2,
  ExternalLink,
  MoveUp,
  MoveDown
} from 'lucide-react';
import toast from 'react-hot-toast';

const BannerManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState([]);
  const [editingBanner, setEditingBanner] = useState(null);
  const [newBanner, setNewBanner] = useState({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    is_active: true,
    order: 0
  });
  const [uploadedImage, setUploadedImage] = useState(null);

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const MAX_WIDTH = 1920; // Banners should be high res
          const MAX_HEIGHT = 1080;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          resolve(dataUrl);
        };
      };
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const loadingToast = toast.loading('Processing image...');
    try {
      const compressed = await compressImage(file);
      setUploadedImage(compressed);
      if (showEditModal) {
        setEditingBanner({ ...editingBanner, image_url: compressed });
      } else {
        setNewBanner({ ...newBanner, image_url: compressed });
      }
      toast.success('Image processed!', { id: loadingToast });
    } catch (err) {
      toast.error('Failed to process image', { id: loadingToast });
    }
  };

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/banners/admin/all/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setBanners(data);
      } else {
        toast.error('Failed to fetch banners');
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast.error('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleAddBanner = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/banners/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newBanner),
      });

      if (response.ok) {
        toast.success('Banner created successfully');
        setShowAddModal(false);
        setNewBanner({
          title: '',
          description: '',
          image_url: '',
          link_url: '',
          is_active: true,
          order: 0
        });
        fetchBanners();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to create banner');
      }
    } catch (error) {
      console.error('Error adding banner:', error);
      toast.error('Error connecting to server');
    }
  };

  const handleEditClick = (banner) => {
    setEditingBanner(banner);
    setShowEditModal(true);
  };

  const handleUpdateBanner = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/banners/${editingBanner.id}/update/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingBanner),
      });

      if (response.ok) {
        toast.success('Banner updated successfully');
        setShowEditModal(false);
        setEditingBanner(null);
        fetchBanners();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update banner');
      }
    } catch (error) {
      console.error('Error updating banner:', error);
      toast.error('Error connecting to server');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/banners/${id}/delete/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          toast.success('Banner deleted successfully');
          fetchBanners();
        } else {
          toast.error('Failed to delete banner');
        }
      } catch (error) {
        console.error('Error deleting banner:', error);
        toast.error('Error connecting to server');
      }
    }
  };

  const filteredBanners = banners.filter(banner => 
    (banner.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (banner.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Banner Management</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <ImagePlus size={16} />
            Manage home page hero sliders
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search banners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-2.5 bg-white border border-gray-200 rounded-xl w-64 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30"
          >
            <Plus size={20} />
            Add Banner
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Loading banners...</p>
        </div>
      ) : filteredBanners.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <ImagePlus className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900">No Banners Found</h3>
          <p className="text-gray-500 mt-2">Add your first slider image to the home page</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredBanners.map((banner) => (
            <div key={banner.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col">
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img 
                  src={banner.image_url} 
                  alt={banner.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    banner.is_active ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-gray-500 text-white border-gray-600'
                  }`}>
                    {banner.is_active ? 'Active' : 'Inactive'}
                  </div>
                  <div className="px-3 py-1 bg-black/50 text-white rounded-full text-[10px] font-black tracking-widest backdrop-blur-sm border border-white/20">
                    ORDER: {banner.order}
                  </div>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-xl font-black text-gray-900 tracking-tight mb-1">{banner.title || 'No Title'}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">{banner.description || 'No description provided.'}</p>
                </div>

                <div className="mt-auto space-y-4">
                  {banner.link_url && (
                    <div className="flex items-center gap-2 text-xs font-bold text-orange-500">
                      <ExternalLink size={14} />
                      <span className="truncate">{banner.link_url}</span>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-gray-50">
                    <button 
                      onClick={() => handleEditClick(banner)}
                      className="flex-1 py-2.5 bg-gray-50 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(banner.id)}
                      className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Add New Banner</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <XCircle size={24} />
              </button>
            </div>

            <form onSubmit={handleAddBanner} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Banner Image</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden" 
                      id="banner-upload"
                    />
                    <label 
                      htmlFor="banner-upload"
                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all overflow-hidden"
                    >
                      {newBanner.image_url ? (
                        <img src={newBanner.image_url} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <ImagePlus size={32} />
                          <span className="text-xs font-bold">Select Image from Local</span>
                        </div>
                      )}
                    </label>
                  </div>
                  {newBanner.image_url && (
                    <button 
                      type="button"
                      onClick={() => setNewBanner({...newBanner, image_url: ''})}
                      className="mt-2 text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline"
                    >
                      Remove and choose another
                    </button>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Title</label>
                  <input 
                    type="text"
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                    placeholder="Big Summer Sale!"
                    value={newBanner.title}
                    onChange={e => setNewBanner({...newBanner, title: e.target.value})}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea 
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all h-24 resize-none"
                    placeholder="Get up to 50% off on all items..."
                    value={newBanner.description}
                    onChange={e => setNewBanner({...newBanner, description: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Link URL</label>
                  <input 
                    type="text"
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                    placeholder="/shop"
                    value={newBanner.link_url}
                    onChange={e => setNewBanner({...newBanner, link_url: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Display Order</label>
                  <input 
                    type="number"
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                    value={newBanner.order}
                    onChange={e => setNewBanner({...newBanner, order: parseInt(e.target.value || 0)})}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <input 
                  type="checkbox" 
                  id="add-is-active"
                  className="w-5 h-5 accent-orange-500 rounded-lg cursor-pointer"
                  checked={newBanner.is_active}
                  onChange={e => setNewBanner({...newBanner, is_active: e.target.checked})}
                />
                <label htmlFor="add-is-active" className="text-sm font-bold text-gray-700 cursor-pointer">Active and Visible</label>
              </div>

              <button type="submit" className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/30">
                Create Banner
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingBanner && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Edit Banner</h2>
              <button 
                onClick={() => { setShowEditModal(false); setEditingBanner(null); }} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <XCircle size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateBanner} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Banner Image</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden" 
                      id="edit-banner-upload"
                    />
                    <label 
                      htmlFor="edit-banner-upload"
                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all overflow-hidden"
                    >
                      {editingBanner.image_url ? (
                        <img src={editingBanner.image_url} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <ImagePlus size={32} />
                          <span className="text-xs font-bold">Select Image from Local</span>
                        </div>
                      )}
                    </label>
                  </div>
                  <button 
                    type="button"
                    onClick={() => document.getElementById('edit-banner-upload').click()}
                    className="mt-2 text-[10px] font-black text-orange-500 uppercase tracking-widest hover:underline"
                  >
                    Change photo
                  </button>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Title</label>
                  <input 
                    type="text"
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                    value={editingBanner.title}
                    onChange={e => setEditingBanner({...editingBanner, title: e.target.value})}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea 
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all h-24 resize-none"
                    value={editingBanner.description}
                    onChange={e => setEditingBanner({...editingBanner, description: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Link URL</label>
                  <input 
                    type="text"
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                    value={editingBanner.link_url}
                    onChange={e => setEditingBanner({...editingBanner, link_url: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Display Order</label>
                  <input 
                    type="number"
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all"
                    value={editingBanner.order}
                    onChange={e => setEditingBanner({...editingBanner, order: parseInt(e.target.value || 0)})}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <input 
                  type="checkbox" 
                  id="edit-is-active"
                  className="w-5 h-5 accent-orange-500 rounded-lg cursor-pointer"
                  checked={editingBanner.is_active}
                  onChange={e => setEditingBanner({...editingBanner, is_active: e.target.checked})}
                />
                <label htmlFor="edit-is-active" className="text-sm font-bold text-gray-700 cursor-pointer">Active and Visible</label>
              </div>

              <button type="submit" className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/30">
                Update Banner
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default BannerManagement;
