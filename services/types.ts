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
/** Bloco "Produtos para consumo" / "Mercadoria para revenda" do fornecedor */
export interface SupplierProductBlock {
  enabled: boolean;
  types: string[];
  brands: string[];
}
export interface SupplierDeliveryFinance {
  generatesPayablePerOrder: boolean;
  batchOrderClosing: boolean;
  enableCustomerBilling: boolean;
}
export interface SupplierCard {
  dueDay: number | null;
  closingDay: number | null;
  limit: number | null;
}
export interface SupplierFiscalRules {
  financialClosingEnabled: boolean;
  financialClosingDays: number | null;
  autoFinanceOnXml: boolean;
  isRealProfitExpense: boolean;
  keepSalePriceOnXml: boolean;
  divergenceCreatesCreditTask: boolean;
}
export interface SupplierEmail {
  id?: number;
  description: string | null;
  sector: string | null;
  email: string;
}
/** Referência genérica id + nome (lojas, funcionários, autorizados) */
export interface IdNome {
  id: number;
  name: string;
}
/** Loja ou funcionário autorizado a usar o serviço do fornecedor */
export type SupplierAllowed = IdNome;
export interface SupplierLaboratory {
  id?: number;
  slot: number;
  active: boolean;
  name: string | null;
}
/** Papel fornecedor sobre uma Pessoa (GET /suppliers/{id}) — schema Supplier do Swagger */
export interface Supplier {
  id: number;
  /** Pessoa por trás do papel fornecedor (ver Person) */
  personId: number;
  personType?: "fisica" | "juridica" | null;
  /** Nome de exibição (tradeName ou legalName) */
  name: string;
  legalName?: string | null;
  tradeName?: string | null;
  /** CPF (11) ou CNPJ (14), só dígitos */
  document?: string | null;
  /** Alias de document (compat) */
  cnpj: string | null;
  ddd?: string | null;
  phone: string | null;
  email?: string | null;
  /** Status do papel fornecedor — independe do status da Pessoa */
  status?: "ativo" | "inativo";
  siteUrl?: string | null;
  stateRegistration?: string | null;
  contact?: string | null;
  category?: string | null;
  supplierOf?: string | null;
  accountingGroup?: string | null;
  defaultCfop?: string | null;
  taxRegime?: string | null;
  purchaseCode?: string | null;
  isDeliverySupplier?: boolean;
  isUtilitiesSupplier?: boolean;
  isCardSupplier?: boolean;
  deliveryFinance?: Partial<SupplierDeliveryFinance>;
  card?: Partial<SupplierCard>;
  fiscalRules?: Partial<SupplierFiscalRules>;
  consumptionProducts?: Partial<SupplierProductBlock>;
  resaleProducts?: Partial<SupplierProductBlock>;
  address?: Partial<PersonAddress>;
  emails?: SupplierEmail[];
  laboratories?: SupplierLaboratory[];
  allowedStores?: SupplierAllowed[];
  allowedUsers?: SupplierAllowed[];
  lastOrder: string | null;
  totalOrders: number;
}
/** POST/PUT /suppliers — schema SupplierWrite do Swagger */
export interface SupplierWrite {
  personId?: number;
  personType?: "fisica" | "juridica" | null;
  name?: string | null;
  legalName?: string | null;
  tradeName?: string | null;
  document?: string | null;
  ddd?: string | null;
  phone?: string | null;
  status?: "ativo" | "inativo";
  siteUrl?: string | null;
  stateRegistration?: string | null;
  supplierOf?: string | null;
  accountingGroup?: string | null;
  /** 4 dígitos */
  defaultCfop?: string | null;
  taxRegime?: string | null;
  purchaseCode?: string | null;
  email?: string | null;
  contact?: string | null;
  category?: string | null;
  isDeliverySupplier?: boolean;
  isUtilitiesSupplier?: boolean;
  isCardSupplier?: boolean;
  deliveryFinance?: SupplierDeliveryFinance;
  card?: { dueDay?: number | null; closingDay?: number | null; limit?: number | null };
  fiscalRules?: { financialClosingDays?: number | null } & Omit<SupplierFiscalRules, "financialClosingDays">;
  consumptionProducts?: SupplierProductBlock;
  resaleProducts?: SupplierProductBlock;
  address?: Partial<Record<keyof PersonAddress, string | null>>;
  emails?: { description?: string | null; sector?: string | null; email: string }[];
  laboratories?: { slot: number; active: boolean; name?: string | null }[];
  allowedStoreIds?: number[];
  allowedUserIds?: number[];
}
/** Cliente como vem em GET /customers/{id} — schema Customer do Swagger */
export interface CustomerDetail {
  id: number;
  personId: number;
  personType?: "fisica" | "juridica" | null;
  name: string;
  document?: string | null;
  ddd?: string | null;
  phone?: string | null;
  email?: string | null;
  status?: "ativo" | "inativo";
  whatsapp?: string | null;
  customerType?: string | null;
  allowWithoutDocument?: boolean;
  rg?: string | null;
  birthDate?: string | null;
  gender?: string | null;
  maritalStatus?: string | null;
  birthplace?: string | null;
  commercialDdd?: string | null;
  commercialPhone?: string | null;
  extension?: string | null;
  isForeigner?: boolean;
  foreignerStatus?: string | null;
  rgIssueDate?: string | null;
  rgIssuer?: string | null;
  rgState?: string | null;
  nickname?: string | null;
  photoUrl?: string | null;
  socialNetworks?: CustomerSocialNetworks;
  address?: Partial<PersonAddress>;
  lastPurchase?: string | null;
  registeredAt?: string | null;
  updatedAt?: string | null;
}
export type CustomerSocialNetworks = Partial<
  Record<"facebook" | "instagram" | "youtube" | "twitter" | "tiktok", string | null>
