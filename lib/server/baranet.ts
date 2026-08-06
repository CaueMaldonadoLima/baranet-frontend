// Cliente server-only para a API real do Baranet (Laravel).
// NUNCA importar este arquivo de um Client Component — o token da
// aplicação (BARANET_API_TOKEN) só pode existir no servidor.
// Uso: route handlers em app/api/**/route.ts fazem o proxy entre o
// browser e a API real, anexando o Bearer token aqui.

const BARANET_API_URL = process.env.BARANET_API_URL ?? "http://localhost:8000/api";
const BARANET_API_TOKEN = process.env.BARANET_API_TOKEN;

export const DEFAULT_OPTICA_ID = process.env.BARANET_DEFAULT_OPTICA_ID ?? "1";

export const SESSION_COOKIE = "baranet_session";
export const OPTICA_COOKIE = "baranet_optica_id";

type BaranetRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  /** Cookie header a repassar para o backend (sessão do funcionário). */
  cookie?: string;
};

// Faz a chamada crua (sem parsear o corpo) para que o caller possa ler
// status e Set-Cookie antes de decidir como responder ao browser.
export function baranetFetch(path: string, options: BaranetRequestOptions = {}): Promise<Response> {
  if (!BARANET_API_TOKEN) {
    throw new Error("BARANET_API_TOKEN não configurado no ambiente do servidor.");
  }

  const { body, headers, cookie, ...rest } = options;

  return fetch(`${BARANET_API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${BARANET_API_TOKEN}`,
      ...(cookie ? { Cookie: cookie } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
}

export interface ParsedCookie {
  name: string;
  value: string;
}

// response.headers.get("set-cookie") colapsa múltiplos cookies numa
// única string em alguns runtimes; getSetCookie() (undici/Node 18+)
// devolve um array corretamente separado quando disponível.
export function parseSetCookies(response: Response): ParsedCookie[] {
  const headers = response.headers as Headers & { getSetCookie?: () => string[] };
  const raws = typeof headers.getSetCookie === "function"
    ? headers.getSetCookie()
    : (() => {
        const single = response.headers.get("set-cookie");
        return single ? [single] : [];
      })();

  return raws.map((raw) => {
    const pair = raw.split(";")[0];
    const eq = pair.indexOf("=");
    return { name: pair.slice(0, eq).trim(), value: pair.slice(eq + 1).trim() };
  });
}

export function findCookie(cookies: ParsedCookie[], name: string): string | undefined {
  return cookies.find((c) => c.name === name)?.value;
}

// Resolve a ótica (tenant) a partir do cookie baranet_optica_id (setado
// no login real); cai para BARANET_DEFAULT_OPTICA_ID em dev/antes do login.
// Aceita o valor do cookie já lido (via request.cookies ou next/headers
// cookies(), conforme o contexto — route handler ou Server Component).
export function resolveOpticaId(opticaCookieValue?: string): string {
  return opticaCookieValue ?? DEFAULT_OPTICA_ID;
}

// Corpo de erro padrão da API Laravel (ver components.schemas.Error).
export interface BaranetErrorBody {
  message: string;
  errors?: Record<string, string[]>;
}

export async function readJson<T>(response: Response): Promise<T | undefined> {
  if (response.status === 204) return undefined;
  try {
    return (await response.json()) as T;
  } catch {
    return undefined;
  }
}
