import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiEye } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      window.location.href = '/login';
      return;
    }
    addToCart(product.id, 1);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link to={`/products/${product.id}`}>
        <div className="relative pb-48 overflow-hidden">
          <img
            src={product.image_url || 'https://via.placeholder.com/300x200'}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover hover:scale-105 transition-transform duration-300"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-primary-600">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">
            ${product.price.toFixed(2)}
          </span>
          
          <div className="flex space-x-2">
            <Link
              to={`/products/${product.id}`}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition"
            >
              <FiEye className="text-xl" />
            </Link>
            
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`p-2 rounded-full transition ${
                product.stock > 0
                  ? 'text-primary-600 hover:text-white hover:bg-primary-600'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <FiShoppingCart className="text-xl" />
            </button>
          </div>
        </div>
        
        <div className="mt-2 text-sm text-gray-500">
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;