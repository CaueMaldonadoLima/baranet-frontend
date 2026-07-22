export const mockOticas = [
  { id: 1, name: "Ótica Visão Clara", cnpj: "12.345.678/0001-90", status: "ativo", plan: "Premium", city: "São Paulo", state: "SP", since: "2024-01-15", mrr: 599, stores: 3 },
  { id: 2, name: "Ótica Central", cnpj: "98.765.432/0001-10", status: "ativo", plan: "Básico", city: "Belo Horizonte", state: "MG", since: "2024-03-20", mrr: 199, stores: 1 },
  { id: 3, name: "Grupo Optical", cnpj: "45.678.901/0001-23", status: "ativo", plan: "Enterprise", city: "Rio de Janeiro", state: "RJ", since: "2023-11-05", mrr: 1299, stores: 8 },
  { id: 4, name: "Ótica do Povo", cnpj: "78.901.234/0001-56", status: "suspenso", plan: "Básico", city: "Curitiba", state: "PR", since: "2024-02-10", mrr: 0, stores: 1 },
  { id: 5, name: "Ótica Moderna", cnpj: "23.456.789/0001-78", status: "ativo", plan: "Padrão", city: "Porto Alegre", state: "RS", since: "2024-04-01", mrr: 399, stores: 2 },
  { id: 6, name: "Ótica Família", cnpj: "56.789.012/0001-34", status: "ativo", plan: "Padrão", city: "Fortaleza", state: "CE", since: "2024-05-12", mrr: 399, stores: 2 },
  { id: 7, name: "Ótica Premium", cnpj: "89.012.345/0001-67", status: "trial", plan: "Premium", city: "Brasília", state: "DF", since: "2026-05-01", mrr: 0, stores: 1 },
  { id: 8, name: "Ótica Express", cnpj: "34.567.890/0001-45", status: "suspenso", plan: "Básico", city: "Manaus", state: "AM", since: "2024-06-18", mrr: 0, stores: 1 },
];

export const mockPlans = [
  { id: 1, name: "Básico", price: 199, annualPrice: 1990, oticas: 3, modules: ["vendas", "clientes", "estoque", "caixa"], active: true },
  { id: 2, name: "Padrão", price: 399, annualPrice: 3990, oticas: 2, modules: ["vendas", "clientes", "estoque", "caixa", "fiscal", "laboratorio", "fornecedores"], active: true },
  { id: 3, name: "Premium", price: 599, annualPrice: 5990, oticas: 2, modules: ["todos"], active: true },
  { id: 4, name: "Enterprise", price: 1299, annualPrice: 12990, oticas: 1, modules: ["todos", "multi-store", "api", "suporte-prioritario"], active: true },
];

export const mockModules = [
  { id: 1, slug: "vendas", name: "Vendas / PDV", description: "Ponto de venda, frente de caixa", category: "core", active: true },
  { id: 2, slug: "clientes", name: "Clientes / CRM", description: "Cadastro e histórico de clientes", category: "core", active: true },
  { id: 3, slug: "estoque", name: "Estoque", description: "Controle de produtos e movimentações", category: "core", active: true },
  { id: 4, slug: "caixa", name: "Caixa", description: "Abertura, fechamento e movimentações", category: "core", active: true },
  { id: 5, slug: "fiscal", name: "Fiscal / NF-e", description: "Emissão de notas fiscais eletrônicas", category: "fiscal", active: true },
  { id: 6, slug: "laboratorio", name: "Pedidos de Lab.", description: "Envio e acompanhamento de pedidos", category: "operacional", active: true },
  { id: 7, slug: "fornecedores", name: "Fornecedores", description: "Cadastro e pedidos de compra", category: "operacional", active: true },
  { id: 8, slug: "funcionarios", name: "Funcionários", description: "CRUD, permissões e comissões", category: "rh", active: true },
  { id: 9, slug: "relatorios", name: "Relatórios", description: "Relatórios gerenciais e gráficos", category: "analytics", active: true },
  { id: 10, slug: "multi-store", name: "Multi-loja", description: "Gerenciamento de múltiplas filiais", category: "enterprise", active: true },
  { id: 11, slug: "api", name: "API Pública", description: "Integração via API REST", category: "enterprise", active: false },
];

export const mockBillingEvents = [
  { id: 1, otica: "Ótica Visão Clara", type: "payment", value: 599, status: "pago", date: "2026-05-01", dueDate: "2026-05-05" },
  { id: 2, otica: "Ótica Central", type: "payment", value: 199, status: "pago", date: "2026-05-01", dueDate: "2026-05-05" },
  { id: 3, otica: "Grupo Optical", type: "payment", value: 1299, status: "pago", date: "2026-05-01", dueDate: "2026-05-05" },
  { id: 4, otica: "Ótica Moderna", type: "payment", value: 399, status: "pendente", date: null, dueDate: "2026-05-10" },
  { id: 5, otica: "Ótica Família", type: "payment", value: 399, status: "atrasado", date: null, dueDate: "2026-04-10" },
  { id: 6, otica: "Ótica do Povo", type: "payment", value: 199, status: "cancelado", date: null, dueDate: "2026-04-15" },
  { id: 7, otica: "Ótica Express", type: "payment", value: 199, status: "cancelado", date: null, dueDate: "2026-04-15" },
];

export const mockAdminUsers = [
  { id: 1, name: "Carlos Baranet", email: "carlos@baranet.com.br", role: "super_admin", status: "ativo", lastAccess: "2026-05-22" },
  { id: 2, name: "Ana Suporte", email: "ana@baranet.com.br", role: "suporte", status: "ativo", lastAccess: "2026-05-21" },
  { id: 3, name: "Pedro Comercial", email: "pedro@baranet.com.br", role: "comercial", status: "ativo", lastAccess: "2026-05-20" },
  { id: 4, name: "Lucia Financeiro", email: "lucia@baranet.com.br", role: "financeiro", status: "ativo", lastAccess: "2026-05-19" },
];

export const mockAdminKpis = {
  totalOticas: 8,
  activasOticas: 5,
  mrr: 2895,
  mrrGrowth: 12.4,
  churnRate: 2.1,
  newThisMonth: 1,
  trialConversion: 68,
  avgRevPerOtica: 579,
};
