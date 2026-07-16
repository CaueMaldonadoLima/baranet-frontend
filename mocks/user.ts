// Usuário mockado para desenvolvimento local
// Usado quando NEXT_PUBLIC_MOCK_AUTH=true

export interface MockUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "manager" | "seller";
  tenant: {
    id: number;
    name: string;
    slug: string;
  };
  store: {
    id: number;
    name: string;
  };
  avatar?: string;
}

export const MOCK_USER: MockUser = {
  id: 1,
  name: "João Silva",
  email: "joao.silva@oticaexemplo.com.br",
  role: "manager",
  tenant: {
    id: 1,
    name: "Ótica Exemplo",
    slug: "otica-exemplo",
  },
  store: {
    id: 1,
    name: "Loja Centro",
  },
};
