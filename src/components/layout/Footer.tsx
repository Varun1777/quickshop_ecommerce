import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, CreditCard, ShoppingBag } from "lucide-react";
const Footer: React.FC = () => {
  return <footer className="bg-gray-50 pt-12 pb-8 mt-16 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About section */}
          <div>
            <div className="flex items-center mb-4">
              <ShoppingBag className="h-6 w-6 text-brand-600" />
              <span className="ml-2 text-xl font-heading font-semibold">QuickShop</span>
            </div>
            <p className="text-gray-600 mb-4">
              We provide the best shopping experience with high-quality products at competitive prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-brand-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-600 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-600 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-brand-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 hover:text-brand-600 transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-600 hover:text-brand-600 transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-brand-600 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-brand-600 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-brand-600 mr-2 mt-0.5" />
                <span className="text-gray-600">123 Shopping Street, Product City</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-brand-600 mr-2" />
                <a href="tel:+15551234567" className="text-gray-600 hover:text-brand-600 transition-colors">+91 123456789</a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-brand-600 mr-2" />
                <a href="mailto:info@quickshop.com" className="text-gray-600 hover:text-brand-600 transition-colors">
                  info@quickshop.com
                </a>
              </li>
            </ul>
          </div>

          {/* Payment methods */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">We Accept</h3>
            <div className="flex flex-wrap gap-2">
              <div className="bg-white p-2 rounded shadow-sm">
                <CreditCard className="h-6 w-6 text-gray-700" />
              </div>
              <div className="bg-white p-2 rounded shadow-sm">
                <span className="font-bold text-blue-700">Visa</span>
              </div>
              <div className="bg-white p-2 rounded shadow-sm">
                <span className="font-bold text-red-600">Master</span>
              </div>
              <div className="bg-white p-2 rounded shadow-sm">
                <span className="font-bold text-blue-500">PayPal</span>
              </div>
            </div>
            <p className="text-gray-600 mt-4">
              <span className="font-medium">100% Secure Payment</span> with SSL encryption
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2023 QuickShop. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <a href="#" className="text-gray-500 text-sm hover:text-brand-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 text-sm hover:text-brand-600 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 text-sm hover:text-brand-600 transition-colors">
                Shipping Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;