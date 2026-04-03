import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';

import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Account from './pages/Account';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AddAddress from './pages/AddAddress';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProfile from './pages/admin/AdminProfile';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import CustomerManagement from './pages/admin/CustomerManagement';
import AdminSettings from './pages/admin/AdminSettings';
import AdminReports from './pages/admin/AdminReports';
import CouponManagement from './pages/admin/CouponManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import ReviewsManagement from './pages/admin/ReviewsManagement';
import BannerManagement from './pages/admin/BannerManagement';

import { fetchWishlist } from './store/slices/wishlistSlice';
import { fetchCart } from './store/slices/cartSlice';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Root Layout for Providers
const RootLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      dispatch(fetchWishlist());
      dispatch(fetchCart());
    }
  }, [dispatch]);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <ScrollToTop />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '/success', element: <Success /> },
      { path: '/account', element: <Account /> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
      { path: '/add-address', element: <AddAddress /> },
      { path: '/admin/dashboard', element: <AdminDashboard /> },
      { path: '/admin/profile', element: <AdminProfile /> },
      { path: '/admin/products', element: <ProductManagement /> },
      { path: '/admin/orders', element: <OrderManagement /> },
      { path: '/admin/customers', element: <CustomerManagement /> },
      { path: '/admin/settings', element: <AdminSettings /> },
      { path: '/admin/reports', element: <AdminReports /> },
      { path: '/admin/coupons', element: <CouponManagement /> },
      { path: '/admin/categories', element: <CategoryManagement /> },
      { path: '/admin/reviews', element: <ReviewsManagement /> },
      { path: '/admin/banners', element: <BannerManagement /> },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
