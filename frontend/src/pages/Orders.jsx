import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../services/orderService';
import { FiPackage, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { format } from 'date-fns';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiClock className="text-yellow-500" />;
      case 'paid':
        return <FiCheckCircle className="text-blue-500" />;
      case 'shipped':
        return <FiPackage className="text-purple-500" />;
      case 'delivered':
        return <FiCheckCircle className="text-green-500" />;
      case 'cancelled':
        return <FiXCircle className="text-red-500" />;
      default:
        return null;
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

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <FiPackage className="mx-auto h-16 w-16 text-gray-400" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">No orders yet</h2>
          <p className="mt-2 text-gray-500">Start shopping to create your first order!</p>
          <Link
            to="/products"
            className="mt-6 inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
          >
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(order.status)}
                  <div>
                    <p className="text-sm text-gray-500">
                      Order #{order.id}
                    </p>
                    <p className="font-semibold">
                      {format(new Date(order.order_date), 'MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-lg font-bold text-primary-600">
                      ${order.total_amount.toFixed(2)}
                    </p>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 border-t pt-4">
                <p className="text-sm text-gray-600">
                  {order.items.length} item(s) • {order.payment_method}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Orders;