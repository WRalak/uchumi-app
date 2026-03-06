import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { FiUser, FiMail, FiSave } from 'react-icons/fi';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        email: user.email,
        first_name: user.first_name || '',
        last_name: user.last_name || ''
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    setSuccess(false);
    try {
      await updateProfile(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  {...register('first_name')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  {...register('last_name')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  {...register('username', { required: 'Username is required' })}
                  className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                  })}
                  className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            <div className="border-t pt-6">
              <div className="flex items-center justify-between">
                <div>
                  {success && (
                    <p className="text-green-600 text-sm">Profile updated successfully!</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                >
                  <FiSave />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
        
        {/* Account Info */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="text-sm text-gray-600">
            <p>Member since: {new Date(user?.created_at).toLocaleDateString()}</p>
            <p>Account type: {user?.is_admin ? 'Administrator' : 'Customer'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;