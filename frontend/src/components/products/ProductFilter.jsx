import React, { useState } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';

const ProductFilter = ({ filters, categories, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    setIsOpen(false);
  };

  const handleClear = () => {
    const cleared = {
      category_id: '',
      min_price: '',
      max_price: '',
      search: ''
    };
    setLocalFilters(cleared);
    onFilterChange(cleared);
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-lg"
        >
          <FiFilter />
          <span>Filters</span>
        </button>
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:block bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category_id"
              value={localFilters.category_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                name="min_price"
                placeholder="Min"
                value={localFilters.min_price}
                onChange={handleChange}
                className="w-1/2 border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="number"
                name="max_price"
                placeholder="Max"
                value={localFilters.max_price}
                onChange={handleChange}
                className="w-1/2 border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
          
          <div className="flex space-x-2 pt-4">
            <button
              onClick={handleApply}
              className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
            >
              Apply Filters
            </button>
            <button
              onClick={handleClear}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button onClick={() => setIsOpen(false)}>
                <FiX className="text-2xl" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category_id"
                  value={localFilters.category_id}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="min_price"
                    placeholder="Min"
                    value={localFilters.min_price}
                    onChange={handleChange}
                    className="w-1/2 border border-gray-300 rounded-lg px-3 py-2"
                  />
                  <input
                    type="number"
                    name="max_price"
                    placeholder="Max"
                    value={localFilters.max_price}
                    onChange={handleChange}
                    className="w-1/2 border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <button
                  onClick={handleApply}
                  className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700"
                >
                  Apply Filters
                </button>
                <button
                  onClick={handleClear}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductFilter;