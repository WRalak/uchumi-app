import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, loading } = useCart();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <FiShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="mt-2 text-gray-500">Looks like you haven't added anything to your cart yet.</p>
          <Link
            to="/products"
            className="mt-6 inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {cart.items.map((item) => (
              <div key={item.id} className="flex items-center p-4 border-b last:border-b-0">
                <img
                  src={item.image_url || 'https://via.placeholder.com/80x80'}
                  alt={item.product_name}
                  className="w-20 h-20 object-cover rounded"
                />
                
                <div className="flex-1 ml-4">
                  <Link to={`/products/${item.product_id}`}>
                    <h3 className="text-lg font-semibold text-gray-800 hover:text-primary-600">
                      {item.product_name}
                    </h3>
                  </Link>
                  <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <FiMinus className="text-sm" />
                    </button>
                    <span className="w-12 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-100"
                    >
                      <FiPlus className="text-sm" />
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-primary-600">
                      ${item.subtotal.toFixed(2)}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 className="text-xl" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex justify-between">
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-700"
            >
              Clear Cart
            </button>
            
            <Link
              to="/products"
              className="text-primary-600 hover:text-primary-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-80">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${cart.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary-600">${cart.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <Link
              to="/checkout"
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition text-center block"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;