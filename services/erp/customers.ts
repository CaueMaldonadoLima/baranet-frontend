import { api } from "../api";
import type { Customer, CreateCustomerDTO, PaginatedResponse } from "../types";

export const customersService = {
  list: (params?: { page?: number; per_page?: number; search?: string }) => {
    const qs = new URLSearchParams();
    if (params?.page !== undefined) qs.set("page", String(params.page));
    if (params?.per_page !== undefined) qs.set("per_page", String(params.per_page));
    if (params?.search) qs.set("search", params.search);
    const query = qs.toString();
    return api.get<PaginatedResponse<Customer>>(`/customers${query ? `?${query}` : ""}`);
  },

  get: (id: number) => api.get<Customer>(`/customers/${id}`),

  create: (data: CreateCustomerDTO) => api.post<Customer>("/customers", data),

  update: (id: number, data: Partial<CreateCustomerDTO>) =>
    api.put<Customer>(`/customers/${id}`, data),

  delete: (id: number) => api.delete<void>(`/customers/${id}`),
};
