import { api } from "../api";
import type { Person, PersonRoleFilter, PaginatedResponse } from "../types";

export interface ListPeopleParams {
  page?: number;
  per_page?: number;
  /** Busca ampla (nome, fantasia, documento, e-mail, telefone, whatsapp, código) */
  search?: string;
  /** Nome / Código */
  name?: string;
  /** CPF / CNPJ — a API ignora a máscara */
  document?: string;
  /** Whatsapp do papel cliente — a API ignora a máscara */
  whatsapp?: string;
  status?: "ativo" | "inativo";
  role?: PersonRoleFilter;
}

export const peopleService = {
  list: (params: ListPeopleParams = {}) => {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") qs.set(key, String(value));
    }
    const query = qs.toString();
    return api.get<PaginatedResponse<Person>>(`/people${query ? `?${query}` : ""}`);
  },

  get: (id: number) => api.get<Person>(`/people/${id}`),
};
