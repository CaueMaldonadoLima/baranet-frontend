import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas que não precisam de autenticação (ERP/Admin)
const PUBLIC_PATHS = ["/login", "/admin/login"];

// Rotas do storefront (sempre públicas — acesso de clientes finais)
const STOREFRONT_PREFIXES = ["/loja"];

// Assets e internos do Next.js que nunca devem ser interceptados
const BYPASS_PREFIXES = ["/_next", "/favicon", "/public"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorar assets e rotas internas do Next.js
  if (BYPASS_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Bypass de auth em desenvolvimento (NEXT_PUBLIC_MOCK_AUTH=true)
  if (process.env.NEXT_PUBLIC_MOCK_AUTH === "true") {
    return NextResponse.next();
  }

  // Permitir rotas públicas de auth
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Storefront é sempre público (clientes finais)
  if (STOREFRONT_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Rotas Admin: verificam cookie baranet_admin_session
  if (pathname.startsWith("/admin")) {
    const adminSession = request.cookies.get("baranet_admin_session");
    if (!adminSession) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  // Rotas ERP (tudo mais): verificam cookie baranet_session
  const session = request.cookies.get("baranet_session");
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Intercepta todas as rotas exceto:
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagens)
     * - favicon.ico
     * - arquivos com extensão (ex: .png, .svg)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
