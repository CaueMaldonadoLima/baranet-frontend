import { api } from "../api";
import type { Product, PaginatedResponse } from "../types";

export interface CreateProductDTO {
  code: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
}

export const productsService = {
  list: (params?: { page?: number; search?: string; category?: string }) => {
    const qs = new URLSearchParams();
    if (params?.page !== undefined) qs.set("page", String(params.page));
    if (params?.search) qs.set("search", params.search);
    if (params?.category) qs.set("category", params.category);
    const query = qs.toString();
    return api.get<PaginatedResponse<Product>>(`/erp/products${query ? `?${query}` : ""}`);
  },

  get: (id: number) => api.get<Product>(`/erp/products/${id}`),

  create: (data: CreateProductDTO) => api.post<Product>("/erp/products", data),

  update: (id: number, data: Partial<CreateProductDTO>) =>
    api.put<Product>(`/erp/products/${id}`, data),

  delete: (id: number) => api.delete<void>(`/erp/products/${id}`),
};
