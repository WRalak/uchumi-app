import api from './api';

const orderService = {
  async getOrders() {
    const response = await api.get('/orders');
    return response.data;
  },

  async getOrder(id) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  async createOrder(orderData) {
    const response = await api.post('/orders/create', orderData);
    return response.data;
  },

  async cancelOrder(id) {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  }
};

export default orderService;