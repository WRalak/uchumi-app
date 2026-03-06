import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../services/productService';
import ProductCard from '../components/products/ProductCard';
import { FiTruck, FiShield, FiRefreshCw, FiHeadphones } from 'react-icons/fi';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const [featured, newProducts] = await Promise.all([
        productService.getProducts({ page: 1, per_page: 4, sort_by: 'created_at', sort_order: 'desc' }),
        productService.getProducts({ page: 1, per_page: 4, sort_by: 'created_at', sort_order: 'desc' })
      ]);
      
      setFeaturedProducts(featured.products);
      setNewArrivals(newProducts.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: FiTruck,
      title: 'Free Shipping',
      description: 'On orders over $50'
    },
    {
      icon: FiShield,
      title: 'Secure Payment',
      description: '100% secure transactions'
    },
    {
      icon: FiRefreshCw,
      title: 'Easy Returns',
      description: '30-day return policy'
    },
    {
      icon: FiHeadphones,
      title: '24/7 Support',
      description: 'Dedicated customer support'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome to ShopEase
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Discover amazing products at unbeatable prices
            </p>
            <Link
              to="/products"
              className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105"
            >
              Shop Now
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
              fill="white" fillOpacity="0.1"/>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
              <feature.icon className="text-4xl text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link
                to="/products"
                className="inline-block text-primary-600 font-semibold hover:text-primary-700"
              >
                View All Products →
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/products?category_id=1" className="group relative h-64 overflow-hidden rounded-lg">
            <img 
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Electronics"
              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">Electronics</span>
            </div>
          </Link>
          
          <Link to="/products?category_id=2" className="group relative h-64 overflow-hidden rounded-lg">
            <img 
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Fashion"
              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">Fashion</span>
            </div>
          </Link>
          
          <Link to="/products?category_id=3" className="group relative h-64 overflow-hidden rounded-lg">
            <img 
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Accessories"
              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">Accessories</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-primary-100 mb-8">Get the latest updates on new products and upcoming sales</p>
          
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;