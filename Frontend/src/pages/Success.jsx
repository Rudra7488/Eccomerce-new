import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { useSelector } from 'react-redux';
import { translations } from '../translations';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Success = () => {
  const navigate = useNavigate();
  const currentLang = useSelector((state) => state.language.currentLanguage);
  const t = translations[currentLang];
  const [orderId, setOrderId] = useState('');
  const orderNumber = Math.floor(Math.random() * 900000) + 100000;

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <CheckCircle size={60} strokeWidth={1.5} />
            </div>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-gray-900">{t.order_placed}</h1>
            <p className="text-gray-500 text-lg">
              {t.order_success_desc}
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <p className="text-sm text-gray-500 mb-1 uppercase tracking-wider font-semibold">{t.order_number}</p>
            <p className="text-2xl font-bold text-gray-900">#SHP-{orderNumber}</p>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => navigate('/')}
              className="w-full py-4 bg-[#003d29] text-white rounded-xl font-bold text-lg hover:bg-[#002a1c] transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <ShoppingBag size={20} />
              {t.continue_shopping}
            </button>
            <button 
              className="w-full py-4 text-gray-600 font-semibold hover:text-[#003d29] transition flex items-center justify-center gap-2"
            >
              View Order Details
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Success;
