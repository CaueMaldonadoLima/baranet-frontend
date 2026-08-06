// Estrutura padrão de erro retornado pela API Laravel
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>; // erros de validação Laravel
  status: number;
}

// Wrapper de resposta bem-sucedida
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Resposta paginada (padrão Laravel)
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}

// Tipos Admin
export type OticaStatus = "ativo" | "suspenso" | "trial";
export interface Otica {
  id: number;
  name: string;
  cnpj: string;
  status: OticaStatus;
  plan: string;
  city: string;
  state: string;
  since: string;
  mrr: number;
  stores: number;
}
export interface Plan {
  id: number;
  name: string;
  price: number;
  annualPrice: number;
  modules: string[];
  oticas: number;
  active: boolean;
}
export interface Module {
  id: number;
  slug: string;
  name: string;
  description: string;
  category: string;
  active: boolean;
}
export interface BillingEvent {
  id: number;
  otica: string;
  type: string;
  value: number;
  status: string;
  date: string | null;
  dueDate: string;
}
export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastAccess: string;
}

// Tipos ERP
export interface Customer {
  id: number;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  lastPurchase: string;
  totalPurchases: number;
  totalValue: number;
}
export interface Sale {
  id: number;
  customer: string;
  cpf: string;
  value: number;
  discount: number;
  total: number;
  date: string;
  status: string;
  paymentMethod: string;
  items: number;
}
export interface Product {
  id: number;
  code: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  active: boolean;
}
export interface StockMovement {
  id: number;
  product: string;
  type: "entrada" | "saída" | "ajuste";
  qty: number;
  reason: string;
  date: string;
  user: string;
}
export interface LabOrder {
  id: number;
  customer: string;
  product: string;
  lab: string;
  status: string;
  prescription: string;
  sentDate: string;
  dueDate: string;
}
export interface Supplier {
  id: number;
  name: string;
  cnpj: string;
  contact: string;
  phone: string;
  email: string;
  category: string;
  lastOrder: string;
  totalOrders: number;
}
export interface Employee {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  store: string;
  status: string;
  commission: number;
  sales: number;
}
export interface FiscalNote {
  id: number;
  number: string;
  customer: string;
  value: number;
  status: string;
  issued: string;
  type: string;
}
export interface CashMovement {
  id: number;
  type: "entrada" | "saída";
  description: string;
  value: number;
  method: string;
  date: string;
  user: string;
}

// Tipos criação (Create DTOs)
export interface CreateOticaDTO {
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  planId: number;
  responsibleName: string;
  responsibleEmail: string;
}
export interface CreateSaleDTO {
  customerId?: number;
  customerName: string;
  items: Array<{ productId: number; qty: number; price: number }>;
  discount: number;
  paymentMethod: string;
}
export interface CreateCustomerDTO {
  name: string;
  cpf?: string;
  phone?: string;
  email?: string;
  city?: string;
  state?: string;
}
export interface CreateSupplierDTO {
  name: string;
  cnpj?: string;
  contact?: string;
  phone?: string;
  email?: string;
  category?: string;
}

// Erro de rede ou parse
export class ApiRequestError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.errors = errors;
  }
}
