import React, { useState, useEffect } from 'react';
import { Ticket, Copy, Check, Percent, DollarSign, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CouponSection = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  const fetchPublicCoupons = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/coupons/public/list/`, {
        headers
      });
      
      if (response.ok) {
        const data = await response.json();
        setCoupons(data);
      }
    } catch (error) {
      console.error('Error fetching public coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicCoupons();
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Code ${code} copied!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-[#006d5b] animate-spin" />
      </div>
    );
  }

  if (coupons.length === 0) return null;

  return (
    <div className="py-12 bg-[#fdfbf0]">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-[#006d5b] tracking-tight">Available Coupons</h2>
            <p className="text-gray-600 mt-1">Use these codes at checkout for extra savings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="bg-white rounded-3xl border-2 border-dashed border-[#006d5b]/20 p-6 flex items-center gap-6 relative overflow-hidden group hover:border-[#006d5b]/40 transition-all shadow-sm hover:shadow-md">
              <div className="w-16 h-16 bg-[#e6f1f0] rounded-2xl flex items-center justify-center text-[#006d5b] shrink-0">
                {coupon.discount_type === 'percentage' ? <Percent size={32} /> : <DollarSign size={32} />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#006d5b] bg-[#e6f1f0] px-2 py-0.5 rounded">
                    {coupon.discount_type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                  </span>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-1 truncate">{coupon.code}</h3>
                <p className="text-xs text-gray-500">Min. Purchase: ₹{coupon.min_purchase}</p>
              </div>

              <button 
                onClick={() => handleCopy(coupon.code)}
                className={`p-3 rounded-2xl transition-all ${
                  copiedCode === coupon.code 
                    ? 'bg-green-500 text-white' 
                    : 'bg-[#006d5b] text-white hover:bg-[#005c4b] shadow-lg shadow-green-900/20'
                }`}
              >
                {copiedCode === coupon.code ? <Check size={20} /> : <Copy size={20} />}
              </button>

              {/* Decorative semi-circles for coupon look */}
              <div className="absolute top-1/2 -left-3 w-6 h-6 bg-[#fdfbf0] rounded-full -translate-y-1/2 border-r-2 border-[#006d5b]/20"></div>
              <div className="absolute top-1/2 -right-3 w-6 h-6 bg-[#fdfbf0] rounded-full -translate-y-1/2 border-l-2 border-[#006d5b]/20"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CouponSection;
