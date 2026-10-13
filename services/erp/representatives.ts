import { api, toQueryString } from "../api";
import type { PaginatedResponse, Representative, RepresentativeWrite } from "../types";

// Representantes de marca (papel sobre people). Os filtros de segmento e
// região não são aplicados pela API: só `search` (nome/documento) e `brand_id`.
export interface ListRepresentativesParams {
  page?: number;
  per_page?: number;
  search?: string;
  brand_id?: number;
}

export const representativesService = {
  list: (params: ListRepresentativesParams = {}) =>
    api.get<PaginatedResponse<Representative>>(`/representatives${toQueryString({ ...params })}`),

  get: (id: number) => api.get<Representative>(`/representatives/${id}`),

  create: (data: RepresentativeWrite) => api.post<Representative>("/representatives", data),

  update: (id: number, data: RepresentativeWrite) => api.put<Representative>(`/representatives/${id}`, data),
};
