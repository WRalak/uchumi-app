// src/services/productService.js
import api from './api';

const productService = {
  async getProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = `/products/${queryParams ? '?' + queryParams : ''}`;
      console.log('📦 Fetching products from:', url);
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error; // Re-throw so component can handle it
    }
  },

  async getProduct(id) {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      throw error;
    }
  },

  async getCategories() {
    try {
      console.log('📁 Fetching categories...');
      const response = await api.get('/products/categories');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  },

  async searchProducts(query) {
    try {
      const response = await api.get(`/products/?search=${query}`);
      return response.data;
    } catch (error) {
      console.error('Failed to search products:', error);
      throw error;
    }
  }
};

export default productService;