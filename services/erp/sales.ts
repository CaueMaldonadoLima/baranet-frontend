import { api } from "../api";
import type { Sale, CreateSaleDTO, PaginatedResponse } from "../types";

export const salesService = {
  list: (params?: { page?: number; search?: string; status?: string }) => {
    const qs = new URLSearchParams();
    if (params?.page !== undefined) qs.set("page", String(params.page));
    if (params?.search) qs.set("search", params.search);
    if (params?.status) qs.set("status", params.status);
    const query = qs.toString();
    return api.get<PaginatedResponse<Sale>>(`/erp/sales${query ? `?${query}` : ""}`);
  },

  get: (id: number) => api.get<Sale>(`/erp/sales/${id}`),

  create: (data: CreateSaleDTO) => api.post<Sale>("/erp/sales", data),

  cancel: (id: number) => api.patch<Sale>(`/erp/sales/${id}/cancel`),
};
