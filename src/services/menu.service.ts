import { apiClient } from '../lib/apiClient';
import { Category, CreateCategoryPayload, CreateProductPayload, Product, UpdateProductPayload } from '../types/types';
import { appendImageToFormData } from '../utils/image';

const buildProductFormData = (
  payload: CreateProductPayload | UpdateProductPayload,
): FormData => {
  const form = new FormData();

  if (payload.category_id !== undefined) {
    form.append('category_id', String(payload.category_id));
  }

  if (payload.name !== undefined) {
    form.append('name', payload.name);
  }

  if (payload.description !== undefined && payload.description !== null) {
    form.append('description', payload.description);
  }

  if (payload.price !== undefined) {
    form.append('price', String(payload.price));
  }

  appendImageToFormData(form, payload.imageFile, payload.existingImage);

  return form;
};

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
      body: buildProductFormData(payload),
    });
  },

  updateProduct: async (restaurantId: string, productId: string, payload: UpdateProductPayload) => {
    return apiClient<Product>(`/restaurant/${restaurantId}/menu/product/${productId}`, {
      method: 'PATCH',
      requireAuth: true,
      body: buildProductFormData(payload),
    });
  },

  deleteProduct: async (restaurantId: string, productId: string) => {
    return apiClient<Product>(`/restaurant/${restaurantId}/menu/product/${productId}`, {
      method: 'DELETE',
      requireAuth: true,
    });
  },
};
