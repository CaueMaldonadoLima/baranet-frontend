import { api } from "../api";
import type { Customer, CustomerDetail, CustomerWrite, PaginatedResponse } from "../types";

export const customersService = {
  list: (params?: { page?: number; per_page?: number; search?: string }) => {
    const qs = new URLSearchParams();
    if (params?.page !== undefined) qs.set("page", String(params.page));
    if (params?.per_page !== undefined) qs.set("per_page", String(params.per_page));
    if (params?.search) qs.set("search", params.search);
    const query = qs.toString();
    return api.get<PaginatedResponse<Customer>>(`/customers${query ? `?${query}` : ""}`);
  },

  get: (id: number) => api.get<CustomerDetail>(`/customers/${id}`),

  create: (data: CustomerWrite) => api.post<CustomerDetail>("/customers", data),

  update: (id: number, data: CustomerWrite) => api.put<CustomerDetail>(`/customers/${id}`, data),

  delete: (id: number) => api.delete<void>(`/customers/${id}`),
};
