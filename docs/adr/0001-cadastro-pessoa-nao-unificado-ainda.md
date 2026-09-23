# [Substituída pela ADR 0002] Unificação de Pessoa adiada até o backend expor o contrato

A ata de requisitos de 2026-09-14 pede que Cliente/Fornecedor/Funcionário sejam papéis da mesma Pessoa, com edição de dados principais (nome, documento) propagando entre todos. O contrato atual do backend (`docs/backend-contract.md`) não tem essa entidade: `/erp/customers` e `/erp/suppliers` são recursos independentes, sem FK compartilhada, e o time de frontend não implementa mudanças no Laravel (responsabilidade de outro dev).

Decidimos **não simular a unificação no cliente** (ex: vincular registros pelo CPF/CNPJ digitado) porque isso criaria uma ilusão de sincronismo que não existe de fato — a propagação de edições só é real com uma tabela `Pessoa` no backend. Até o backend entregar esse contrato, Cliente/Fornecedor/Funcionário continuam como cadastros distintos e sem vínculo; o frontend resolve agora apenas a troca de campos por Tipo de Cadastro (§3.2 da ata), que não depende do backend.
