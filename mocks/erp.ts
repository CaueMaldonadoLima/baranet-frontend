export const mockCustomers = [
  { id: 1, name: "João Silva", cpf: "123.456.789-00", phone: "(11) 98765-4321", email: "joao.silva@email.com", city: "São Paulo", state: "SP", lastPurchase: "2026-05-10", totalPurchases: 5, totalValue: 2350 },
  { id: 2, name: "Maria Santos", cpf: "987.654.321-00", phone: "(11) 91234-5678", email: "maria@email.com", city: "São Paulo", state: "SP", lastPurchase: "2026-05-18", totalPurchases: 3, totalValue: 1120 },
  { id: 3, name: "Pedro Oliveira", cpf: "456.789.012-34", phone: "(21) 99876-5432", email: "pedro@email.com", city: "Rio de Janeiro", state: "RJ", lastPurchase: "2026-04-30", totalPurchases: 1, totalValue: 450 },
  { id: 4, name: "Ana Costa", cpf: "321.654.987-10", phone: "(11) 97654-3210", email: "ana.costa@email.com", city: "São Paulo", state: "SP", lastPurchase: "2026-05-20", totalPurchases: 8, totalValue: 4200 },
  { id: 5, name: "Carlos Ferreira", cpf: "654.321.098-76", phone: "(51) 98765-1234", email: "carlos@email.com", city: "Porto Alegre", state: "RS", lastPurchase: "2026-03-15", totalPurchases: 2, totalValue: 890 },
  { id: 6, name: "Lucia Mendes", cpf: "789.012.345-67", phone: "(41) 99012-3456", email: "lucia@email.com", city: "Curitiba", state: "PR", lastPurchase: "2026-05-05", totalPurchases: 4, totalValue: 1780 },
  { id: 7, name: "Roberto Lima", cpf: "012.345.678-90", phone: "(11) 96543-2109", email: "roberto@email.com", city: "São Paulo", state: "SP", lastPurchase: "2026-05-22", totalPurchases: 6, totalValue: 3100 },
];

export const mockSales = [
  { id: 1001, customer: "João Silva", cpf: "123.456.789-00", value: 850, discount: 50, total: 800, date: "2026-05-22", status: "pago", paymentMethod: "cartão", items: 2 },
  { id: 1002, customer: "Ana Costa", cpf: "321.654.987-10", value: 1200, discount: 0, total: 1200, date: "2026-05-22", status: "pago", paymentMethod: "pix", items: 3 },
  { id: 1003, customer: "Roberto Lima", cpf: "012.345.678-90", value: 650, discount: 0, total: 650, date: "2026-05-22", status: "pendente", paymentMethod: "crediário", items: 1 },
  { id: 1004, customer: "Maria Santos", cpf: "987.654.321-00", value: 450, discount: 20, total: 430, date: "2026-05-21", status: "pago", paymentMethod: "dinheiro", items: 1 },
  { id: 1005, customer: "Carlos Ferreira", cpf: "654.321.098-76", value: 980, discount: 80, total: 900, date: "2026-05-21", status: "pago", paymentMethod: "cartão", items: 2 },
  { id: 1006, customer: "Lucia Mendes", cpf: "789.012.345-67", value: 320, discount: 0, total: 320, date: "2026-05-20", status: "cancelado", paymentMethod: "pix", items: 1 },
  { id: 1007, customer: "Pedro Oliveira", cpf: "456.789.012-34", value: 750, discount: 50, total: 700, date: "2026-05-20", status: "pago", paymentMethod: "cartão", items: 2 },
];

