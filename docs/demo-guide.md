# Guia de Demonstração — Baranet

> Todos os dados são mockados. Nenhum backend necessário.

---

## Preparação (antes de apresentar)

```bash
pnpm dev
```

Abrir: **http://localhost:3000**

O `.env.local` já tem `NEXT_PUBLIC_MOCK_AUTH=true` — nenhum redirecionamento de auth acontece, tudo é acessível diretamente.

---

## Roteiro de Teste

### BLOCO 1 — Login ERP

**Objetivo:** mostrar a tela de boas-vindas e entrar no sistema.

1. Acesse `http://localhost:3000/login`
2. A tela de boas-vindas exibe um seletor de ótica e o botão **Entrar**
3. Clique em **Entrar** → você é redirecionado para o Dashboard ERP (`/`)

> Se quiser mostrar o formulário de login completo, o componente existe mas o fluxo padrão é pela WelcomeForm.

---

### BLOCO 2 — ERP (área laranja)

Ponto de entrada: `http://localhost:3000`

#### Dashboard (`/`)

- 4 KPI cards: Vendas hoje **R$ 3.250** (+8,3%), Saldo em caixa **R$ 4.780**, Pedidos lab. pendentes **3**, Faturamento do mês **R$ 28.400** (+12,1%)
- Tabela "Vendas recentes" com badges: **Pago** (verde), **Pendente** (amarelo), **Cancelado** (vermelho)
- Tabela "Pedidos de laboratório" com status de produção

#### Vendas (`/vendas`)

- Stat cards no topo (vendas hoje, faturamento do mês, ticket médio)
- Filtros de busca por cliente e por status
- Botão **Nova Venda** → vai para o PDV

#### PDV — Nova Venda (`/vendas/nova`) ⭐ ponto de impacto

1. Digite `armação` no campo "Buscar Produto" → dropdown aparece com estoque e preço
2. Clique em um produto → ele entra na tabela de itens
3. Use **+/−** para alterar quantidade
4. Teste o botão de deletar (lixeira)
5. Selecione a forma de pagamento: **Cartão**, **PIX**, **Dinheiro** ou **Crediário**
6. Coloque um valor de desconto → total atualiza em tempo real
7. Clique em **Finalizar Venda** → loading de 1,5s → formulário limpa (simula sucesso)

#### Clientes (`/clientes`)

- Lista com CPF, telefone, cidade, última compra e valor total gasto
- Clique em **Ver** em qualquer cliente → detalhe com dados pessoais + histórico de compras

  > Clientes com histórico real: **João Silva** (id 1), **Ana Costa** (id 4), **Roberto Lima** (id 7)

#### Estoque (`/estoque`)

- Aba **Posição atual**: badge **OK** (verde) / **Baixo** (amarelo) / **Zerado** (vermelho)
  - Produto zerado: "Armação Infantil Flexível" — aparece em vermelho
- Aba **Movimentações**: histórico de entradas, saídas e ajustes
- Botão **Registrar Movimentação** → navega para formulário (rota existe, mas ainda sem form)

#### Caixa (`/caixa`)

- Badge **Aberto** no título
- Stat cards: Saldo atual, Total entradas, Total saídas
- Aba **Movimentações**: lista com tipo, valor colorido (+verde / −amarelo), hora e usuário
- Clique em **Registrar Movimentação** → abre **modal** com seletor de tipo, descrição, valor, forma
- Clique em **Fechar Caixa** → abre **modal de confirmação** com saldo final

#### Pedidos de Lab. (`/laboratorio`)

- Stat cards: Total, Pendentes, Prontos para retirada
- Tabela com receita completa, laboratório e prazo
- Badges coloridos: **Aguardando** (amarelo), **Em produção** (azul), **Pronto** (verde), **Entregue** (cinza)

#### Fiscal / NF-e (`/fiscal`)

- Stat cards: NFs emitidas, canceladas, valor total emitido
- Ações por nota: botão **XML** (download) e botão **X** (cancelar, apenas notas autorizadas)

#### Produtos (`/produtos`)

- Filtros por nome/código e categoria
- Badge de categoria por cor (Armação, Lente, Solar, Acessório)
- Badge de estoque OK/Baixo/Sem estoque
- Botão **Editar** por produto (navega, mas form ainda não implementado)

#### Fornecedores (`/fornecedores`)

- Lista com CNPJ, contato, telefone e total de pedidos
- Categorias por badge (Lentes, Armações)

#### Funcionários (`/funcionarios`)

- Cargo, comissão %, vendas no mês, status ativo/inativo
- Detalhe: **Thiago Nunes** é Optometrista (comissão 0%), **Camila Ramos** está inativa

#### Relatórios (`/relatorios`)

- 4 cards: Vendas por Período, Estoque, Caixa/Financeiro, Comissões
- Tabela de exportações recentes com botão Baixar

#### Configurações (`/configuracoes`)

- Aba **Dados da Ótica**: campos editáveis (Razão Social, CNPJ, endereço)
- Aba **Lojas / Filiais**: tabela com Loja Centro e Loja Shopping
- Aba **Preferências**: 4 switches funcionais (os toggles realmente ligam/desligam)

