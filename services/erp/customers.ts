import { api } from "../api";
import type { Customer, CreateCustomerDTO, PaginatedResponse } from "../types";

export const customersService = {
  list: (params?: { page?: number; search?: string }) => {
    const qs = new URLSearchParams();
    if (params?.page !== undefined) qs.set("page", String(params.page));
    if (params?.search) qs.set("search", params.search);
    const query = qs.toString();
    return api.get<PaginatedResponse<Customer>>(`/erp/customers${query ? `?${query}` : ""}`);
  },

  get: (id: number) => api.get<Customer>(`/erp/customers/${id}`),

  create: (data: CreateCustomerDTO) => api.post<Customer>("/erp/customers", data),

  update: (id: number, data: Partial<CreateCustomerDTO>) =>
    api.put<Customer>(`/erp/customers/${id}`, data),

  delete: (id: number) => api.delete<void>(`/erp/customers/${id}`),
};
