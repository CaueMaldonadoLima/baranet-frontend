"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Pencil, Plus, RefreshCw, Trash2, X } from "lucide-react";
import { DataTable, type Column } from "@/components/shared/data-table";
import { FormSection } from "@/components/shared/form-section";
import { useToast } from "@/components/shared/toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { employeesService, storesService } from "@/services/erp";
import type { IdNome, PaginatedResponse } from "@/services/types";
import { emailValido } from "../_lib/comum";
import type { BlocoProdutosForm, EmailFornecedorForm, FornecedorForm } from "../_lib/fornecedor-form";
import { TabelaRegistros } from "../ficha/_components/tabela-registros";
import { Campo } from "./campo";

type Atualizar = (patch: Partial<FornecedorForm>) => void;

const TIPOS_PRODUTO = ["Armações", "Lentes", "Relógios", "Alimentos", "Bebidas", "Materiais"];

const SETORES_EMAIL = [
  { value: "financeiro", label: "Financeiro" },
  { value: "comercial", label: "Comercial" },
  { value: "garantias", label: "Garantias" },
  { value: "fiscal", label: "Fiscal" },
  { value: "outro", label: "Outro" },
];

// Características que o contas a pagar pede para contas de consumo (protótipo).
const CARACTERISTICAS_CONSUMO = [
  "Mínimo de referência",
  "Nº de identificação",
  "Data de vencimento",
  "Leitura anterior",
  "Leitura atual",
  "Valor medido",
  "Unidade de medida",
  "Tarifa por unidade",
  "Valor total",
  "Taxa de esgoto",
  "Serviços",
];

const COLUNAS_CONTAS = [
  { key: "situacao", label: "Situação" },
  { key: "emissao", label: "Emissão" },
  { key: "vencimento", label: "Vencimento" },
  { key: "loja", label: "Loja" },
  { key: "codigo", label: "Código" },
  { key: "nome", label: "Nome" },
  { key: "parcela", label: "Parc." },
  { key: "valorParcela", label: "Valor parcela" },
  { key: "valorPago", label: "Valor pago" },
  { key: "duplicata", label: "Duplicata" },
] as const;

const SITUACOES_CONTAS = [
  { value: "creditos", label: "Créditos" },
  { value: "debitos", label: "Débitos" },
  { value: "todos", label: "Créditos / Débitos" },
] as const;

function NaoGravado({ children }: { children: ReactNode }) {
  return <p className="text-xs text-muted-foreground">{children}</p>;
}

function Opcao({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm">
      <Checkbox checked={checked} onCheckedChange={(c) => onChange(c === true)} />
      {children}
    </label>
  );
}

/** Etiquetas removíveis (marcas, links, lojas, usuários) */
function Etiquetas({ itens, onRemover }: { itens: { chave: string | number; rotulo: string }[]; onRemover: (index: number) => void }) {
  if (itens.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {itens.map((item, i) => (
        <li
          key={item.chave}
          className="flex items-center gap-1 rounded-full border border-border bg-muted/40 py-0.5 pl-3 pr-1 text-sm"
        >
          {item.rotulo}
          <button
            type="button"
            onClick={() => onRemover(i)}
            aria-label={`Remover ${item.rotulo}`}
            className="rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        </li>
      ))}
    </ul>
  );
}

/** Campo de texto + "Adicionar" que gera uma etiqueta */
function AdicionarTexto({
  id,
  label,
  placeholder,
  onAdicionar,
}: {
  id: string;
  label: string;
  placeholder: string;
  onAdicionar: (valor: string) => void;
}) {
  const [valor, setValor] = useState("");
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!valor.trim()) return;
    onAdicionar(valor.trim());
    setValor("");
  }
  // Não é <form>: esta seção fica dentro do formulário da página.
  return (
    <div className="flex items-end gap-2">
      <Campo id={id} label={label} className="flex-1">
        <Input
          id={id}
          placeholder={placeholder}
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit(e);
          }}
        />
      </Campo>
      <Button type="button" size="sm" variant="outline" onClick={handleSubmit}>
        <Plus className="size-3.5" />
        Adicionar
      </Button>
    </div>
  );
}

