import { api, toQueryString } from "../api";
import type { Employee, EmployeeWrite, PaginatedResponse } from "../types";

// Funcionários (aba USUÁRIO). O id é o de optica_users, não o personId.
export const employeesService = {
  list: (params: { page?: number; per_page?: number; search?: string; status?: "ativo" | "inativo" } = {}) =>
    api.get<PaginatedResponse<Employee>>(`/employees${toQueryString({ ...params })}`),

  get: (id: number) => api.get<Employee>(`/employees/${id}`),

  /** Sem senha, a resposta traz firstAccessToken (só desta vez) */
  create: (data: EmployeeWrite) => api.post<Employee & { firstAccessToken?: string }>("/employees", data),

  update: (id: number, data: EmployeeWrite) => api.put<Employee>(`/employees/${id}`, data),
};
