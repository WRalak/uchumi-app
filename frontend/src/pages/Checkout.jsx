import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCart } from '../context/CartContext';
import orderService from '../services/orderService';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const orderData = {
        shipping_address: `${data.address}, ${data.city}, ${data.state} ${data.zipCode}`,
        payment_method: data.paymentMethod
      };
      
      const response = await orderService.createOrder(orderData);
      await clearCart();
      navigate(`/orders/${response.order.id}`);
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!cart?.items?.length) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="flex-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    {...register('address', { required: 'Address is required' })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      {...register('city', { required: 'City is required' })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      {...register('state', { required: 'State is required' })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    {...register('zipCode', { required: 'ZIP code is required' })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    value="credit_card"
                    {...register('paymentMethod', { required: 'Please select a payment method' })}
                    className="h-4 w-4 text-primary-600"
                  />
                  <span>Credit Card</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    value="paypal"
                    {...register('paymentMethod')}
                    className="h-4 w-4 text-primary-600"
                  />
                  <span>PayPal</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="radio"
                    value="bank_transfer"
                    {...register('paymentMethod')}
                    className="h-4 w-4 text-primary-600"
                  />
                  <span>Bank Transfer</span>
                </label>
              </div>
              {errors.paymentMethod && (
                <p className="text-red-500 text-sm mt-1">{errors.paymentMethod.message}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-80">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.product_name} x {item.quantity}
                  </span>
                  <span className="font-medium">${item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary-600">${cart.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;