// Como a entrega é identificada: cada opção tem o próprio campo (protótipo, tela 01).
const RASTREIOS = [
  { value: "numero_pedido", label: "Nº do pedido" },
  { value: "numero_recibo", label: "Nº do recibo" },
  { value: "motorista", label: "Motorista" },
  { value: "solicitado_por", label: "Solicitado por" },
  { value: "custo", label: "Custo da entrega" },
] as const;

const MODALIDADES = [
  { value: "retirada", label: "Retirada" },
  { value: "entrega", label: "Entrega" },
] as const;

function Entregas({ form, atualizar }: { form: FornecedorForm; atualizar: Atualizar }) {
  // Rastreio, modalidade e links de busca ainda não existem na API: ficam só na tela.
  const [rastreio, setRastreio] = useState("numero_pedido");
  const [valoresRastreio, setValoresRastreio] = useState<Record<string, string>>({});
  const [modalidade, setModalidade] = useState("entrega");
  const [locais, setLocais] = useState<Record<string, { local: string; dataHora: string }>>({});
  const [links, setLinks] = useState<string[]>([]);

  const localDe = (m: string) => locais[m] ?? { local: "", dataHora: "" };
  const setLocal = (m: string, patch: Partial<{ local: string; dataHora: string }>) =>
    setLocais((prev) => ({ ...prev, [m]: { ...localDe(m), ...patch } }));

  return (
    <Card className="px-6">
      <FormSection title="Fornecedor de entregas" description="Aparece em entregas nas OS ou abre em contas a pagar.">
        <Opcao checked={form.entregas} onChange={(entregas) => atualizar({ entregas })}>
          É fornecedor de entregas
        </Opcao>
        {form.entregas && (
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">Identificação da entrega</p>
              <RadioGroup
                name="rastreio-entrega"
                value={rastreio}
                onValueChange={setRastreio}
                className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
              >
                {RASTREIOS.map((r) => (
                  <div key={r.value} className="flex items-center gap-2">
                    <RadioGroupItem id={`rastreio-${r.value}`} value={r.value} aria-label={r.label} />
                    <Input
                      aria-label={r.label}
                      placeholder={r.label}
                      className="h-9"
                      value={valoresRastreio[r.value] ?? ""}
                      onChange={(e) => setValoresRastreio((prev) => ({ ...prev, [r.value]: e.target.value }))}
                      disabled={rastreio !== r.value}
                    />
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Modalidade</p>
              <RadioGroup name="modalidade-entrega" value={modalidade} onValueChange={setModalidade} className="gap-3">
                {MODALIDADES.map((m) => (
                  <div key={m.value} className="flex flex-wrap items-center gap-3">
                    <RadioGroupItem id={`modalidade-${m.value}`} value={m.value} label={m.label} />
                    <Input
                      aria-label={`Local da ${m.label.toLowerCase()}`}
                      placeholder="Local"
                      className="h-9 w-56"
                      value={localDe(m.value).local}
                      onChange={(e) => setLocal(m.value, { local: e.target.value })}
                      disabled={modalidade !== m.value}
                    />
                    <Input
                      aria-label={`Data e hora da ${m.label.toLowerCase()}`}
                      type="datetime-local"
                      className="h-9 w-56"
                      value={localDe(m.value).dataHora}
                      onChange={(e) => setLocal(m.value, { dataHora: e.target.value })}
                      disabled={modalidade !== m.value}
                    />
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <AdicionarTexto
                id="link-busca"
                label="Link de busca"
                placeholder="https://rastreamento.exemplo.com.br/"
                onAdicionar={(link) => setLinks((prev) => [...prev, link])}
              />
              <Etiquetas
                itens={links.map((l, i) => ({ chave: `${i}-${l}`, rotulo: l }))}
                onRemover={(i) => setLinks((prev) => prev.filter((_, j) => j !== i))}
              />
            </div>
            <NaoGravado>
              Identificação, modalidade e links de busca ainda não são gravados: a API não tem esses campos.
            </NaoGravado>
          </div>
        )}
      </FormSection>
    </Card>
  );
}

type ListaPermitidos =
  | { status: "carregando" }
  | { status: "erro" }
  | { status: "ok"; lista: IdNome[]; total: number };

function SeletorPermitidos({
  id,
  label,
  carregar,
  selecionados,
  onChange,
}: {
  id: string;
  label: string;
  carregar: () => Promise<PaginatedResponse<IdNome>>;
  selecionados: IdNome[];
  onChange: (lista: IdNome[]) => void;
}) {
  const [opcoes, setOpcoes] = useState<ListaPermitidos>({ status: "carregando" });
  const [tentativa, setTentativa] = useState(0);
  const [escolhido, setEscolhido] = useState("");

  useEffect(() => {
    let ativo = true;
    carregar()
      .then((res) => {
        if (ativo) setOpcoes({ status: "ok", lista: res.data, total: res.meta?.total ?? res.data.length });
      })
      .catch(() => {
        if (ativo) setOpcoes({ status: "erro" });
      });
    return () => {
      ativo = false;
    };
  }, [carregar, tentativa]);

  const disponiveis =
    opcoes.status === "ok" ? opcoes.lista.filter((o) => !selecionados.some((s) => s.id === o.id)) : [];

  function adicionar() {
    const item = disponiveis.find((o) => String(o.id) === escolhido);
    if (!item) return;
    onChange([...selecionados, item]);
    setEscolhido("");
  }

  const placeholder =
    opcoes.status === "carregando"
      ? "Carregando…"
      : opcoes.status === "erro"
        ? "Não foi possível carregar"
        : disponiveis.length === 0
          ? "Nenhum disponível"
          : "Selecione";

  return (
    <div className="space-y-2">
      <div className="flex items-end gap-2">
        <Campo id={id} label={label} className="flex-1">
          <Select value={escolhido} onValueChange={setEscolhido} disabled={disponiveis.length === 0}>
            <SelectTrigger id={id} className="w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {disponiveis.map((o) => (
                <SelectItem key={o.id} value={String(o.id)}>
                  {o.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Campo>
        {opcoes.status === "erro" ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              setOpcoes({ status: "carregando" });
              setTentativa((t) => t + 1);
            }}
          >
            <RefreshCw className="size-3.5" />
            Tentar novamente
          </Button>
        ) : (
          <Button type="button" size="sm" variant="outline" onClick={adicionar} disabled={!escolhido}>
            <Plus className="size-3.5" />
            Adicionar
          </Button>
        )}
      </div>
      {opcoes.status === "ok" && opcoes.total > opcoes.lista.length && (
        <p className="text-xs text-muted-foreground">
          Mostrando {opcoes.lista.length} de {opcoes.total}.
        </p>
      )}
      <Etiquetas
        itens={selecionados.map((s) => ({ chave: s.id, rotulo: s.name }))}
        onRemover={(i) => onChange(selecionados.filter((_, j) => j !== i))}
      />
    </div>
  );
}

// Fora do componente: referência estável para o useEffect do seletor.
const carregarLojas = () => storesService.list({ per_page: 100 });
const carregarUsuarios = () => employeesService.list({ per_page: 100 });

function FinanceiroEntregas({ form, atualizar }: { form: FornecedorForm; atualizar: Atualizar }) {
  const fe = form.financeiroEntregas;
  return (
    <Card className="px-6">
      <FormSection title="Financeiro do fornecedor de entregas" description="Como as entregas viram contas a pagar e quem pode usar o serviço.">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <Opcao checked={fe.contasPorPedido} onChange={(v) => atualizar({ financeiroEntregas: { ...fe, contasPorPedido: v } })}>
              Transforma em contas a pagar cada pedido
            </Opcao>
            <Opcao checked={fe.fechamentoPedidos} onChange={(v) => atualizar({ financeiroEntregas: { ...fe, fechamentoPedidos: v } })}>
              Fechamento de pedidos para pagamentos
            </Opcao>
            <Opcao checked={fe.cobrancaCliente} onChange={(v) => atualizar({ financeiroEntregas: { ...fe, cobrancaCliente: v } })}>
              Botão para cobrança do cliente
            </Opcao>
          </div>
          <div className="space-y-4">
            <p className="text-sm font-medium">Quem pode usar o serviço</p>
            <SeletorPermitidos
              id="permitidos-lojas"
              label="Lojas"
              carregar={carregarLojas}
              selecionados={form.lojasPermitidas}
              onChange={(lojasPermitidas) => atualizar({ lojasPermitidas })}
            />
            <SeletorPermitidos
              id="permitidos-usuarios"
              label="Usuários"
              carregar={carregarUsuarios}
              selecionados={form.usuariosPermitidos}
              onChange={(usuariosPermitidos) => atualizar({ usuariosPermitidos })}
            />
          </div>
        </div>
      </FormSection>
    </Card>
  );
}

function ContasEspeciais({ form, atualizar }: { form: FornecedorForm; atualizar: Atualizar }) {
  const [caracteristicas, setCaracteristicas] = useState<string[]>([]);
  const cartao = form.cartao;
  return (
    <Card className="px-6">
      <FormSection title="Contas especiais" description="Características especiais em contas a pagar.">
        <div className="space-y-3">
          <Opcao checked={form.contasConsumo} onChange={(contasConsumo) => atualizar({ contasConsumo })}>
            Fornecedor de água / luz / internet
          </Opcao>
          {form.contasConsumo && (
            <div className="space-y-3 pl-6">
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {CARACTERISTICAS_CONSUMO.map((c) => (
                  <Opcao
                    key={c}
                    checked={caracteristicas.includes(c)}
                    onChange={(v) =>
                      setCaracteristicas((prev) => (v ? [...prev, c] : prev.filter((x) => x !== c)))
                    }
                  >
                    {c}
                  </Opcao>
                ))}
              </div>
              <NaoGravado>As características ainda não são gravadas: a API só guarda que é fornecedor de consumo.</NaoGravado>
            </div>
          )}
        </div>

        <div className="space-y-3 border-t border-border pt-6">
          <Opcao checked={cartao.ativo} onChange={(ativo) => atualizar({ cartao: { ...cartao, ativo } })}>
            Fornecedor de cartão de crédito
          </Opcao>
          {cartao.ativo && (
            <div className="grid gap-4 pl-6 sm:grid-cols-3">
              <Campo id="cartao-vencimento" label="Dia de vencimento">
                <Input
                  id="cartao-vencimento"
                  inputMode="numeric"
                  placeholder="1 a 31"
                  value={cartao.vencimento}
                  onChange={(e) => atualizar({ cartao: { ...cartao, vencimento: e.target.value } })}
                />
              </Campo>
              <Campo id="cartao-fechamento" label="Dia de fechamento">
                <Input
                  id="cartao-fechamento"
                  inputMode="numeric"
                  placeholder="1 a 31"
                  value={cartao.fechamento}
                  onChange={(e) => atualizar({ cartao: { ...cartao, fechamento: e.target.value } })}
                />
              </Campo>
              <Campo id="cartao-limite" label="Limite total (R$)">
                <Input
                  id="cartao-limite"
                  inputMode="decimal"
                  placeholder="0,00"
                  value={cartao.limite}
                  onChange={(e) => atualizar({ cartao: { ...cartao, limite: e.target.value } })}
                />
              </Campo>
            </div>
          )}
        </div>
      </FormSection>
    </Card>
  );
}

function RegrasFiscais({ form, atualizar }: { form: FornecedorForm; atualizar: Atualizar }) {
  const r = form.regras;
  const set = (patch: Partial<FornecedorForm["regras"]>) => atualizar({ regras: { ...r, ...patch } });
  return (
    <Card className="px-6">
      <FormSection title="Regras do módulo fiscal / financeiro" description="Como as notas deste fornecedor geram financeiro.">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Opcao checked={r.fechamentoFinanceiro} onChange={(v) => set({ fechamentoFinanceiro: v })}>
              Financeiro só gera por fechamento a cada
            </Opcao>
            <Input
              aria-label="Dias entre fechamentos"
              inputMode="numeric"
              className="h-8 w-20"
              value={r.fechamentoDias}
              disabled={!r.fechamentoFinanceiro}
              onChange={(e) => set({ fechamentoDias: e.target.value })}
            />
            <span className="text-sm">dias</span>
          </div>
          <Opcao checked={r.financeiroNoXml} onChange={(v) => set({ financeiroNoXml: v })}>
            Financeiro gera automático na entrada do XML
          </Opcao>
          <Opcao checked={r.despesaLucroReal} onChange={(v) => set({ despesaLucroReal: v })}>
            Despesa para fins de cálculo de lucro real (IRPJ e CSLL)
          </Opcao>
          <Opcao checked={r.mantemPrecoNoXml} onChange={(v) => set({ mantemPrecoNoXml: v })}>
            Mantém preço de tabela de venda inalterado na entrada do XML
          </Opcao>
          <Opcao checked={r.divergenciaGeraCredito} onChange={(v) => set({ divergenciaGeraCredito: v })}>
            Divergência no custo gera automático crédito de fornecedor e tarefário na entrada do XML
          </Opcao>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo id="fornecedor-de" label="Fornecedor de">
            <Input
              id="fornecedor-de"
              placeholder="Ex: lentes, armações"
              value={form.fornecedorDe}
              onChange={(e) => atualizar({ fornecedorDe: e.target.value })}
            />
          </Campo>
          <Campo id="fornecedor-grupo-contabil" label="Grupo contábil">
            <Input
              id="fornecedor-grupo-contabil"
              value={form.grupoContabil}
              onChange={(e) => atualizar({ grupoContabil: e.target.value })}
            />
          </Campo>
        </div>
      </FormSection>
    </Card>
  );
}

function BlocoProdutos({
  id,
  titulo,
  bloco,
  onChange,
}: {
  id: string;
  titulo: string;
  bloco: BlocoProdutosForm;
  onChange: (bloco: BlocoProdutosForm) => void;
}) {
  return (
    <div className="space-y-3">
      <Opcao checked={bloco.ativo} onChange={(ativo) => onChange({ ...bloco, ativo })}>
        {titulo}
      </Opcao>
      {bloco.ativo && (
        <div className="space-y-4 pl-6">
          <div className="space-y-2">
            <p className="text-sm font-medium">Tipo de produto</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {TIPOS_PRODUTO.map((t) => (
                <Opcao
                  key={t}
                  checked={bloco.tipos.includes(t)}
                  onChange={(v) =>
                    onChange({ ...bloco, tipos: v ? [...bloco.tipos, t] : bloco.tipos.filter((x) => x !== t) })
                  }
                >
                  {t}
                </Opcao>
              ))}
            </div>
          </div>
          <AdicionarTexto
            id={`${id}-marca`}
            label="Marcas"
            placeholder="Nome da marca"
            onAdicionar={(marca) => {
              if (!bloco.marcas.includes(marca)) onChange({ ...bloco, marcas: [...bloco.marcas, marca] });
            }}
          />
          <Etiquetas
            itens={bloco.marcas.map((m) => ({ chave: m, rotulo: m }))}
            onRemover={(i) => onChange({ ...bloco, marcas: bloco.marcas.filter((_, j) => j !== i) })}
          />
        </div>
      )}
    </div>
  );
}

function Produtos({ form, atualizar }: { form: FornecedorForm; atualizar: Atualizar }) {
  return (
    <Card className="px-6">
      <FormSection title="Produtos" description="O que este fornecedor vende para a ótica.">
        <BlocoProdutos
          id="consumo"
          titulo="Produtos para consumo"
          bloco={form.consumo}
          onChange={(consumo) => atualizar({ consumo })}
        />
        <div className="border-t border-border pt-6">
          <BlocoProdutos
            id="revenda"
            titulo="Mercadoria para revenda"
            bloco={form.revenda}
            onChange={(revenda) => atualizar({ revenda })}
          />
        </div>
      </FormSection>
    </Card>
  );
}

function Emails({ form, atualizar }: { form: FornecedorForm; atualizar: Atualizar }) {
  const toast = useToast();
  const vazio: EmailFornecedorForm = { descricao: "", setor: "", email: "" };
  const [novo, setNovo] = useState<EmailFornecedorForm>(vazio);
  /** Índice do e-mail em edição; null = incluindo um novo */
  const [editando, setEditando] = useState<number | null>(null);

  function salvar() {
    if (!emailValido(novo.email)) {
      toast.warning("Informe um e-mail válido.");
      return;
    }
    const email = { ...novo, email: novo.email.trim() };
    atualizar({
      emails: editando === null ? [...form.emails, email] : form.emails.map((e, i) => (i === editando ? email : e)),
    });
    setNovo(vazio);
    setEditando(null);
  }

  function cancelarEdicao() {
    setNovo(vazio);
    setEditando(null);
  }

  const rotuloSetor = (v: string) => SETORES_EMAIL.find((s) => s.value === v)?.label ?? (v || "—");

  const columns: Column<EmailFornecedorForm>[] = [
    { header: "E-mail", cell: (row) => row.email },
    { header: "Setor", cell: (row) => rotuloSetor(row.setor) },
    { header: "Descrição", cell: (row) => row.descricao || "—" },
    {
      header: "",
      className: "w-24 text-right",
      cell: (row, index) => (
        <div className="flex justify-end gap-1">
          <Button
            type="button"
            size="xs"
            variant="ghost"
            aria-label={`Editar ${row.email}`}
            onClick={() => {
              setNovo(row);
              setEditando(index);
            }}
          >
            <Pencil className="size-3.5" />
          </Button>
          <Button
            type="button"
            size="xs"
            variant="ghost"
            aria-label={`Excluir ${row.email}`}
            onClick={() => {
              atualizar({ emails: form.emails.filter((_, i) => i !== index) });
              if (editando !== null) cancelarEdicao();
            }}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card className="px-6">
      <FormSection title="E-mails" description="Contatos por setor do fornecedor.">
        <div className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_12rem_1fr_auto]">
          <Campo id="email-descricao" label="Descrição">
            <Input
              id="email-descricao"
              placeholder="Ex: e-mail de financeiro"
              value={novo.descricao}
              onChange={(e) => setNovo({ ...novo, descricao: e.target.value })}
            />
          </Campo>
          <Campo id="email-setor" label="Setor">
            <Select value={novo.setor} onValueChange={(setor) => setNovo({ ...novo, setor })}>
              <SelectTrigger id="email-setor" className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {SETORES_EMAIL.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Campo>
          <Campo id="email-endereco" label="E-mail">
            <Input
              id="email-endereco"
              type="email"
              placeholder="nome@fornecedor.com.br"
              value={novo.email}
              onChange={(e) => setNovo({ ...novo, email: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  salvar();
                }
              }}
            />
          </Campo>
          <div className="flex gap-2">
            {editando !== null && (
              <Button type="button" size="sm" variant="outline" onClick={cancelarEdicao}>
                Cancelar
              </Button>
            )}
            <Button type="button" size="sm" onClick={salvar}>
              {editando === null ? <Plus className="size-3.5" /> : <Pencil className="size-3.5" />}
              {editando === null ? "Incluir" : "Salvar"}
            </Button>
          </div>
        </div>
        <DataTable
          data={form.emails}
          columns={columns}
          keyExtractor={(row, index) => `${index}-${row.email}`}
          emptyTitle="Nenhum e-mail"
          emptyDescription="Inclua os e-mails de contato por setor."
        />
      </FormSection>
    </Card>
  );
}

// Cadastro completo do fornecedor (tela 01, parte de baixo). O que a API
// aceita vai no mesmo Gravar do cadastro; o resto fica só na tela, avisado.
export function FornecedorCompleto({
  form,
  atualizar,
  editando,
}: {
  form: FornecedorForm;
  atualizar: Atualizar;
  /** Contas a pagar só faz sentido para um fornecedor já gravado */
  editando: boolean;
}) {
  return (
    <>
      <Entregas form={form} atualizar={atualizar} />
      <FinanceiroEntregas form={form} atualizar={atualizar} />
      <ContasEspeciais form={form} atualizar={atualizar} />
      <RegrasFiscais form={form} atualizar={atualizar} />
      <Produtos form={form} atualizar={atualizar} />
      <Emails form={form} atualizar={atualizar} />
      {editando && (
        <Card className="px-6">
          <FormSection title="Contas a pagar / crédito" description="Títulos e créditos deste fornecedor.">
            <TabelaRegistros
              id="contas-fornecedor"
              colunas={COLUNAS_CONTAS}
              comAno
              situacoes={SITUACOES_CONTAS}
              descricaoVazia="A API ainda não expõe o contas a pagar do fornecedor."
            />
          </FormSection>
        </Card>
      )}
    </>
  );
}
