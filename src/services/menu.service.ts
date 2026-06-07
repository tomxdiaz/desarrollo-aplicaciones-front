import { apiClient } from '../lib/apiClient';
import { Category, CreateCategoryPayload, CreateProductPayload, Product, UpdateProductPayload } from '../types/types';

export const menuService = {
  createCategory: async (restaurantId: string, payload: CreateCategoryPayload) => {
    return apiClient<Category>(`/restaurant/${restaurantId}/menu/categories`, {
      method: 'POST',
      requireAuth: true,
      body: payload,
    });
  },

  deleteCategory: async (restaurantId: string, categoryId: string) => {
    return apiClient<void>(`/restaurant/${restaurantId}/menu/categories/${categoryId}`, {
      method: 'DELETE',
      requireAuth: true,
    });
  },

  createProduct: async (restaurantId: string, payload: CreateProductPayload) => {
    return apiClient<Product>(`/restaurant/${restaurantId}/menu/product`, {
      method: 'POST',
      requireAuth: true,
      body: payload,
    });
  },

  updateProduct: async (restaurantId: string, productId: string, payload: UpdateProductPayload) => {
    return apiClient<Product>(`/restaurant/${restaurantId}/menu/product/${productId}`, {
      method: 'PATCH',
      requireAuth: true,
      body: payload,
    });
  },

  deleteProduct: async (restaurantId: string, productId: string) => {
    return apiClient<Product>(`/restaurant/${restaurantId}/menu/product/${productId}`, {
      method: 'DELETE',
      requireAuth: true,
    });
  },
};
