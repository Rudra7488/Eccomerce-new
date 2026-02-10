import React from 'react';

const categories = [
  { name: 'Furniture', color: 'bg-emerald-700', image: '🪑' },
  { name: 'Hand Bag', color: 'bg-orange-400', image: '👜' },
  { name: 'Books', color: 'bg-red-700', image: '📚' },
  { name: 'Tech', color: 'bg-green-500', image: '💻' },
  { name: 'Sneakers', color: 'bg-pink-400', image: '👟' },
  { name: 'Groceries', color: 'bg-lime-600', image: '🥦' },
];

const CategorySection = ({ onCategorySelect }) => {
  return (
    <div className="py-16 px-4 sm:px-8 bg-white">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Shop Our Top Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((cat, index) => (
          <div 
            key={index} 
            onClick={() => onCategorySelect(cat.name)}
            className={`${cat.color} rounded-xl p-4 h-64 relative overflow-hidden cursor-pointer transform hover:-translate-y-1 transition duration-300 shadow-lg group`}
          >
            <h3 className="text-white text-xl font-semibold relative z-10">{cat.name}</h3>
            <div className="absolute bottom-0 right-0 text-9xl opacity-50 transform translate-x-4 translate-y-4 group-hover:scale-110 transition">
              {cat.image}
            </div>
            {/* Simple decoration line */}
             <div className="absolute top-10 left-4 w-10 h-1 bg-white/30 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
