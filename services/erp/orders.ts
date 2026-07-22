import { api } from "../api";
import type { LabOrder, PaginatedResponse } from "../types";

export interface CreateLabOrderDTO {
  customer: string;
  product: string;
  lab: string;
  prescription: string;
  dueDate: string;
}

export const ordersService = {
  list: (params?: { page?: number; search?: string; status?: string }) => {
    const qs = new URLSearchParams();
    if (params?.page !== undefined) qs.set("page", String(params.page));
    if (params?.search) qs.set("search", params.search);
    if (params?.status) qs.set("status", params.status);
    const query = qs.toString();
    return api.get<PaginatedResponse<LabOrder>>(`/erp/orders${query ? `?${query}` : ""}`);
  },

  get: (id: number) => api.get<LabOrder>(`/erp/orders/${id}`),

  create: (data: CreateLabOrderDTO) => api.post<LabOrder>("/erp/orders", data),

  updateStatus: (id: number, status: string) =>
    api.patch<LabOrder>(`/erp/orders/${id}/status`, { status }),
};