---

### BLOCO 3 — Storefront / Ecommerce (área verde)

Ponto de entrada: `http://localhost:3000/loja`

> **Dica de apresentação:** abra o DevTools (F12) e ative o modo responsivo mobile (Ctrl+Shift+M) — o impacto visual no celular é muito maior.

#### Home (`/loja`)

- Banner hero com gradiente verde
- Grid de 5 categorias com emoji e contagem de itens
- 8 produtos com badges (Mais Vendido, Novo, Promoção, Premium, Destaque)
- 3 depoimentos com estrelas
- Banner CTA "Agendar consulta" no final

#### Categoria (`/loja/categoria/armacoes`)

- Filtros na sidebar (desktop) ou painel colapsável (mobile)
- Filtro por marca e faixa de preço
- Grid responsivo de produtos

  > Outras categorias: `lentes`, `solares`, `acessorios`, `infantil`

#### Produto — detalhe (`/loja/produto/armacao-titanio-slim`) ⭐ ponto de impacto

1. Layout 2 colunas (desktop) / empilhado (mobile)
2. Seletor de cor: clique nas pills — a cor selecionada fica destacada
3. Clique em **Adicionar ao carrinho** → botão vira "Adicionado! ✓" por 2s
4. O contador no ícone de carrinho no header atualiza

  > Outros slugs: `oculos-solar-polarizado-aviador`, `lente-transitions-antirreflexo`, `lente-multifocal-digital`

#### Carrinho (`/loja/carrinho`)

- Itens adicionados aparecem aqui
- Controle **+/−** de quantidade
- Barra de progresso frete grátis acima de R$ 300
- Resumo com subtotal e total

#### Checkout — 3 steps (`/loja/checkout`) ⭐ ponto de impacto

- **Step 1 — Endereço:** formulário de entrega
- **Step 2 — Pagamento:** clique em **PIX** → exibe QR Code fake + código para copiar
- **Step 3 — Confirmação:** tela de pedido confirmado com número do pedido

#### Conta do cliente (`/loja/conta/login`)

- Aba **Entrar**: CPF com máscara, senha
- Aba **Criar conta**: formulário com nome, CPF, e-mail, telefone, senha

#### Sobre (`/loja/sobre`)

- História da ótica, diferenciais, equipe

#### Contato (`/loja/contato`)

- Formulário de contato + mapa

---

### BLOCO 4 — Admin Baranet (área azul)

Ponto de entrada: `http://localhost:3000/admin/login`

#### Login Admin (`/admin/login`)

1. Digite qualquer e-mail (ex: `carlos@baranet.com.br`)
2. Digite qualquer senha (ex: `admin123`)
3. Clique em **Entrar** → loading 1s → redireciona para `/admin`

#### Dashboard (`/admin`)

- KPIs: **8 óticas**, MRR **R$ 2.895** (+12,4%), Churn **2,1%**, **1 nova** este mês
- Tabela "Óticas recentes" com badges: **Ativo** (verde), **Suspenso** (vermelho), **Trial** (amarelo)
- Tabela "Faturamento recente" com status de pagamento

#### Óticas (`/admin/oticas`)

- 8 óticas com plano, MRR e status
- Filtros por status e busca
- Clique em **Ver** → detalhe com histórico de faturamento e botão Suspender/Ativar
- Botão **Nova Ótica** → formulário com seleção de plano

#### Planos (`/admin/planos`)

- 4 planos: Básico (R$ 199), Padrão (R$ 399), Premium (R$ 599), Enterprise (R$ 1.299)
- Módulos incluídos por plano, total de óticas por plano

#### Módulos (`/admin/modulos`)

- Lista de 11 módulos com toggle ativo/inativo
- Módulo **API Pública** já inativo por padrão

#### Financeiro (`/admin/financeiro`)

- KPIs de MRR, inadimplência, pagas no mês
- Tabela de faturas com status: Pago, Pendente, Atrasado, Cancelado

#### Usuários (`/admin/usuarios`)

- 4 usuários admin: Super Admin, Suporte, Comercial, Financeiro

---

## Pontos de impacto (o que o cliente vai lembrar)

| Funcionalidade | Por que impressiona |
|---|---|
| PDV com busca em tempo real | Resolve a dor do dia a dia — rápido e intuitivo |
| Badges de estoque Baixo/Zerado | Prevenção proativa, visível sem ter que procurar |
| Modal de fechamento de caixa | Fluxo operacional real, com saldo calculado |
| Storefront no mobile (DevTools) | Mostra a loja online funcionando no celular agora |
| Checkout 3-step com PIX + QR | Venda online ponta a ponta |
| Layout Admin azul vs ERP laranja | Dois produtos distintos, mesma plataforma |

---

## O que deixar claro ao cliente

- Todos os dados são **exemplos** — no sistema real virão do banco de dados
- O **login com autenticação real** está em desenvolvimento (backend Laravel)
- Cada ótica terá sua própria vitrine com **cores, logo e domínio** da sua marca
- O sistema está sendo construído para escalar — cada módulo pode ser ativado por plano
