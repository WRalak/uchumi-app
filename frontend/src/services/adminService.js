import api from './api';

const adminService = {
  // Products
  async getProducts() {
    const response = await api.get('/admin/products');
    return response.data;
  },

  async createProduct(productData) {
    const response = await api.post('/admin/products', productData);
    return response.data;
  },

  async updateProduct(id, productData) {
    const response = await api.put(`/admin/products/${id}`, productData);
    return response.data;
  },

  async deleteProduct(id) {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  },

  // Categories
  async createCategory(categoryData) {
    const response = await api.post('/admin/categories', categoryData);
    return response.data;
  },

  async updateCategory(id, categoryData) {
    const response = await api.put(`/admin/categories/${id}`, categoryData);
    return response.data;
  },

  async deleteCategory(id) {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },

  // Orders
  async getOrders() {
    const response = await api.get('/admin/orders');
    return response.data;
  },

  async updateOrderStatus(id, status) {
    const response = await api.put(`/admin/orders/${id}/status`, { status });
    return response.data;
  },

  // Users
  async getUsers() {
    const response = await api.get('/admin/users');
    return response.data;
  }
};

export default adminService;