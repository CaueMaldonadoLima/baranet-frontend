# Baranet — Cadastro e Identidade

Plataforma ERP multi-tenant para redes de óticas. Este glossário cobre o domínio de cadastro/identidade (clientes, fornecedores, funcionários, usuários) conforme consolidado na ata de requisitos de 2026-09-14 e no protótipo Adobe XD "Cadastro de Fornecedor e Clientes, Marcas e Representantes" (18 telas, ver issue #7 e suas sub-issues). Fora daqui (vendas, estoque, fiscal, caixa) segue vocabulário próprio, ainda não documentado.

## Language

### Identidade e cadastro

**Pessoa**:
O indivíduo ou organização por trás de um ou mais Tipos de Cadastro. A mesma pessoa pode ser Cliente e Fornecedor ao mesmo tempo, compartilhando nome, documento e endereço. Existe no backend como `people` (`personId`). Cliente, Fornecedor, Funcionário, Médico/Optometrista e Convênio são **papéis** ligados a ela (`roles` / `roleFlags`). Ver ADR 0002.

**Cadastro**:
O registro de uma Pessoa sob um Tipo de Cadastro específico (ex: um registro de Cliente, um registro de Fornecedor). Um Cadastro não implica acesso ao sistema — isso é o conceito de Usuário.
_Avoid_: Registro, ficha (usados de forma intercambiável na ata, mas "Cadastro" é o termo consagrado na tela e no código).

**Tipo de Cadastro**:
Classifica um Cadastro como Cliente, Fornecedor, Funcionário, Administrador ou Representante. Determina quais campos aparecem na tela de cadastro (regra ainda não implementada — hoje a tela mostra todos os campos de todos os tipos simultaneamente).
- **Representante**: é o mesmo Representante de marca (ver abaixo), papel `representative` sobre a Pessoa. Segundo o parceiro (2026-10-13), só se cadastra dentro da Marca: escolher o tipo no formulário (`REPRESENTANTE_SO_NA_MARCA`) e o "Incluir novo" da aba Representante levam ao cadastro de marcas.
- **Cadastro especial** (Loja / Usuário / Usuário Pagador / Banco): estava no protótipo, mas não é mencionado na ata e nunca foi gravado. Vai existir, mas está **oculto na tela desde 2026-10-08** (constante `MOSTRAR_CADASTRO_ESPECIAL`) para não gerar ruído enquanto não funciona. Significado de negócio **pendente de esclarecimento com o cliente** — não presumir função.

**Usuário**:
Capacidade de autenticação (login, senha, 2FA) associada a um Cadastro. Só Funcionário e Administrador carregam essa capacidade — Cliente e Fornecedor não têm login no ERP (o cliente final de uma ótica loga no storefront via um fluxo e cookie `store_session` totalmente separados).
_Avoid_: Conta, login (como sinônimo do cadastro inteiro — "Usuário" é a capacidade de acesso, não a pessoa).

**Usuário autorizador**:
Funcionário com permissão para aprovar operações pendentes de outros usuários (ex: liberar um produto cadastrado por um vendedor). Papel de aprovação, distinto de Administrador.

### Catálogo e representação comercial

**Marca**:
Fabricante/marca de um produto (ex: armação, lente), cadastrada com logo, histórico e segmentos (categorias de produto que a marca atende). Conceito que aparece no protótipo do cadastro unificado, mas não é mencionado na ata de requisitos. Existe na API (`/brands`, com vínculo ao fornecedor em `/suppliers/{id}/brands`). A lista de marcas (`/cadastro/marcas`) não está no protótipo: foi criada em 2026-10-13 para abrir e alterar marcas fora da ficha do fornecedor.

**Representante (de marca)**:
Contato comercial de uma ou mais Marcas (N:N), com segmentos (armações, lentes, lentes de contato, máquinas e equipamentos, acessórios), estado e cidade. É um papel sobre a Pessoa (`/representatives`; `code` = id): o Código da tela 18 reaproveita uma Pessoa existente (`personId`). Vigência aparece no protótipo, mas ainda não existe na API.

### Operação

**Loja**:
Filial/unidade física de uma ótica (tenant). Eixo independente do Tipo de Cadastro — configurações (fila de vendas, salário base, benefícios) são armazenadas por Loja quando aplicável.

**Fila de vendas**:
Mecanismo que ordena qual Usuário Vendedor atende a próxima venda ou sai para intervalo. Regras de entrada/saída, antecedência de intervalo e quantidade simultânea de ausentes ainda **a definir** com o cliente.

**Tarefário**:
Módulo de tarefas encadeadas por processo: ao concluir uma etapa (ex: enviar pedido ao laboratório), o sistema pode gerar automaticamente a próxima (ex: avisar o cliente). Estrutura de fluxos e gatilhos ainda **a definir**.
