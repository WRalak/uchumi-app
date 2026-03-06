import React from 'react';
import { Link } from 'react-router-dom';

const CartSummary = ({ cart }) => {
  if (!cart || cart.items.length === 0) {
    return null;
  }

  const subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="text-green-600">Free</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (10%)</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-primary-600">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <Link
        to="/checkout"
        className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition text-center block"
      >
        Proceed to Checkout
      </Link>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>✓ Free shipping on orders over $50</p>
        <p>✓ 30-day return policy</p>
        <p>✓ Secure checkout</p>
      </div>
    </div>
  );
};

export default CartSummary;