export const mockProducts = [
  { id: 1, code: "ARM-001", name: "Armação Clipon Titanium", category: "armação", brand: "Rayban", price: 480, cost: 220, stock: 12, minStock: 3, active: true },
  { id: 2, code: "LNT-001", name: "Lente Transitions Trivex 1.67", category: "lente", brand: "Essilor", price: 890, cost: 380, stock: 8, minStock: 5, active: true },
  { id: 3, code: "ARM-002", name: "Armação Acetato Redonda", category: "armação", brand: "Oakley", price: 320, cost: 140, stock: 5, minStock: 3, active: true },
  { id: 4, code: "LNT-002", name: "Lente Antirreflexo Blue Cut 1.56", category: "lente", brand: "Hoya", price: 350, cost: 150, stock: 15, minStock: 8, active: true },
  { id: 5, code: "SOL-001", name: "Óculos Solar Polarizado", category: "solar", brand: "Rayban", price: 650, cost: 280, stock: 7, minStock: 2, active: true },
  { id: 6, code: "LNT-003", name: "Lente Multifocal Digital 1.74", category: "lente", brand: "Zeiss", price: 1450, cost: 620, stock: 4, minStock: 2, active: true },
  { id: 7, code: "ACE-001", name: "Estojo Rígido Couro", category: "acessório", brand: "Baranet", price: 45, cost: 15, stock: 30, minStock: 10, active: true },
  { id: 8, code: "ARM-003", name: "Armação Infantil Flexível", category: "armação", brand: "Silhouette", price: 280, cost: 120, stock: 0, minStock: 3, active: false },
];

export const mockStockMovements = [
  { id: 1, product: "Armação Clipon Titanium", type: "entrada", qty: 10, reason: "Compra fornecedor", date: "2026-05-15", user: "Admin" },
  { id: 2, product: "Lente Transitions Trivex", type: "saída", qty: 2, reason: "Venda #1002", date: "2026-05-22", user: "Vendedor 1" },
  { id: 3, product: "Armação Acetato Redonda", type: "saída", qty: 1, reason: "Venda #1001", date: "2026-05-22", user: "Vendedor 1" },
  { id: 4, product: "Óculos Solar Polarizado", type: "ajuste", qty: -1, reason: "Quebra/avaria", date: "2026-05-18", user: "Admin" },
  { id: 5, product: "Lente Antirreflexo Blue Cut", type: "entrada", qty: 20, reason: "Compra fornecedor", date: "2026-05-10", user: "Admin" },
];

export const mockLabOrders = [
  { id: 501, customer: "João Silva", product: "Lente Transitions Trivex 1.67", lab: "Lab Visão", status: "em_producao", prescription: "OD: -2.00 -0.50 180 / OE: -1.75 -0.25 170", sentDate: "2026-05-20", dueDate: "2026-05-25" },
  { id: 502, customer: "Ana Costa", product: "Lente Multifocal Digital 1.74", lab: "Óticas Brasil Lab", status: "pronto", prescription: "OD: +1.50 add +2.00 / OE: +1.75 add +2.00", sentDate: "2026-05-15", dueDate: "2026-05-22" },
  { id: 503, customer: "Maria Santos", product: "Lente Antirreflexo Blue Cut 1.56", lab: "Lab Visão", status: "aguardando", prescription: "OD: -0.50 / OE: -0.75", sentDate: "2026-05-22", dueDate: "2026-05-27" },
  { id: 504, customer: "Roberto Lima", product: "Lente Antirreflexo Blue Cut 1.56", lab: "Óticas Brasil Lab", status: "entregue", prescription: "OD: -3.00 -1.00 90 / OE: -2.75 -0.75 85", sentDate: "2026-05-10", dueDate: "2026-05-17" },
  { id: 505, customer: "Carlos Ferreira", product: "Lente Multifocal Digital 1.74", lab: "Lab Visão", status: "em_producao", prescription: "OD: +2.25 add +2.50 / OE: +2.50 add +2.50", sentDate: "2026-05-19", dueDate: "2026-05-26" },
];

