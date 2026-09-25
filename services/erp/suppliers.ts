import { api } from "../api";
import type { Supplier, SupplierWrite, PaginatedResponse } from "../types";

export const suppliersService = {
  list: (params?: { page?: number; per_page?: number; search?: string; category?: string }) => {
    const qs = new URLSearchParams();
    if (params?.page !== undefined) qs.set("page", String(params.page));
    if (params?.per_page !== undefined) qs.set("per_page", String(params.per_page));
    if (params?.search) qs.set("search", params.search);
    if (params?.category) qs.set("category", params.category);
    const query = qs.toString();
    return api.get<PaginatedResponse<Supplier>>(`/suppliers${query ? `?${query}` : ""}`);
  },

  get: (id: number) => api.get<Supplier>(`/suppliers/${id}`),

  create: (data: SupplierWrite) => api.post<Supplier>("/suppliers", data),

  update: (id: number, data: SupplierWrite) => api.put<Supplier>(`/suppliers/${id}`, data),

  delete: (id: number) => api.delete<void>(`/suppliers/${id}`),
};
