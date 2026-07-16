import { api } from "../api";
import type { Plan, PaginatedResponse } from "../types";

export interface CreatePlanDTO {
  name: string;
  price: number;
  annualPrice: number;
  modules: string[];
}

export const plansService = {
  list: (params?: { page?: number; search?: string }) => {
    const qs = new URLSearchParams();
    if (params?.page !== undefined) qs.set("page", String(params.page));
    if (params?.search) qs.set("search", params.search);
    const query = qs.toString();
    return api.get<PaginatedResponse<Plan>>(`/admin/plans${query ? `?${query}` : ""}`);
  },

  get: (id: number) => api.get<Plan>(`/admin/plans/${id}`),

  create: (data: CreatePlanDTO) => api.post<Plan>("/admin/plans", data),

  update: (id: number, data: Partial<CreatePlanDTO>) =>
    api.put<Plan>(`/admin/plans/${id}`, data),

  delete: (id: number) => api.delete<void>(`/admin/plans/${id}`),
};
