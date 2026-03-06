import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { FiUser, FiMail, FiCalendar, FiShield } from 'react-icons/fi';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Users</h1>
      
      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-primary-100 p-3 rounded-full">
                <FiUser className="text-2xl text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {user.first_name || user.last_name 
                    ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                    : user.username}
                </h3>
                {user.is_admin && (
                  <span className="inline-flex items-center space-x-1 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    <FiShield />
                    <span>Admin</span>
                  </span>
                )}
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <FiMail className="mr-2" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiCalendar className="mr-2" />
                <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">User ID</span>
                <span className="font-mono">#{user.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;