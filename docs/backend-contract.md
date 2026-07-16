# Contrato de API — Backend Laravel

> **Para:** Dev Backend  
> **Contexto:** Frontend Next.js já implementado com mock data. Este documento descreve todos os endpoints, formatos de request/response e comportamentos necessários para a integração.

---

## Padrões globais

### Base URL
```
http://localhost:8000/api   (dev)
https://api.baranet.com.br (prod)
```

### Headers obrigatórios em toda resposta
```
Content-Type: application/json
Accept: application/json
```

### Formato de erro (obrigatório em TODOS os erros)
```json
{
  "message": "Mensagem legível pelo usuário",
  "errors": {
    "campo": ["Mensagem de validação"]
  }
}
```

### Formato de paginação (obrigatório em listagens)
```json
{
  "data": [...],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 72
  }
}
```

### Autenticação
- Sessão via **cookie httpOnly** (não JWT no localStorage)
- Cookie ERP: `baranet_session`
- Cookie Admin: `baranet_admin_session`
- Todo request autenticado envia `credentials: "include"` (já configurado no frontend)
- Sessão expirada → retornar `401` (o middleware redireciona para `/login`)

---

## 1. Autenticação

### `POST /auth/login` — Login ERP
**Request:**
```json
{ "email": "string", "password": "string" }
```
**Response 200:** Seta cookie `baranet_session` (httpOnly, SameSite=Lax)
```json
{ "user": { "id": 1, "name": "string", "email": "string", "role": "string" } }
```
**Response 422:** Credenciais inválidas (formato padrão de erro acima)

---

### `POST /auth/logout` — Logout ERP
**Response 204:** Limpa cookie `baranet_session`

---

### `POST /auth/forgot-password` — Recuperação de senha
**Request:** `{ "email": "string" }`  
**Response 200:** `{ "message": "Email enviado" }`

---

### `POST /auth/reset-password` — Redefinir senha
**Request:** `{ "token": "string", "email": "string", "password": "string", "password_confirmation": "string" }`  
**Response 200:** `{ "message": "Senha redefinida" }`

---

### `POST /auth/first-access` — Primeiro acesso (setar senha)
**Request:** `{ "token": "string", "password": "string", "password_confirmation": "string" }`  
**Response 200:** Seta `baranet_session` e retorna usuário

---

### `GET /auth/me` — Usuário logado (ERP)
**Response 200:**
```json
{
  "id": 1,
  "name": "Vanessa Rodrigues",
  "email": "vanessa@otica.com",
  "role": "gerente",
  "store": { "id": "1", "name": "Loja Centro" },
  "availableStores": [
    { "id": "1", "name": "Loja Centro" },
    { "id": "2", "name": "Loja Shopping" }
  ]
}
```

---

### `POST /admin/auth/login` — Login Admin
**Request:** `{ "email": "string", "password": "string" }`  
**Response 200:** Seta cookie `baranet_admin_session`
```json
{ "user": { "id": 1, "name": "string", "email": "string", "role": "super_admin" } }
```

---

## 2. Admin — Óticas (Tenants)

### `GET /admin/oticas`
**Query params:** `page`, `per_page`, `search`, `status` (ativo|suspenso|trial)  
**Response 200:** Lista paginada de óticas
```json
{
  "data": [{
    "id": 1, "name": "string", "cnpj": "string",
    "status": "ativo|suspenso|trial",
    "plan": "string", "city": "string", "state": "string",
    "since": "2024-01-15", "mrr": 599, "stores": 3
  }]
}
```

---

### `POST /admin/oticas`
**Request:**
```json
{
  "name": "string", "cnpj": "string", "razaoSocial": "string",
  "email": "string", "phone": "string",
  "city": "string", "state": "string",
  "planId": 1,
  "responsibleName": "string", "responsibleEmail": "string"
}
```
**Response 201:** Ótica criada

---

### `GET /admin/oticas/{id}` — Detalhe
**Response 200:** Objeto ótica completo + array `history` com eventos

---

### `PUT /admin/oticas/{id}` — Editar
**Request:** Mesmo formato do POST (campos opcionais)  
**Response 200:** Ótica atualizada

---

### `PATCH /admin/oticas/{id}/suspend` — Suspender
**Response 200:** `{ "status": "suspenso" }`

---

### `PATCH /admin/oticas/{id}/activate` — Ativar
**Response 200:** `{ "status": "ativo" }`

---

## 3. Admin — Planos

### `GET /admin/planos`
```json
{
  "data": [{
    "id": 1, "name": "string", "price": 199, "annualPrice": 1990,
    "modules": ["vendas", "clientes"], "oticas": 3, "active": true
  }]
}
```

### `POST /admin/planos`
```json
{ "name": "string", "price": 199, "annualPrice": 1990, "modules": ["string"] }
```

