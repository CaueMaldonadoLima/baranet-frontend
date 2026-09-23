import { api, toQueryString } from "../api";
import type { PaginatedResponse, Representative, RepresentativeWrite } from "../types";

// Representantes de marca — não é o Tipo de Cadastro "Representante".
export interface ListRepresentativesParams {
  page?: number;
  per_page?: number;
  /** Não documentado no Swagger: se a API ignorar, a lista vem sem filtro */
  search?: string;
}

export const representativesService = {
  list: (params: ListRepresentativesParams = {}) =>
    api.get<PaginatedResponse<Representative>>(`/representatives${toQueryString({ ...params })}`),

  create: (data: RepresentativeWrite) => api.post<Representative>("/representatives", data),
};
