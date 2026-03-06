import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiShoppingCart, FiHeart, FiShare2, FiCheck } from 'react-icons/fi';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await productService.getProduct(id);
      setProduct(data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    try {
      await addToCart(product.id, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 text-primary-600 hover:text-primary-700"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/2">
            <div className="relative pb-[100%] md:pb-0 md:h-full">
              <img
                src={product.image_url || 'https://via.placeholder.com/600x600'}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover md:static md:w-full md:h-auto"
              />
            </div>
          </div>
          
          {/* Product Info */}
          <div className="md:w-1/2 p-8">
            <div className="mb-4">
              {product.category_name && (
                <span className="text-sm text-primary-600 font-medium">
                  {product.category_name}
                </span>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
            </div>
            
            <div className="mb-6">
              <span className="text-4xl font-bold text-primary-600">
                ${product.price.toFixed(2)}
              </span>
              {product.stock > 0 ? (
                <span className="ml-4 text-green-600 text-sm">In Stock ({product.stock} available)</span>
              ) : (
                <span className="ml-4 text-red-600 text-sm">Out of Stock</span>
              )}
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
            
            {product.stock > 0 && (
              <div className="space-y-4">
                {/* Quantity Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center border rounded-lg w-32">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-2 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition ${
                      addedToCart
                        ? 'bg-green-500 text-white'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    {addedToCart ? (
                      <>
                        <FiCheck />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <FiShoppingCart />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                  
                  <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                    <FiHeart className="text-xl" />
                  </button>
                  
                  <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                    <FiShare2 className="text-xl" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Additional Info */}
            <div className="mt-8 border-t pt-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Free Shipping</h4>
                  <p className="text-sm text-gray-600">On orders over $50</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Easy Returns</h4>
                  <p className="text-sm text-gray-600">30-day return policy</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Secure Payment</h4>
                  <p className="text-sm text-gray-600">100% secure transactions</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">24/7 Support</h4>
                  <p className="text-sm text-gray-600">Dedicated customer support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;