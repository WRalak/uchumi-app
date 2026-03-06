import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import { FiEye, FiCheckCircle, FiTruck, FiPackage, FiXCircle } from 'react-icons/fi';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await adminService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      await fetchOrders();
      setShowModal(false);
    } catch (error) {
      console.error('Failed to update order status:', error);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiPackage className="text-yellow-500" />;
      case 'paid':
        return <FiCheckCircle className="text-blue-500" />;
      case 'shipped':
        return <FiTruck className="text-purple-500" />;
      case 'delivered':
        return <FiCheckCircle className="text-green-500" />;
      case 'cancelled':
        return <FiXCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Orders</h1>
      
      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">#{order.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">User #{order.user_id}</div>
                      <div className="text-sm text-gray-500">{order.shipping_address?.split(',')[0]}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(order.order_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    ${order.total_amount?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span>{order.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 capitalize">
                    {order.payment_method?.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowModal(true);
                      }}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      <FiEye className="text-xl" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold">Order #{selectedOrder.id}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiXCircle className="text-2xl" />
              </button>
            </div>

            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">{new Date(selectedOrder.order_date).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium capitalize">{selectedOrder.payment_method?.replace('_', ' ')}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Shipping Address</p>
                <p className="font-medium">{selectedOrder.shipping_address}</p>
              </div>
            </div>

            {/* Update Status */}
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {['pending', 'paid', 'shipped', 'delivered', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                    disabled={selectedOrder.status === status}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      selectedOrder.status === status
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-semibold mb-4">Order Items</h3>
              <div className="space-y-4">
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.product?.image_url || 'https://via.placeholder.com/60x60'}
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-semibold">${item.price?.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-end">
                  <div className="w-64">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-primary-600">${selectedOrder.total_amount?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;