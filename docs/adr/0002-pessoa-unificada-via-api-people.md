# Pessoa unificada passa a vir da API (`/people`); substitui a ADR 0001

A ADR 0001 adiou a unificação de Pessoa porque o contrato conhecido do backend tratava Cliente e Fornecedor como recursos independentes. A documentação Swagger da API real (OpenAPI 1.4.0, https://baranet-admin.gustavogogola.com.br/api/docs, conferida em 2026-09-23) mostra que isso mudou: `people` é o cadastro-base, e Cliente, Fornecedor, Funcionário, Médico/Optometrista e Convênio são papéis ligados por `personId`. O endpoint `GET /people` foi desenhado para a ficha "Cadastro Pessoa Física e Jurídica" (tela 03/18), com filtros `name`, `document`, `whatsapp` e `role`.

Decidimos **usar a Pessoa do backend como a identidade da ficha**. A busca da ficha consulta `GET /people`, e cada aba corresponde a um `role`. O cadastro selecionado é uma Pessoa, válida em todas as abas, e cada aba mostra se a pessoa tem aquele papel (`roleFlags`). A regra de não simular a unificação no cliente continua valendo: o vínculo entre papéis vem sempre do `personId` da API, nunca de comparar CPF/CNPJ no frontend.

Esta ADR substitui a 0001.
