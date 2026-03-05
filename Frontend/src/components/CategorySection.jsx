import React from 'react';
import { useSelector } from 'react-redux';
import { translations } from '../translations';

const categories = [
  { name: 'Pharmaceuticals', color: 'bg-[#e6f1f0]', textColor: 'text-[#006d5b]', icon: '💊' },
  { name: 'Personal Care', color: 'bg-[#fff3ef]', textColor: 'text-[#ff6b3d]', icon: '🧴' },
  { name: 'Baby Care', color: 'bg-[#f3f0ff]', textColor: 'text-[#7c3aed]', icon: '👶' },
  { name: 'Wellness', color: 'bg-[#fff7ed]', textColor: 'text-[#ea580c]', icon: '🧘' },
  { name: 'Animal Health', color: 'bg-[#f0fdf4]', textColor: 'text-[#16a34a]', icon: '🐕' },
  { name: 'Moms', color: 'bg-[#fdf2f8]', textColor: 'text-[#db2777]', icon: '🤱' },
];

const CategorySection = ({ onCategorySelect }) => {
  const currentLang = useSelector((state) => state.language.currentLanguage);
  const t = translations[currentLang];

  return (
    <div className="py-16 px-4 sm:px-8 bg-white overflow-hidden">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">{t.top_categories || 'Shop by Category'}</h2>
        <div className="h-1 flex-1 bg-gray-50 mx-8 rounded-full hidden md:block"></div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
        {categories.map((cat, index) => (
          <div 
            key={index} 
            onClick={() => onCategorySelect(cat.name)}
            className={`${cat.color} rounded-[2rem] p-8 h-64 relative overflow-hidden cursor-pointer group transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200 border border-transparent hover:border-white`}
          >
            <div className="relative z-10">
              <h3 className={`${cat.textColor} text-xl font-black leading-tight uppercase tracking-wider mb-2 group-hover:scale-105 transition-transform origin-left`}>
                {t[cat.name] || cat.name}
              </h3>
              <div className={`w-8 h-1 bg-current opacity-30 rounded-full transition-all duration-500 group-hover:w-16 ${cat.textColor}`}></div>
            </div>
            
            <div className="absolute bottom-4 right-4 text-8xl transition-all duration-700 transform translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-100">
              {cat.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
