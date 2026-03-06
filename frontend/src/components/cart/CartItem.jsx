import React from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex items-center p-4 border-b last:border-b-0 hover:bg-gray-50 transition">
      <Link to={`/products/${item.product_id}`} className="flex-shrink-0">
        <img
          src={item.product?.image_url || 'https://via.placeholder.com/80x80'}
          alt={item.product_name}
          className="w-20 h-20 object-cover rounded"
        />
      </Link>
      
      <div className="flex-1 ml-4">
        <Link to={`/products/${item.product_id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-primary-600">
            {item.product_name}
          </h3>
        </Link>
        <p className="text-gray-600">${item.price.toFixed(2)} each</p>
        
        {/* Mobile view */}
        <div className="flex items-center justify-between mt-2 md:hidden">
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="p-2 hover:bg-gray-100 disabled:opacity-50"
            >
              <FiMinus className="text-sm" />
            </button>
            <span className="w-12 text-center">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
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
        </div>
      </div>
      
      {/* Desktop view */}
      <div className="hidden md:flex items-center space-x-4">
        <div className="flex items-center border rounded-lg">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50"
          >
            <FiMinus className="text-sm" />
          </button>
          <span className="w-12 text-center">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="px-3 py-2 hover:bg-gray-100"
          >
            <FiPlus className="text-sm" />
          </button>
        </div>
        
        <div className="text-right w-24">
          <p className="font-semibold text-primary-600">
            ${item.subtotal.toFixed(2)}
          </p>
        </div>
        
        <button
          onClick={() => onRemove(item.id)}
          className="text-red-500 hover:text-red-700 p-2"
          title="Remove item"
        >
          <FiTrash2 className="text-xl" />
        </button>
      </div>
      
      {/* Mobile remove button */}
      <button
        onClick={() => onRemove(item.id)}
        className="md:hidden text-red-500 hover:text-red-700 ml-2"
      >
        <FiTrash2 className="text-xl" />
      </button>
    </div>
  );
};

export default CartItem;