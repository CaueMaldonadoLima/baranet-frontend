import { api } from "../api";
import type { StockMovement, PaginatedResponse } from "../types";

export interface StockAdjustDTO {
  productId: number;
  qty: number;
  reason: string;
}

export const stockService = {
  movements: (params?: { page?: number; search?: string; type?: string }) => {
    const qs = new URLSearchParams();
    if (params?.page !== undefined) qs.set("page", String(params.page));
    if (params?.search) qs.set("search", params.search);
    if (params?.type) qs.set("type", params.type);
    const query = qs.toString();
    return api.get<PaginatedResponse<StockMovement>>(`/erp/stock/movements${query ? `?${query}` : ""}`);
  },

  adjust: (data: StockAdjustDTO) =>
    api.post<StockMovement>("/erp/stock/adjust", data),
};
