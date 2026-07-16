import { api } from "../api";
import type { BillingEvent, PaginatedResponse } from "../types";

export interface BillingStats {
  mrr: number;
  overdue: number;
  paidThisMonth: number;
}

export const billingService = {
  list: (params?: { status?: string; page?: number; search?: string }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.page !== undefined) qs.set("page", String(params.page));
    if (params?.search) qs.set("search", params.search);
    const query = qs.toString();
    return api.get<PaginatedResponse<BillingEvent>>(`/admin/billing${query ? `?${query}` : ""}`);
  },

  getStats: () => api.get<BillingStats>("/admin/billing/stats"),
};
