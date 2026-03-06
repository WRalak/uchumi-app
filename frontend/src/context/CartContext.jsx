import React, { createContext, useState, useContext, useEffect } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

export const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchCart = async () => {
    if (!isAuthenticated()) {
      setCart({ items: [], total: 0 });
      return;
    }
    
    setLoading(true);
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      if (error.response?.status !== 401) {
        toast.error('Failed to load cart');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated()]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const data = await cartService.addToCart(productId, quantity);
      await fetchCart();
      toast.success('Item added to cart');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add item to cart');
      throw error;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const data = await cartService.updateCartItem(itemId, quantity);
      await fetchCart();
      toast.success('Cart updated');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update cart');
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await cartService.removeFromCart(itemId);
      await fetchCart();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to remove item');
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart({ items: [], total: 0 });
      toast.success('Cart cleared');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to clear cart');
      throw error;
    }
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,
    itemCount: cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
    total: cart?.total || 0
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};