export const mockSuppliers = [
  { id: 1, name: "Óticas Brasil Distribuidora", cnpj: "11.222.333/0001-44", contact: "Marcos Silva", phone: "(11) 3456-7890", email: "comercial@obrasil.com.br", category: "armações", lastOrder: "2026-05-10", totalOrders: 24 },
  { id: 2, name: "Essilor Brasil", cnpj: "55.666.777/0001-88", contact: "Fernanda Costa", phone: "(11) 4567-8901", email: "vendas@essilor.com.br", category: "lentes", lastOrder: "2026-05-15", totalOrders: 36 },
  { id: 3, name: "Hoya Vision Care", cnpj: "22.333.444/0001-55", contact: "Ricardo Alves", phone: "(11) 5678-9012", email: "hoya@hoya.com.br", category: "lentes", lastOrder: "2026-05-05", totalOrders: 18 },
  { id: 4, name: "Zeiss do Brasil", cnpj: "44.555.666/0001-77", contact: "Patricia Lima", phone: "(11) 6789-0123", email: "zeiss@zeiss.com.br", category: "lentes", lastOrder: "2026-04-28", totalOrders: 12 },
];

export const mockCashMovements = [
  { id: 1, type: "entrada", description: "Venda #1002 - Ana Costa", value: 1200, method: "pix", date: "2026-05-22 09:30", user: "Caixa 1" },
  { id: 2, type: "entrada", description: "Venda #1001 - João Silva", value: 800, method: "cartão", date: "2026-05-22 10:15", user: "Caixa 1" },
  { id: 3, type: "saída", description: "Sangria - Pagamento conta água", value: 150, method: "dinheiro", date: "2026-05-22 11:00", user: "Admin" },
  { id: 4, type: "entrada", description: "Venda #1007 - Pedro Oliveira", value: 700, method: "cartão", date: "2026-05-22 14:20", user: "Caixa 1" },
  { id: 5, type: "saída", description: "Suprimento de troco", value: -200, method: "dinheiro", date: "2026-05-22 08:00", user: "Admin" },
];

export const mockEmployees = [
  { id: 1, name: "Vanessa Rodrigues", role: "gerente", email: "vanessa@otica.com", phone: "(11) 98765-0000", store: "Loja Centro", status: "ativo", commission: 5, sales: 42 },
  { id: 2, name: "Lucas Martins", role: "vendedor", email: "lucas@otica.com", phone: "(11) 97654-1111", store: "Loja Centro", status: "ativo", commission: 3, sales: 28 },
  { id: 3, name: "Beatriz Souza", role: "vendedor", email: "beatriz@otica.com", phone: "(11) 96543-2222", store: "Loja Shopping", status: "ativo", commission: 3, sales: 35 },
  { id: 4, name: "Thiago Nunes", role: "optometrista", email: "thiago@otica.com", phone: "(11) 95432-3333", store: "Loja Centro", status: "ativo", commission: 0, sales: 0 },
  { id: 5, name: "Camila Ramos", role: "caixa", email: "camila@otica.com", phone: "(11) 94321-4444", store: "Loja Shopping", status: "inativo", commission: 0, sales: 0 },
];

export const mockFiscalNotes = [
  { id: 1, number: "NF-0001234", customer: "João Silva", value: 800, status: "autorizada", issued: "2026-05-22", type: "NF-e" },
  { id: 2, number: "NF-0001235", customer: "Ana Costa", value: 1200, status: "autorizada", issued: "2026-05-22", type: "NF-e" },
  { id: 3, number: "NF-0001236", customer: "Pedro Oliveira", value: 700, status: "autorizada", issued: "2026-05-20", type: "NF-e" },
  { id: 4, number: "NF-0001233", customer: "Maria Santos", value: 430, status: "autorizada", issued: "2026-05-21", type: "NF-e" },
  { id: 5, number: "NF-0001232", customer: "Lucia Mendes", value: 320, status: "cancelada", issued: "2026-05-20", type: "NF-e" },
  { id: 6, number: "NF-0001231", customer: "Carlos Ferreira", value: 900, status: "autorizada", issued: "2026-05-21", type: "NF-e" },
];

export const mockErpKpis = {
  salesToday: 3250,
  salesGrowth: 8.3,
  cashBalance: 4780,
  pendingOrders: 3,
  activeCustomers: 7,
  monthlyRevenue: 28400,
  revenueGrowth: 12.1,
  avgTicket: 717,
};
