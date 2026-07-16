# PRD — Frontend Baranet
> Plataforma ERP multi-tenant para redes de óticas  
> Última atualização: 2026-04-07  
> Responsável front: CaueMaldonadoLima  
> Responsável back: outro dev (Laravel 12)

---

## Índice

1. [Contexto e escopo](#1-contexto-e-escopo)
2. [Stack e ferramentas](#2-stack-e-ferramentas)
3. [Arquitetura frontend](#3-arquitetura-frontend)
4. [Design system](#4-design-system)
5. [Componentes shared](#5-componentes-shared)
6. [Módulos e telas](#6-módulos-e-telas)
   - [6.1 Admin](#61-admin)
   - [6.2 ERP](#62-erp)
   - [6.3 Ecommerce](#63-ecommerce)
7. [Fases de entrega](#7-fases-de-entrega)
8. [Regras obrigatórias](#8-regras-obrigatórias)
9. [Requisitos não-funcionais](#9-requisitos-não-funcionais)

---

## 1. Contexto e escopo

Baranet é uma plataforma ERP SaaS multi-tenant voltada para redes de óticas. O frontend é uma aplicação **Next.js 16** que consome APIs do backend Laravel 12.

### Três grandes áreas

| Área | Usuário | Objetivo principal |
|---|---|---|
| **Admin** | Equipe Baranet | Gerenciar óticas (tenants), planos, billing e módulos contratados |
| **ERP** | Funcionários das óticas | Vendas, estoque, clientes, pedidos, caixa, fiscal |
| **Ecommerce** | Clientes finais da ótica | Comprar online, agendar consultas, acompanhar pedidos |

O frontend **não tem responsabilidade sobre**:
- Regras de negócio (pertencem ao Laravel)
- Isolamento de tenant por query (pertencem ao backend)
- Autenticação JWT/session (gerenciada via cookie httpOnly pelo backend)

---

## 2. Stack e ferramentas

| Camada | Tecnologia | Versão |
|---|---|---|
| Framework | Next.js (App Router) | 16.x |
| UI Library | React | 19.x |
| Linguagem | TypeScript | 5.x |
| Estilização | Tailwind CSS | 4.x |
| Componentes base | shadcn/ui (new-york) + Radix UI | — |
| Ícones | Lucide React | — |
| Variantes de estilo | class-variance-authority (CVA) | — |
| Utilitários CSS | clsx + tailwind-merge | — |
| Animações | tw-animate-css | — |
| Gerenciador de pacotes | pnpm | — |

### O que NÃO usar sem aprovação

- React Query / SWR (adicionar se necessário, perguntar antes)
- Zustand / Jotai / Redux (perguntar antes)
- React Hook Form / Zod (perguntar antes)
- Qualquer lib de charts (perguntar antes)
- i18n libs (perguntar antes — app é só pt-BR por enquanto)

---

## 3. Arquitetura frontend

### Estrutura de pastas

```
baranet-frontend/
├── app/
│   ├── (public)/               # Rotas sem autenticação
│   │   ├── login/              # Login ERP/Admin (seleção de portal)
│   │   └── [tenant]/           # Ecommerce público (white-label)
│   │       └── ...
│   ├── (admin)/                # Portal Admin (Baranet interna)
│   │   ├── layout.tsx          # Layout com sidebar Admin
│   │   ├── dashboard/
│   │   ├── tenants/
│   │   ├── plans/
│   │   └── billing/
│   └── (erp)/                  # Portal ERP (ótica logada)
│       ├── layout.tsx          # Layout com sidebar ERP
│       ├── dashboard/
│       ├── sales/
│       ├── stock/
│       ├── customers/
│       ├── orders/
│       ├── cash/
│       ├── staff/
│       └── settings/
│
├── components/
│   ├── ui/                     # Primitivos shadcn/ui (não editar diretamente)
│   ├── shared/                 # Componentes reutilizáveis entre módulos
│   │   ├── aside/              # ✅ existe
│   │   ├── search-header/      # ✅ existe
│   │   └── ...
│   ├── admin/                  # Componentes exclusivos do Admin
│   ├── erp/                    # Componentes exclusivos do ERP
│   ├── ecommerce/              # Componentes exclusivos do Ecommerce
│   └── login/                  # ✅ existe — fluxo de login
│
├── core/
│   └── feature.ts              # ✅ existe — feature flags
│
├── config/
│   ├── feature-flags.ts        # ✅ existe
│   └── version.ts              # ✅ existe
│
├── lib/
│   └── utils.ts                # ✅ existe — cn() helper
│
├── hooks/                      # Custom hooks
├── services/                   # Camada de comunicação com API
│   ├── admin/
│   ├── erp/
│   └── shared/
│
└── docs/
    └── PRD-Frontend.md         # Este arquivo
```

### Roteamento e autenticação

- **Route Groups** do App Router separam Admin, ERP e Ecommerce com layouts independentes.
- Autenticação via cookie httpOnly (gerenciado pelo Laravel). O frontend não armazena tokens em `localStorage`.
- Middleware Next.js (`middleware.ts`) vai redirecionar rotas protegidas se não houver sessão válida.
- No logout: limpar todo estado client-side (cache, contextos).

### Comunicação com API

- Todas as chamadas passam por uma camada `services/` — nunca `fetch` direto nos componentes.
- Cada módulo tem sua pasta de services isolada.
- Respostas de erro da API devem ser tratadas com tipos TypeScript (`ApiError`).
- Nunca expor dados sensíveis de tenant em `localStorage` ou `sessionStorage`.

### Isolamento entre módulos

- Componente de `admin/` nunca importa de `erp/` e vice-versa.
- Código compartilhado vai para `components/shared/` ou `components/ui/`.
- Hooks específicos de módulo ficam dentro da pasta do módulo.

---

## 4. Design system

### Paleta de cores (tokens CSS já definidos em `globals.css`)

#### Marca global

| Token | Valor | Uso |
|---|---|---|
| `--primary` | `#ff7f51` | CTAs, links ativos, destaques |
| `--secondary` | `#ff5151` | Ações secundárias, alertas leves |
| `--accent` | `#8a65d1` | Destaques especiais, badges premium |
| `--background` | `#f3f3f3` | Fundo padrão |
| `--foreground` | `#0f0704` | Texto padrão |
| `--muted` | `#f1eae7` | Fundos de cards, seções inativas |
| `--muted-foreground` | `#6b5f5a` | Texto secundário |
| `--destructive` | `#e5484d` | Erros, ações destrutivas |
| `--border` | `#e5dcd8` | Bordas |
| `--ring` | `#ff7f51` | Focus ring |

#### Login (tokens isolados — não usar fora do contexto de login)

| Token | Valor |
|---|---|
| `--login-title` | `#4f000b` |
| `--login-button-bg` | `#720026` |
| `--login-checkbox` | `#720026` |
| `--login-help-text` | `#ff7f51` |

#### Estados semânticos (adicionar ao globals.css quando necessário)

| Estado | Cor | Token sugerido |
|---|---|---|
| Sucesso | `#16A34A` | `--success` |
| Aviso | `#D97706` | `--warning` |
| Info | `#2563EB` | `--info` |

### Tipografia

- **Fonte base:** Inter (carregar via `next/font` ou Google Fonts)
- **Tamanho base:** 16px
- **Escala:** usar escala padrão Tailwind (`text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`)

### Espaçamento

Usar escala padrão Tailwind (base 4px). Valores preferenciais: `1` (4px), `2` (8px), `3` (12px), `4` (16px), `6` (24px), `8` (32px), `12` (48px), `16` (64px).

### Border radius

| Uso | Token | Valor |
|---|---|---|
| Pequeno (inputs, badges) | `rounded-sm` | `calc(0.625rem - 4px)` |
| Médio (cards, modais) | `rounded-md` | `calc(0.625rem - 2px)` |
| Grande (painéis) | `rounded-lg` | `0.625rem` |

### Dark mode

Dark mode já configurado via classe `.dark`. Tokens sobrescrevem automaticamente. Todos os componentes devem funcionar em ambos os temas.

---

## 5. Componentes shared

Ficam em `components/shared/`. São os blocos de construção usados por Admin, ERP e Ecommerce.

### Status atual

| Componente | Status | Localização |
|---|---|---|
| `aside` | ✅ Existe | `components/shared/aside/aside.tsx` |
| `search-header` | ✅ Existe | `components/shared/search-header/` |
| `app-version` | ✅ Existe | `components/shared/app-version.tsx` |
| `button` | ✅ Existe (shadcn) | `components/ui/button.tsx` |
| `input` | ✅ Existe (shadcn) | `components/ui/input.tsx` |
| `select` | ✅ Existe (shadcn) | `components/ui/select.tsx` |
| `checkbox` | ✅ Existe (shadcn) | `components/ui/checkbox.tsx` |
| `card` | ✅ Existe (shadcn) | `components/ui/card.tsx` |
| `label` | ✅ Existe (shadcn) | `components/ui/label.tsx` |
| `field` | ✅ Existe (custom) | `components/ui/field.tsx` |
| `separator` | ✅ Existe (shadcn) | `components/ui/separator.tsx` |
| `input-field` | ✅ Existe (custom) | `components/primitives/input-field.tsx` |

### Componentes a construir (Fase 0)

Todos em `components/shared/` usando CVA + Radix quando aplicável.

#### `data-table`
- Slot: header, rows, paginação
- Props: `data`, `columns`, `isLoading`, `emptyMessage`
- Estados: loading (skeleton), vazio (empty-state), erro

#### `modal`
- Baseado em `@radix-ui/react-dialog` (adicionar)
- Fechável por ESC e clique fora
- Props: `open`, `onOpenChange`, `title`, `description`, `size` (sm|md|lg|xl)
- Slots: header, body, footer

#### `alert`
- Variantes: `success`, `error`, `warning`, `info`
- Props: `variant`, `title`, `description`, `dismissible`

#### `toast`
- Usar `@radix-ui/react-toast` ou sonner (perguntar antes de instalar)
- Toast global via hook `useToast()`
- Tipos: success, error, warning, info
- Autoclose configurável

#### `badge`
- Variantes: `default`, `success`, `error`, `warning`, `info`, `outline`
- Props: `variant`, `size` (sm|md)

#### `breadcrumb`
- Props: `items: { label: string, href?: string }[]`
- Último item não é link

#### `tabs`
- Baseado em `@radix-ui/react-tabs` (verificar se já disponível)
- Props: `items: { value, label, content }[]`, `defaultValue`

#### `empty-state`
- Props: `icon?`, `title`, `description`, `action?` (label + onClick)

#### `skeleton`
- Variantes: text, card, table-row, avatar
- Props: `variant`, `lines?` (para text)

#### `pagination`
- Props: `currentPage`, `totalPages`, `onPageChange`
- Exibe: anterior, próxima, primeira, última, elipses

#### `stat-card`
- Card de métrica rápida para dashboards
- Props: `label`, `value`, `delta?` (percentual), `icon?`, `trend` (up|down|neutral)

#### `form-section`
- Agrupa campos com título de seção e divisor
- Props: `title`, `description?`
- Slot: `children`

---

## 6. Módulos e telas

### 6.1 Admin

**Público-alvo:** equipe interna Baranet  
**Responsividade:** desktop first (1280px+)  
**Acesso:** `/admin/login` → guarda admin separada  

#### Telas

| Tela | Prioridade | Descrição |
|---|---|---|
| Login Admin | P0 | Tela de login exclusiva para admin |
| Dashboard | P0 | Visão geral: total de tenants, MRR, alertas |
| Lista de Óticas (Tenants) | P0 | Tabela com busca, filtros por status e plano |
| Detalhe da Ótica | P0 | Dados da ótica, módulos ativos, histórico de billing |
| Criar/Editar Ótica | P0 | Formulário completo de cadastro de tenant |
| Ativar/Suspender Ótica | P0 | Ação com modal de confirmação |
| Planos e Módulos | P1 | CRUD de planos e configuração de módulos |
| Billing | P1 | Histórico de pagamentos, notas, inadimplência |
| Notificações | P1 | Painel de avisos e alertas para admins |
| Configurações da Plataforma | P2 | Parâmetros globais |

#### Layout Admin

```
┌─────────────────────────────────────────────────────┐
│  [Logo]  Sidebar Admin (fixa, 240px)   Topbar       │
│                                                     │
│  • Dashboard                                        │
│  • Óticas                                           │
│  • Planos                        [Conteúdo]         │
│  • Billing                                          │
│  • Configurações                                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### 6.2 ERP

**Público-alvo:** funcionários e gestores das óticas  
**Responsividade:** desktop first (1280px+), funcional em tablet (PDV)  
**Acesso:** `/login` → seleção da ótica → guard ERP  

#### Telas

| Tela | Prioridade | Módulo |
|---|---|---|
| Login | ✅ Existe (P0) | Shared |
| Welcome (seleção de portal) | ✅ Existe (P0) | Shared |
| Dashboard ERP | P0 | Core |
| PDV (Ponto de Venda) | P0 | Vendas |
| Lista de Vendas | P0 | Vendas |
| Detalhe da Venda | P0 | Vendas |
| Clientes — lista | P0 | Clientes |
| Clientes — detalhe / ficha | P0 | Clientes |
| Clientes — cadastro/edição | P0 | Clientes |
| Estoque — produtos | P0 | Estoque |
| Estoque — entrada/saída | P1 | Estoque |
| Pedidos a Laboratório — lista | P0 | Pedidos |
| Pedidos a Laboratório — novo | P0 | Pedidos |
| Fluxo de Caixa | P1 | Financeiro |
| Fechamento de Caixa | P1 | Financeiro |
| Funcionários — lista | P1 | RH |
| Funcionários — cadastro | P1 | RH |
| Fornecedores | P2 | Compras |
| Notas Fiscais | P2 | Fiscal |
| Configurações da Ótica | P1 | Config |
| Múltiplas Lojas (seleção/troca) | P1 | Multifilial |

#### Layout ERP

```
┌─────────────────────────────────────────────────────┐
│  [Logo Ótica]  Sidebar (240px)       Search + User  │
│                                                     │
│  • Dashboard                                        │
│  • PDV                           [Conteúdo]         │
│  • Clientes                                         │
│  • Estoque                                          │
│  • Pedidos                                          │
│  • Financeiro                                       │
│  • Configurações                                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

> **Nota multi-loja:** header deve exibir loja ativa com opção de troca. Nunca misturar dados de lojas diferentes no client.

---

### 6.3 Ecommerce

**Público-alvo:** clientes finais das óticas  
**Responsividade:** mobile-first  
**Acesso:** `/{slug-da-otica}` — white-label por tenant  

> **Escopo Fase 2+.** Não iniciar antes de Admin e ERP estarem na Fase 1.

#### Telas (planejadas)

| Tela | Prioridade |
|---|---|
| Home da loja (white-label) | P0 |
| Listagem de produtos | P0 |
| Detalhe do produto | P0 |
| Carrinho | P0 |
| Checkout | P0 |
| Acompanhamento de pedido | P1 |
| Agendamento de consulta | P1 |
| Minha conta | P1 |
| Login/cadastro cliente | P0 |

---

## 7. Fases de entrega

### Fase 0 — Fundação *(atual)*

**Meta:** tudo que vem antes de uma tela de produto.

- [x] Estrutura de pastas (`app/`, `components/`, `services/`, `hooks/`)
- [x] Design tokens (globals.css)
- [x] shadcn/ui configurado
- [x] Feature flags (`core/feature.ts`)
- [x] Login + Welcome form
- [x] Aside (sidebar base)
- [x] Search header
- [ ] Tokens de estado semântico (`--success`, `--warning`, `--info`)
- [ ] Inter font via `next/font`
- [ ] `middleware.ts` (proteção de rotas)
- [ ] Camada `services/` com estrutura base e tipo `ApiError`
- [ ] `useToast` hook + componente Toast
- [ ] Componentes shared: modal, alert, badge, breadcrumb, tabs, empty-state, skeleton, pagination, data-table, stat-card, form-section

**Critério de saída:** todos os componentes shared acima existem, documentados e com exemplo de uso no código.

---

### Fase 1 — Admin MVP

**Meta:** equipe Baranet consegue gerenciar óticas.

- [ ] Layout Admin (sidebar + topbar com tokens admin)
- [ ] Login Admin (`/admin/login`)
- [ ] Dashboard Admin (stat cards, alertas)
- [ ] Lista de Óticas (data-table + filtros)
- [ ] Detalhe da Ótica
- [ ] Criar/Editar Ótica (formulário)
- [ ] Ativar/Suspender (modal de confirmação)
- [ ] Planos e Módulos (CRUD básico)

**Critério de saída:** fluxo completo de cadastrar → ativar → suspender uma ótica.

---

### Fase 2 — ERP MVP

**Meta:** ótica consegue fazer uma venda completa.

- [ ] Layout ERP (sidebar + topbar com tokens ERP)
- [ ] Dashboard ERP
- [ ] Clientes (lista + cadastro + detalhe)
- [ ] PDV (ponto de venda)
- [ ] Lista de Vendas + Detalhe
- [ ] Estoque básico
- [ ] Pedidos a Laboratório
- [ ] Seleção/troca de loja (multi-filial)

**Critério de saída:** fluxo completo de cadastrar cliente → fazer venda → gerar pedido ao laboratório.

---

### Fase 3 — ERP Completo

- [ ] Fluxo de Caixa + Fechamento
- [ ] Funcionários
- [ ] Fornecedores
- [ ] Notas Fiscais
- [ ] Configurações da Ótica
- [ ] Billing Admin (fase 1 do admin)

---

### Fase 4 — Ecommerce

- [ ] White-label engine (tema via CSS variables da API)
- [ ] Loja pública
- [ ] Carrinho + Checkout
- [ ] Agendamento

---

## 8. Regras obrigatórias

### Isolamento

- Componentes de `components/admin/` nunca importam de `components/erp/` (e vice-versa).
- Código compartilhado **sempre** vai para `components/shared/` ou `components/ui/`.
- Services de módulos diferentes não se chamam diretamente.

### Segurança client-side

- Nunca salvar tokens de auth, dados de tenant ou PII em `localStorage` ou `sessionStorage`.
- No logout: limpar React Query cache, context, cookies (via API route `/api/logout`).
- Ecommerce white-label: tema carregado via API, nunca hardcoded por tenant.

### Qualidade de componente

- Todo componente exportado tem props tipadas com TypeScript (sem `any`).
- Toda tela tem os 4 estados: loading, vazio, erro, dado presente.
- Sem magic numbers de cor — usar apenas tokens do design system.
- Nunca `// @ts-ignore` sem comentário explicando por quê.

### Git

- Nunca commitar diretamente na `main`.
- Branch por feature: `feat/nome-da-feature`.
- Não commitar `node_modules`, `.env`, arquivos de build.

---

## 9. Requisitos não-funcionais

### Acessibilidade (WCAG 2.1 AA)

- Todo `<input>` associado a um `<label>` (via `htmlFor` ou `aria-label`).
- Focus ring visível em todos os elementos interativos.
- Navegação por teclado funcional (Tab, Shift+Tab, Enter, Escape em modais).
- Contraste mínimo 4.5:1 para texto normal, 3:1 para texto grande.
- Componentes com estado (ex: toggle, checkbox) com `aria-checked`, `aria-expanded`.

### Performance

- Imagens via `next/image` (nunca `<img>` direto).
- Fontes via `next/font`.
- Code splitting automático do App Router (sem `dynamic()` desnecessário).
- Skeleton loading em todas as listas e telas com fetch assíncrono.

### Responsividade

| Módulo | Foco | Mínimo funcional |
|---|---|---|
| Admin | Desktop 1280px+ | Não precisa mobile |
| ERP | Desktop 1280px+, tablet (PDV) | 768px |
| Ecommerce | Mobile-first | 320px |

### Internacionalização

- Textos hardcoded em pt-BR por enquanto.
- Formatos de data: `DD/MM/YYYY`.
- Formato de moeda: `R$ 1.234,56`.
- Não usar libs de i18n ainda — separar strings em constantes quando necessário.