### `PUT /admin/planos/{id}` / `DELETE /admin/planos/{id}`

---

## 4. Admin — Módulos

### `GET /admin/modulos`
```json
{
  "data": [{
    "id": 1, "slug": "string", "name": "string",
    "description": "string", "category": "string", "active": true
  }]
}
```

### `PATCH /admin/modulos/{id}`
**Request:** `{ "active": true|false }`  
**Response 200:** Módulo atualizado

---

## 5. Admin — Financeiro / Billing

### `GET /admin/financeiro`
**Query params:** `page`, `status` (pago|pendente|atrasado|cancelado), `search`
```json
{
  "data": [{
    "id": 1, "otica": "string", "type": "payment",
    "value": 599, "status": "pago",
    "date": "2026-05-01|null", "dueDate": "2026-05-05"
  }]
}
```

### `GET /admin/financeiro/stats`
```json
{ "mrr": 2895, "overdue": 398, "paidThisMonth": 2097 }
```

---

## 6. Admin — Usuários

### `GET /admin/usuarios`
```json
{
  "data": [{
    "id": 1, "name": "string", "email": "string",
    "role": "super_admin|suporte|comercial|financeiro",
    "status": "ativo|inativo", "lastAccess": "2026-05-22"
  }]
}
```

### `POST /admin/usuarios`
```json
{ "name": "string", "email": "string", "role": "string" }
```
O backend envia email de primeiro acesso automaticamente.

---

## 7. ERP — Clientes

### `GET /erp/customers`
**Query params:** `page`, `search`
```json
{
  "data": [{
    "id": 1, "name": "string", "cpf": "string",
    "phone": "string", "email": "string",
    "city": "string", "state": "string",
    "lastPurchase": "2026-05-10", "totalPurchases": 5, "totalValue": 2350
  }]
}
```

### `GET /erp/customers/{id}` / `POST /erp/customers` / `PUT /erp/customers/{id}`

**POST/PUT Request:**
```json
{
  "name": "string", "cpf": "string", "phone": "string",
  "email": "string", "city": "string", "state": "string"
}
```

---

## 8. ERP — Vendas

### `GET /erp/sales`
**Query params:** `page`, `search`, `status`
```json
{
  "data": [{
    "id": 1001, "customer": "string", "cpf": "string",
    "value": 850, "discount": 50, "total": 800,
    "date": "2026-05-22", "status": "pago|pendente|cancelado",
    "paymentMethod": "cartão|pix|dinheiro|crediário", "items": 2
  }]
}
```

### `POST /erp/sales`
```json
{
  "customerName": "string",
  "items": [{ "productId": 1, "qty": 1, "price": 480 }],
  "discount": 50,
  "paymentMethod": "cartão"
}
```
**Response 201:** Venda criada com `id`

### `POST /erp/sales/{id}/cancel`
**Response 200:** `{ "status": "cancelado" }`

---

## 9. ERP — Produtos

### `GET /erp/products`
**Query params:** `page`, `search`, `category`
```json
{
  "data": [{
    "id": 1, "code": "string", "name": "string",
    "category": "armação|lente|solar|acessório",
    "brand": "string", "price": 480, "cost": 220,
    "stock": 12, "minStock": 3, "active": true
  }]
}
```

### `POST /erp/products` / `PUT /erp/products/{id}` / `DELETE /erp/products/{id}`

---

## 10. ERP — Estoque

### `GET /erp/stock/movements`
**Query params:** `page`, `product`, `type` (entrada|saída|ajuste)
```json
{
  "data": [{
    "id": 1, "product": "string",
    "type": "entrada|saída|ajuste",
    "qty": 10, "reason": "string", "date": "string", "user": "string"
  }]
}
```

### `POST /erp/stock/adjust`
```json
{ "productId": 1, "qty": -1, "reason": "Quebra/avaria" }
```

---

## 11. ERP — Pedidos de Laboratório

### `GET /erp/lab-orders`
**Query params:** `page`, `status`
```json
{
  "data": [{
    "id": 501, "customer": "string", "product": "string",
    "lab": "string", "status": "aguardando|em_producao|pronto|entregue",
    "prescription": "string", "sentDate": "string", "dueDate": "string"
  }]
}
```

### `POST /erp/lab-orders`
```json
{
  "customerId": 1, "product": "string", "lab": "string",
  "prescription": "string", "dueDate": "string"
}
```

### `PATCH /erp/lab-orders/{id}/status`
```json
{ "status": "em_producao|pronto|entregue" }
```

---

## 12. ERP — Caixa

### `GET /erp/cash/status`
```json
{ "open": true, "openedAt": "2026-05-22 08:00", "openedBy": "string", "balance": 4780 }
```

