import api from './api';

const cartService = {
  async getCart() {
    const response = await api.get('/cart');
    return response.data;
  },

  async addToCart(productId, quantity = 1) {
    const response = await api.post('/cart/add', { product_id: productId, quantity });
    return response.data;
  },

  async updateCartItem(itemId, quantity) {
    const response = await api.put(`/cart/update/${itemId}`, { quantity });
    return response.data;
  },

  async removeFromCart(itemId) {
    const response = await api.delete(`/cart/remove/${itemId}`);
    return response.data;
  },

  async clearCart() {
    const response = await api.delete('/cart/clear');
    return response.data;
  }
};

export default cartService;