import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, CreditCard, Gift } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white pt-16 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-2xl font-bold text-[#003d29]">
               <div className="relative">
                 <div className="text-orange-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                 </div>
                 <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
               </div>
               <span>Shopcart</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your one-stop shop for everything you need. Quality products, best prices, and fast delivery right to your doorstep.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-gray-600 text-sm">
                <Phone size={16} className="text-[#003d29]" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 text-sm">
                <Mail size={16} className="text-[#003d29]" />
                <span>support@shopcart.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 text-sm">
                <MapPin size={16} className="text-[#003d29]" />
                <span>123 Commerce St, Market City</span>
              </div>
            </div>
          </div>

          {/* Column 2: Department */}
          <div>
            <h3 className="text-lg font-bold text-[#003d29] mb-6">Department</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a href="#" className="hover:text-[#003d29] hover:underline transition">Fashion</a></li>
              <li><a href="#" className="hover:text-[#003d29] hover:underline transition">Education Product</a></li>
              <li><a href="#" className="hover:text-[#003d29] hover:underline transition">Frozen Food</a></li>
              <li><a href="#" className="hover:text-[#003d29] hover:underline transition">Beverages</a></li>
              <li><a href="#" className="hover:text-[#003d29] hover:underline transition">Organic Grocery</a></li>
              <li><a href="#" className="hover:text-[#003d29] hover:underline transition">Office Supplies</a></li>
              <li><a href="#" className="hover:text-[#003d29] hover:underline transition">Beauty Products</a></li>
              <li><a href="#" className="hover:text-[#003d29] hover:underline transition">Books</a></li>
            </ul>
          </div>

          {/* Column 3: About Us */}
          <div>
            <h3 className="text-lg font-bold text-[#003d29] mb-6">About Us</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a href="#" className="hover:text-[#003d29] hover:underline transition">About Shopcart</a></li>
              <li><a href="#" className="hover:text-[#003d29] hover:underline transition">Careers</a></li>
              <li><a href="#" className="hover:text-[#003d29] hover:underline transition">News & Blog</a></li>
              <li><a href="#" className="hover:text-[#003d29] hover:underline transition">Help</a></li>
              <li><a href="#" className="hover:text-[#003d29] hover:underline transition">Press Center</a></li>
              <li><a href="#" className="hover:text-[#003d29] hover:underline transition">Shop By Location</a></li>
              <li><a href="#" className="hover:text-[#003d29] hover:underline transition">Shopcart Brands</a></li>
              <li><a href="#" className="hover:text-[#003d29] hover:underline transition">Affiliate & Partners</a></li>
            </ul>
          </div>

          {/* Column 4: Services */}
          <div>
            <h3 className="text-lg font-bold text-[#003d29] mb-6">Services</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><a href="#" className="hover:text-[#003d29] hover:underline transition">Gift Card</a></li>
              <li><a href="#" className="hover:text-[#003d29] hover:underline transition">Mobile App</a></li>
              <li><a href="#" className="hover:text-[#003d29] hover:underline transition">Shipping & Delivery</a></li>
              <li><a href="#" className="hover:text-[#003d29] hover:underline transition">Order Pickup</a></li>
              <li><a href="#" className="hover:text-[#003d29] hover:underline transition">Account Sign Up</a></li>
            </ul>

            <h3 className="text-lg font-bold text-[#003d29] mt-8 mb-4">Help</h3>
             <ul className="space-y-3 text-sm text-gray-600">
              <li><a href="#" className="hover:text-[#003d29] hover:underline transition">Shopcart Help</a></li>
              <li><a href="#" className="hover:text-[#003d29] hover:underline transition">Returns</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Payments & Socials & Copyright */}
        <div className="border-t border-gray-200 py-8">
           <div className="flex flex-col md:flex-row justify-end items-center gap-6">
             {/* Social Media */}
             <div className="flex items-center gap-4">
                 <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#003d29] hover:text-white transition">
                    <Facebook size={16} />
                 </a>
                 <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#003d29] hover:text-white transition">
                    <Twitter size={16} />
                 </a>
                 <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#003d29] hover:text-white transition">
                    <Instagram size={16} />
                 </a>
                 <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#003d29] hover:text-white transition">
                    <Linkedin size={16} />
                 </a>
              </div>
           </div>

           <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
              <div className="flex gap-6">
                 <a href="#" className="hover:text-[#003d29]">Terms of Service</a>
                 <a href="#" className="hover:text-[#003d29]">Privacy & Policy</a>
                 <a href="#" className="hover:text-[#003d29]">All Rights Reserved by Shopcart</a>
                 <a href="#" className="hover:text-[#003d29]">Accessibility</a>
              </div>
              <div>
                 &copy; 2026 Shopcart. All rights reserved.
              </div>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
