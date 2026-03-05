import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, CreditCard, Gift } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white pt-16 border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand Info */}
          <div className="space-y-6">
            <div className="flex flex-col items-start group">
              <span className="text-3xl font-black text-[#006d5b] tracking-tighter">MOZARI</span>
              <div className="h-1 w-16 bg-[#ff6b3d] rounded-full"></div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Experience the wellness of nature with MOZARI. Quality products, ancient wisdom, and modern science delivered to your doorstep.
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4 text-gray-600 group cursor-pointer">
                <div className="w-10 h-10 bg-[#e6f1f0] text-[#006d5b] rounded-full flex items-center justify-center group-hover:bg-[#006d5b] group-hover:text-white transition-all">
                  <Phone size={18} />
                </div>
                <span className="text-sm font-bold group-hover:text-[#006d5b] transition-colors">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-4 text-gray-600 group cursor-pointer">
                <div className="w-10 h-10 bg-[#fff3ef] text-[#ff6b3d] rounded-full flex items-center justify-center group-hover:bg-[#ff6b3d] group-hover:text-white transition-all">
                  <Mail size={18} />
                </div>
                <span className="text-sm font-bold group-hover:text-[#ff6b3d] transition-colors">support@mozari.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h3 className="text-lg font-black text-[#006d5b] mb-8 uppercase tracking-widest">Categories</h3>
            <ul className="space-y-4 text-sm font-bold text-gray-500">
              <li><a href="#" className="hover:text-[#006d5b] transition-colors">Pharmaceuticals</a></li>
              <li><a href="#" className="hover:text-[#006d5b] transition-colors">Personal Care</a></li>
              <li><a href="#" className="hover:text-[#006d5b] transition-colors">Baby Care</a></li>
              <li><a href="#" className="hover:text-[#006d5b] transition-colors">Wellness</a></li>
              <li><a href="#" className="hover:text-[#006d5b] transition-colors">Animal Health</a></li>
              <li><a href="#" className="hover:text-[#006d5b] transition-colors">Nutrition</a></li>
            </ul>
          </div>

          {/* Column 3: About Us */}
          <div>
            <h3 className="text-lg font-black text-[#006d5b] mb-8 uppercase tracking-widest">Company</h3>
            <ul className="space-y-4 text-sm font-bold text-gray-500">
              <li><a href="#" className="hover:text-[#006d5b] transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-[#006d5b] transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-[#006d5b] transition-colors">Press & Media</a></li>
              <li><a href="#" className="hover:text-[#006d5b] transition-colors">Sustainability</a></li>
              <li><a href="#" className="hover:text-[#006d5b] transition-colors">Find a Store</a></li>
            </ul>
          </div>

          {/* Column 4: Customer Support */}
          <div>
            <h3 className="text-lg font-black text-[#006d5b] mb-8 uppercase tracking-widest">Support</h3>
            <ul className="space-y-4 text-sm font-bold text-gray-500">
              <li><a href="#" className="hover:text-[#006d5b] transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-[#006d5b] transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-[#006d5b] transition-colors">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-[#006d5b] transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-[#006d5b] transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-100 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest order-2 md:order-1">
              © 2024 MOZARI Wellness India. All Rights Reserved.
            </p>
            
            <div className="flex items-center gap-4 order-1 md:order-2">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#006d5b] hover:text-white transition-all duration-300">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#006d5b] hover:text-white transition-all duration-300">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#ff6b3d] hover:text-white transition-all duration-300">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#006d5b] hover:text-white transition-all duration-300">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
