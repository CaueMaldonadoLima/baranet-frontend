import { api, toQueryString } from "../api";
import type { IdNome, PaginatedResponse } from "../types";

// O Swagger não documenta o schema de /employees. Usamos só id e name, os
// mesmos campos de allowedUsers do fornecedor.
export const employeesService = {
  list: (params: { per_page?: number } = {}) =>
    api.get<PaginatedResponse<IdNome>>(`/employees${toQueryString({ ...params })}`),
};
