export const FEATURE_FLAGS = {
  LOGIN: true,
  ADMIN_AREA: true,
  ERP_VENDAS: true,
  ERP_CLIENTES: true,
  ERP_PRODUTOS: true,
  ERP_ESTOQUE: true,
  ERP_LABORATORIO: true,
  ERP_FORNECEDORES: true,
  ERP_CAIXA: true,
  ERP_FISCAL: true,
  ERP_FUNCIONARIOS: true,
  ERP_RELATORIOS: true,
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;
