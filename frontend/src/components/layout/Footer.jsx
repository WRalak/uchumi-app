import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-primary-400 mb-4">ShopEase</h3>
            <p className="text-gray-400">
              Your one-stop shop for everything you need. Quality products at amazing prices.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white">Products</Link></li>
              <li><Link to="/cart" className="text-gray-400 hover:text-white">Cart</Link></li>
              <li><Link to="/orders" className="text-gray-400 hover:text-white">Orders</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">FAQs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Shipping Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Returns & Refunds</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white text-2xl">
                <FiFacebook />
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-2xl">
                <FiTwitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-2xl">
                <FiInstagram />
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-2xl">
                <FiYoutube />
              </a>
            </div>
            
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-2">Newsletter</h4>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-l-lg text-gray-900"
                />
                <button
                  type="submit"
                  className="bg-primary-600 px-4 py-2 rounded-r-lg hover:bg-primary-700"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} ShopEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;