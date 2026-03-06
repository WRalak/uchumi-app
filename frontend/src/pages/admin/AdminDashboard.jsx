import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [products, orders, users] = await Promise.all([
        adminService.getProducts(),
        adminService.getOrders(),
        adminService.getUsers()
      ]);
      
      const totalRevenue = orders
        .filter(order => order.status === 'delivered')
        .reduce((sum, order) => sum + order.total_amount, 0);
      
      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalRevenue
      });
      
      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: FiPackage,
      color: 'bg-blue-500',
      link: '/admin/products'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: FiShoppingBag,
      color: 'bg-green-500',
      link: '/admin/orders'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: FiUsers,
      color: 'bg-purple-500',
      link: '/admin/users'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: FiDollarSign,
      color: 'bg-yellow-500',
      link: '/admin/orders'
    }
  ];

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white text-xl" />
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <Link to="/admin/orders" className="text-primary-600 hover:text-primary-700">
            View All
          </Link>
        </div>
        
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link to={`/admin/orders/${order.id}`} className="text-primary-600 hover:text-primary-700">
                      #{order.id}
                    </Link>
                  </td>
                  <td className="px-6 py-4">User #{order.user_id}</td>
                  <td className="px-6 py-4">
                    {new Date(order.order_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    ${order.total_amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;