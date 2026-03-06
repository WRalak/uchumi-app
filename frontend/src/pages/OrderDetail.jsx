import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { FiPackage, FiMapPin, FiCreditCard, FiCalendar } from 'react-icons/fi';
import { format } from 'date-fns';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const data = await orderService.getOrder(id);
      setOrder(data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }
    
    setCancelling(true);
    try {
      await orderService.cancelOrder(id);
      await fetchOrder();
    } catch (error) {
      console.error('Failed to cancel order:', error);
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>
      
      {/* Order Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-3">
            <FiCalendar className="text-2xl text-primary-600" />
            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-semibold">{format(new Date(order.order_date), 'PPP')}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-3">
            <FiMapPin className="text-2xl text-primary-600" />
            <div>
              <p className="text-sm text-gray-500">Shipping Address</p>
              <p className="font-semibold text-sm">{order.shipping_address}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-3">
            <FiCreditCard className="text-2xl text-primary-600" />
            <div>
              <p className="text-sm text-gray-500">Payment Method</p>
              <p className="font-semibold capitalize">{order.payment_method.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Order Items */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Order Items</h2>
        </div>
        
        <div className="divide-y">
          {order.items.map((item) => (
            <div key={item.id} className="p-6 flex items-center">
              <img
                src={item.product?.image_url || 'https://via.placeholder.com/80x80'}
                alt={item.product_name}
                className="w-20 h-20 object-cover rounded"
              />
              
              <div className="flex-1 ml-4">
                <h3 className="font-semibold">{item.product_name}</h3>
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-semibold">${item.price.toFixed(2)}</p>
              </div>
              
              <div className="text-right ml-8">
                <p className="text-sm text-gray-500">Subtotal</p>
                <p className="font-semibold text-primary-600">${item.subtotal.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">${order.total_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping:</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary-600">${order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Order Actions */}
      {['pending', 'paid'].includes(order.status) && (
        <div className="flex justify-end">
          <button
            onClick={handleCancelOrder}
            disabled={cancelling}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition disabled:opacity-50"
          >
            {cancelling ? 'Cancelling...' : 'Cancel Order'}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
