import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CategorySection from '../components/CategorySection';
import ProductsSection from '../components/ProductsSection';
import Footer from '../components/Footer';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');

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
      <ProductsSection selectedCategory={selectedCategory} searchQuery={searchQuery} />
      <Footer />
    </div>
  );
};

export default Home;
