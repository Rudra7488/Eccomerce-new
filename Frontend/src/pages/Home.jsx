import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CategorySection from '../components/CategorySection';
import DealsSection from '../components/DealsSection';
import Footer from '../components/Footer';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // Scroll to products section
    const element = document.getElementById('products-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      <Hero />
      <CategorySection onCategorySelect={handleCategorySelect} />
      <DealsSection selectedCategory={selectedCategory} />
      <Footer />
    </div>
  );
};

export default Home;
