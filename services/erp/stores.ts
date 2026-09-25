import { api, toQueryString } from "../api";
import type { IdNome, PaginatedResponse } from "../types";

// O Swagger não documenta o schema de /stores. Usamos só id e name, os mesmos
// campos de allowedStores do fornecedor.
export const storesService = {
  list: (params: { per_page?: number; search?: string } = {}) =>
    api.get<PaginatedResponse<IdNome>>(`/stores${toQueryString({ ...params })}`),
};