>;
/** POST/PUT /customers — schema CustomerWrite do Swagger (campos da tela 02) */
export interface CustomerWrite {
  personId?: number;
  personType?: "fisica" | "juridica" | null;
  ddd?: string | null;
  phone?: string | null;
  email?: string | null;
  photoUrl?: string | null;
  socialNetworks?: CustomerSocialNetworks;
  name?: string | null;
  document?: string | null;
  status?: "ativo" | "inativo";
  whatsapp?: string | null;
  customerType?: string | null;
  allowWithoutDocument?: boolean;
  rg?: string | null;
  birthDate?: string | null;
  gender?: string | null;
  maritalStatus?: string | null;
  birthplace?: string | null;
  commercialDdd?: string | null;
  commercialPhone?: string | null;
  extension?: string | null;
  isForeigner?: boolean;
  foreignerStatus?: string | null;
  rgIssueDate?: string | null;
  rgIssuer?: string | null;
  rgState?: string | null;
  nickname?: string | null;
  country?: string | null;
  address?: Partial<Record<keyof PersonAddress, string | null>>;
  city?: string | null;
  state?: string | null;
}
// Pessoa: cadastro-base (nome, documento, endereço) compartilhado pelos
// papéis. Cliente, fornecedor, funcionário, médico e convênio são papéis
// ligados a ela por personId (GET /people — ver docs/backend-contract.md).
export type PersonRole = "customer" | "supplier" | "employee" | "doctor" | "agreement";
/** `without_*` servem aos pickers de "Salvar como" (pessoas sem o papel). */
export type PersonRoleFilter = PersonRole | "without_supplier" | "without_customer";
export interface PersonAddress {
  zip: string | null;
  state: string | null;
  streetType: string | null;
  neighborhood: string | null;
  country: string | null;
  city: string | null;
  street: string | null;
  number: string | null;
  complement: string | null;
}
export interface Person {
  id: number;
  /** Código exibido na grid (hoje = id da pessoa) */
  code: number;
  personType: "fisica" | "juridica";
  /** Razão social / nome */
  name: string;
  tradeName: string | null;
  document: string | null;
  rg: string | null;
  stateRegistration: string | null;
  rgOrIe: string | null;
  ddd: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  status: "ativo" | "inativo";
  siteUrl: string | null;
  city: string | null;
  state: string | null;
  address: PersonAddress;
  roles: PersonRole[];
  roleFlags: Record<PersonRole, boolean>;
  customerId: number | null;
  supplierId: number | null;
  employeeId: number | null;
  doctorId: number | null;
  agreementId: number | null;
}
// Marca (fabricante) e seus Representantes comerciais — ver CONTEXT.md.
// Não confundir com o Tipo de Cadastro "Representante".
export interface BrandSegment {
  id?: number;
  name: string;
  status: "ativo" | "inativo";
}
/** Representante de marca como vem embutido na Brand */
export interface BrandRepresentative {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
}
export interface Brand {
  id: number;
  name: string;
  code: string | null;
  origin: string | null;
  logoUrl: string | null;
  history: string | null;
  active: boolean;
  segments?: BrandSegment[];
  representativeIds?: number[];
  /** Representantes da marca */
  representatives?: BrandRepresentative[];
}
/** Marca como vem em /suppliers/{id}/brands: com os campos do vínculo */
export interface SupplierBrand extends Brand {
  product: string | null;
  validFrom: string | null;
  validUntil: string | null;
  /** Representante do vínculo — um dos representantes da marca */
  representativeId: number | null;
}
export interface BrandWrite {
  name: string;
  code?: string;
  origin?: string;
  logoUrl?: string;
  history?: string;
  active?: boolean;
  segments?: Omit<BrandSegment, "id">[];
  representativeIds?: number[];
}
export interface SupplierBrandAttach {
  brandId: number;
  product?: string;
  validFrom?: string;
  validUntil?: string;
  representativeId?: number;
}
/**
 * GET /representatives — o Swagger ainda não documenta schema nem filtros.
 * Só `name` é obrigatório no POST; phone/email seguem o representante
 * embutido na Brand.
 */
export type Representative = BrandRepresentative;
export interface RepresentativeWrite {
  name: string;
  phone?: string;
  email?: string;
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

/** Mensagem para o usuário a partir de um erro de requisição */
export function mensagemDeErro(err: unknown) {
  return err instanceof ApiRequestError
    ? err.message
    : "Verifique sua conexão e tente novamente.";
}
