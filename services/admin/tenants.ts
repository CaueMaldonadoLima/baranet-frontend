import { api } from "../api";
import type { Otica, CreateOticaDTO, PaginatedResponse } from "../types";

export const tenantsService = {
  list: (params?: { page?: number; status?: string; search?: string }) => {
    const qs = new URLSearchParams();
    if (params?.page !== undefined) qs.set("page", String(params.page));
    if (params?.status) qs.set("status", params.status);
    if (params?.search) qs.set("search", params.search);
    const query = qs.toString();
    return api.get<PaginatedResponse<Otica>>(`/admin/oticas${query ? `?${query}` : ""}`);
  },

  get: (id: number) => api.get<Otica>(`/admin/oticas/${id}`),

  create: (data: CreateOticaDTO) => api.post<Otica>("/admin/oticas", data),

  update: (id: number, data: Partial<CreateOticaDTO>) =>
    api.put<Otica>(`/admin/oticas/${id}`, data),

  suspend: (id: number) => api.patch<Otica>(`/admin/oticas/${id}/suspend`),

  activate: (id: number) => api.patch<Otica>(`/admin/oticas/${id}/activate`),

  delete: (id: number) => api.delete<void>(`/admin/oticas/${id}`),
};
