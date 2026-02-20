import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { setUser } from '../store/slices/userSlice';
import { fetchWishlist } from '../store/slices/wishlistSlice';
import { fetchCart, clearCartLocal } from '../store/slices/cartSlice';
import { translations } from '../translations';
import Navbar from '../components/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', data.user.role || 'user'); 
        
        dispatch(setUser(data.user));
        
        try {
          dispatch(fetchWishlist());
        } catch (e) {
          console.error('Error fetching wishlist:', e);
        }

        try {
          dispatch(fetchCart());
        } catch (e) {
          console.error('Error fetching cart:', e);
        }

        if (data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError(data.error || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(`Login failed: ${err.message || 'Network error'}. Please check if backend is running.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full">
        {/* Brand Identity */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-[#003d29] tracking-tighter mb-2">
            VELORA
          </h1>
          <div className="h-1.5 w-12 bg-[#00a76f] mx-auto rounded-full"></div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 md:p-10 transition-all duration-300">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-[#003d29]">Welcome Back</h2>
            <p className="text-slate-500 mt-1">Login to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#00a76f] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00a76f]/20 focus:border-[#00a76f] focus:bg-white transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <a href="#" className="text-xs font-medium text-[#00a76f] hover:text-[#003d29] transition-colors">
                  Forgot Password?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#00a76f] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00a76f]/20 focus:border-[#00a76f] focus:bg-white transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-[#003d29] hover:bg-[#002a1c] text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-green-900/10 transition-all duration-300 active:scale-[0.98]"
            >
              Sign In
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-bold text-[#00a76f] hover:text-[#003d29] transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>


      </div>
    </div>
  );
};

export default Login;
