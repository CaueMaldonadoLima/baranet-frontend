import { api } from "../api";

export interface AuthMe {
  id: number;
  name: string;
  email: string;
  role: "gerente" | "vendedor" | "optometrista" | "caixa";
  store: { id: string; name: string } | null;
  availableStores: { id: string; name: string }[];
  optica: {
    id: number;
    name: string;
    status: string;
    active: boolean;
    modules: string[];
  };
}

export interface LoginDTO {
  email: string;
  password: string;
  opticaId?: number;
}

export const authService = {
  login: (data: LoginDTO) => api.post<AuthMe>("/auth/login", data),

  logout: () => api.post<void>("/auth/logout"),

  me: () => api.get<AuthMe>("/auth/me"),
};
