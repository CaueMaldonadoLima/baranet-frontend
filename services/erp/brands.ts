import { api, toQueryString } from "../api";
import type {
  Brand,
  BrandWrite,
  PaginatedResponse,
  SupplierBrand,
  SupplierBrandAttach,
} from "../types";

export interface ListBrandsParams {
  page?: number;
  per_page?: number;
  search?: string;
}

export const brandsService = {
  list: (params: ListBrandsParams = {}) =>
    api.get<PaginatedResponse<Brand>>(`/brands${toQueryString({ ...params })}`),

  create: (data: BrandWrite) => api.post<Brand>("/brands", data),

  /** Marcas vinculadas ao fornecedor, com os campos do vínculo */
  listBySupplier: (supplierId: number) =>
    api.get<{ data: SupplierBrand[] }>(`/suppliers/${supplierId}/brands`),

  attachToSupplier: (supplierId: number, data: SupplierBrandAttach) =>
    api.post<SupplierBrand>(`/suppliers/${supplierId}/brands`, data),
};
