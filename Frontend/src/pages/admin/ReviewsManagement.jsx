import React, { useMemo, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Star, Search, Filter, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReviewsManagement = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reviews/admin/all/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchReviews();
  }, []);

  const filtered = useMemo(() => {
    return reviews.filter(r => {
      const productName = r.product_title || '';
      const reviewer = r.user_name || '';
      const comment = r.review_text || '';
      const matchesQuery =
        productName.toLowerCase().includes(query.toLowerCase()) ||
        reviewer.toLowerCase().includes(query.toLowerCase()) ||
        comment.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === 'All' ? true : (r.status || 'Approved') === statusFilter;
      const matchesRating = ratingFilter === 'All' ? true : String(r.rating) === String(ratingFilter);
      return matchesQuery && matchesStatus && matchesRating;
    });
  }, [reviews, query, statusFilter, ratingFilter]);

  const setStatus = (id, status) => {
    setReviews(prev => prev.map(r => (r.id === id ? { ...r, status } : r)));
  };

  const remove = (id) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const badgeClass = (status) => {
    if (status === 'Approved') return 'bg-green-50 text-green-700 border-green-200';
    if (status === 'Pending') return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    return 'bg-red-50 text-red-700 border-red-200';
  };

  return (
    <AdminLayout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Product Reviews</h1>
        <p className="text-gray-500 mt-1">Moderate and analyze customer feedback with quick filters and actions.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-6">
          <div className="flex items-center gap-3 bg-white border border-orange-100 rounded-2xl px-4 py-3">
            <Search size={18} className="text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product, reviewer, or text"
              className="w-full outline-none"
            />
          </div>
        </div>
        <div className="lg:col-span-3">
          <div className="flex items-center gap-3 bg-white border border-orange-100 rounded-2xl px-4 py-3">
            <Filter size={18} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full outline-none bg-transparent"
            >
              <option>All</option>
              <option>Approved</option>
              <option>Pending</option>
              <option>Flagged</option>
            </select>
          </div>
        </div>
        <div className="lg:col-span-3">
          <div className="flex items-center gap-3 bg-white border border-orange-100 rounded-2xl px-4 py-3">
            <Star size={18} className="text-yellow-400" />
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="w-full outline-none bg-transparent"
            >
              <option>All</option>
              <option value="5">5</option>
              <option value="4">4</option>
              <option value="3">3</option>
              <option value="2">2</option>
              <option value="1">1</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-orange-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Showing</span>
            <span className="font-semibold text-gray-900">{filtered.length}</span>
            <span className="text-sm text-gray-500">reviews</span>
          </div>
        </div>

        <div className="divide-y divide-orange-50">
          {filtered.map((r) => (
            <div key={r.id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center text-2xl">
                  {r.product_image ? (
                    <img src={r.product_image} alt={r.product_title} className="w-full h-full object-cover" />
                  ) : (
                    '🛍️'
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{r.product_title}</h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg border ${badgeClass(r.status || 'Approved')}`}>{r.status || 'Approved'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className={i < r.rating ? 'fill-current' : ''} />
                    ))}
                    <span className="text-xs text-gray-500 ml-2">{r.rating}.0</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 max-w-3xl">{r.review_text}</p>
                  <div className="text-xs text-gray-400 mt-2">
                    by {r.user_name} • {new Date(r.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-3">
                <button
                  onClick={() => setStatus(r.id, 'Approved')}
                  className="px-3 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition flex items-center gap-2"
                >
                  <CheckCircle size={16} />
                  Approve
                </button>
                <button
                  onClick={() => setStatus(r.id, 'Flagged')}
                  className="px-3 py-2 bg-yellow-500 text-white rounded-xl text-sm font-bold hover:bg-yellow-600 transition flex items-center gap-2"
                >
                  <XCircle size={16} />
                  Flag
                </button>
                <button
                  onClick={() => remove(r.id)}
                  className="px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              No reviews found.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReviewsManagement;