### `POST /erp/cash/open` — Abrir caixa
```json
{ "initialBalance": 200 }
```

### `POST /erp/cash/close` — Fechar caixa
**Response 200:** Resumo do fechamento

### `GET /erp/cash/movements`
```json
{
  "data": [{
    "id": 1, "type": "entrada|saída",
    "description": "string", "value": 1200,
    "method": "string", "date": "string", "user": "string"
  }]
}
```

### `POST /erp/cash/movements` — Registrar movimentação
```json
{ "type": "entrada|saída", "description": "string", "value": 150, "method": "dinheiro" }
```

---

## 13. ERP — Fiscal / NF-e

### `GET /erp/fiscal/notes`
**Query params:** `page`, `status`
```json
{
  "data": [{
    "id": 1, "number": "NF-0001234", "customer": "string",
    "value": 800, "status": "autorizada|cancelada",
    "issued": "2026-05-22", "type": "NF-e"
  }]
}
```

### `POST /erp/fiscal/notes` — Emitir NF-e
```json
{ "saleId": 1001 }
```
**Response 201:** Nota emitida com `number` e `xmlUrl`

### `POST /erp/fiscal/notes/{id}/cancel`
**Response 200:** `{ "status": "cancelada" }`

---

## 14. ERP — Fornecedores

### `GET /erp/suppliers` / `POST /erp/suppliers` / `PUT /erp/suppliers/{id}`

**Objeto:**
```json
{
  "id": 1, "name": "string", "cnpj": "string",
  "contact": "string", "phone": "string", "email": "string",
  "category": "string", "lastOrder": "string", "totalOrders": 24
}
```

---

## 15. ERP — Funcionários

### `GET /erp/employees` / `POST /erp/employees` / `PUT /erp/employees/{id}`

**Objeto:**
```json
{
  "id": 1, "name": "string", "role": "gerente|vendedor|optometrista|caixa",
  "email": "string", "phone": "string", "store": "string",
  "status": "ativo|inativo", "commission": 5, "sales": 42
}
```

---

## 16. ERP — Dashboard (KPIs)

### `GET /erp/dashboard`
```json
{
  "salesToday": 3250,
  "salesGrowth": 8.3,
  "cashBalance": 4780,
  "pendingOrders": 3,
  "monthlyRevenue": 28400,
  "revenueGrowth": 12.1,
  "avgTicket": 717
}
```

---

## 17. Storefront (Ecommerce)

O storefront é white-label — cada ótica tem configuração própria.

### `GET /store/{slug}/config` — Configuração da loja
```json
{
  "name": "string", "slug": "string",
  "primaryColor": "#047857", "secondaryColor": "#065f46",
  "logoText": "string", "tagline": "string",
  "phone": "string", "email": "string", "address": "string"
}
```

### `GET /store/{slug}/products`
**Query params:** `page`, `category`, `search`, `brand`, `minPrice`, `maxPrice`

### `GET /store/{slug}/products/{productSlug}` — Detalhe do produto

### `GET /store/{slug}/categories` — Categorias disponíveis

### `POST /store/{slug}/checkout` — Processar pedido
```json
{
  "customer": { "name": "string", "email": "string", "cpf": "string" },
  "address": { "cep": "string", "rua": "string", "numero": "string", "bairro": "string", "cidade": "string", "estado": "string" },
  "items": [{ "productId": 1, "qty": 1, "price": 480 }],
  "paymentMethod": "pix|cartao|boleto",
  "cardData": { "number": "string", "name": "string", "expiry": "string", "cvv": "string" }
}
```
**Response 201:** `{ "orderId": "PED-2026001", "status": "pendente", "pixQrCode": "..." }`

### `POST /store/{slug}/auth/login` — Login do cliente final
```json
{ "email": "string", "password": "string" }
```
**Response 200:** Seta cookie `store_session`

### `POST /store/{slug}/auth/register` — Cadastro do cliente
```json
{ "name": "string", "email": "string", "cpf": "string", "phone": "string", "password": "string" }
```

### `GET /store/{slug}/customer/orders` — Pedidos do cliente (autenticado)

---

## Observações importantes

1. **CORS:** Liberar `http://localhost:3000` em dev e o domínio de prod
2. **Cookies:** `httpOnly: true`, `SameSite: Lax`, `Secure: true` em prod
3. **Multi-tenant:** O middleware do Laravel deve isolar dados por tenant. O frontend **nunca** envia o tenant ID explicitamente — isso é responsabilidade do backend via cookie/sessão
4. **Troca de loja:** `POST /erp/store/switch` com `{ "storeId": "2" }` — atualiza o contexto da sessão
5. **CEP:** O endpoint de busca de CEP pode ser implementado internamente ou retornar um proxy para ViaCEP
