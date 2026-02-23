import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Account from './pages/Account';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProfile from './pages/admin/AdminProfile';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import CustomerManagement from './pages/admin/CustomerManagement';
import AdminSettings from './pages/admin/AdminSettings';
import AdminReports from './pages/admin/AdminReports';
import CouponManagement from './pages/admin/CouponManagement';
import CategoryManagement from './pages/admin/CategoryManagement';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { fetchWishlist } from './store/slices/wishlistSlice';
import { fetchCart } from './store/slices/cartSlice';

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      dispatch(fetchWishlist());
      dispatch(fetchCart());
    }
  }, [dispatch]);

  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <ScrollToTop />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/account" element={<Account />} />
           <Route path="/login" element={<Login />} />
           <Route path="/signup" element={<Signup />} />
           <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/products" element={<ProductManagement />} />
          <Route path="/admin/orders" element={<OrderManagement />} />
          <Route path="/admin/customers" element={<CustomerManagement />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/coupons" element={<CouponManagement />} />
          <Route path="/admin/categories" element={<CategoryManagement />} />
        </Routes>
    </Router>
  );
}

export default App;
