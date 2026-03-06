import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FiShoppingCart, FiUser, FiSearch, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary-600">ShopEase</span>
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button type="submit" className="absolute right-3 top-2.5">
                  <FiSearch className="text-gray-400" />
                </button>
              </div>
            </form>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/products" className="text-gray-700 hover:text-primary-600 px-3 py-2">
              Products
            </Link>
            
            <Link to="/cart" className="relative text-gray-700 hover:text-primary-600 px-3 py-2">
              <FiShoppingCart className="text-xl" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated() ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 px-3 py-2">
                  <FiUser className="text-xl" />
                  <span>{user?.username}</span>
                </button>
                
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-primary-50">
                    Profile
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-primary-50">
                    Orders
                  </Link>
                  {isAdmin() && (
                    <Link to="/admin" className="block px-4 py-2 text-gray-700 hover:bg-primary-50">
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-primary-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              {isOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <button type="submit" className="absolute right-3 top-2.5">
                  <FiSearch className="text-gray-400" />
                </button>
              </div>
            </form>

            <Link
              to="/products"
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setIsOpen(false)}
            >
              Products
            </Link>
            
            <Link
              to="/cart"
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setIsOpen(false)}
            >
              Cart ({itemCount})
            </Link>

            {isAuthenticated() ? (
              <>
                <Link
                  to="/profile"
                  className="block py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/orders"
                  className="block py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsOpen(false)}
                >
                  Orders
                </Link>
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className="block py-2 text-gray-700 hover:text-primary-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left py-2 text-gray-700 hover:text-primary-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
