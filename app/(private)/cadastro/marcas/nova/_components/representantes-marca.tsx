"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AlertCircle, Plus, Search } from "lucide-react";
import { DataTable, type Column } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Modal, ModalFooter } from "@/components/shared/modal";
import { useToast } from "@/components/shared/toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { representativesService } from "@/services/erp";
import { mensagemDeErro, type Representative } from "@/services/types";

// Cada campo busca pelo próprio valor via `search`. O Swagger não documenta
// filtros de /representatives: se a API ignorar o parâmetro, a lista vem inteira.
const CAMPOS_BUSCA = [
  { key: "codigo", label: "Código", placeholder: "Código" },
  { key: "nome", label: "Nome", placeholder: "Nome do representante" },
  { key: "documento", label: "CPF / CNPJ", placeholder: "000.000.000-00" },
  { key: "whatsapp", label: "Whatsapp", placeholder: "(00) 00000-0000" },
] as const;

type CampoBusca = (typeof CAMPOS_BUSCA)[number]["key"];

// Segmento, região e vigência do representante ainda não vêm na API.
const FILTROS_REGIAO = [
  { key: "segmentos", label: "Segmentos" },
  { key: "estado", label: "Estado" },
  { key: "cidades", label: "Cidades" },
] as const;

type Resultado =
  | { status: "carregando" }
  | { status: "erro"; mensagem: string }
  | { status: "ok"; representantes: Representative[] };

interface NovoRepresentanteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCriado: (representante: Representative) => void;
}

function NovoRepresentante({ open, onOpenChange, onCriado }: NovoRepresentanteProps) {
  const toast = useToast();
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!nome.trim()) {
      toast.warning("Informe o nome do representante.");
      return;
    }
    setSalvando(true);
    try {
      const criado = await representativesService.create({
        name: nome.trim(),
        phone: whatsapp.trim() || undefined,
        email: email.trim() || undefined,
      });
      toast.success("Representante cadastrado.");
      onCriado(criado);
      onOpenChange(false);
    } catch (err) {
      toast.error("Não foi possível cadastrar o representante", mensagemDeErro(err));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Novo representante" size="md">
      <form id="novo-representante" onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="representante-nome" className="text-sm font-medium">Nome</label>
          <Input id="representante-nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="representante-whatsapp" className="text-sm font-medium">Whatsapp / Celular</label>
          <Input
            id="representante-whatsapp"
            placeholder="(00) 00000-0000"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="representante-email" className="text-sm font-medium">E-mail</label>
          <Input id="representante-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </form>
      <ModalFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button type="submit" form="novo-representante" disabled={salvando}>
          {salvando ? "Salvando…" : "Cadastrar"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

interface RepresentantesMarcaProps {
  vinculados: Representative[];
  onChange: (vinculados: Representative[]) => void;
}

// Sub-aba Representantes da marca (tela 18). Os representantes marcados vão
// em representativeIds no POST /brands.
export function RepresentantesMarca({ vinculados, onChange }: RepresentantesMarcaProps) {
  const toast = useToast();
  const [campos, setCampos] = useState<Record<CampoBusca, string>>({
    codigo: "",
    nome: "",
    documento: "",
    whatsapp: "",
  });
  const [resultado, setResultado] = useState<Resultado>({ status: "carregando" });
  const [novoAberto, setNovoAberto] = useState(false);
  const ultimaBuscaId = useRef(0);

  function buscar(termo: string) {
    const buscaId = ++ultimaBuscaId.current;
    setResultado({ status: "carregando" });
    representativesService
      .list({ search: termo, per_page: 100 })
      .then((res) => {
        if (buscaId === ultimaBuscaId.current) setResultado({ status: "ok", representantes: res.data });
      })
      .catch((err) => {
        if (buscaId === ultimaBuscaId.current) setResultado({ status: "erro", mensagem: mensagemDeErro(err) });
      });
  }

  // Começa listando todos, para escolher sem precisar buscar. Usa o mesmo
  // controle de "última busca": uma busca feita antes desta carga terminar vence.
  useEffect(() => {
    const controle = ultimaBuscaId;
    const buscaId = ++controle.current;
    representativesService
      .list({ per_page: 100 })
      .then((res) => {
        if (buscaId === controle.current) setResultado({ status: "ok", representantes: res.data });
      })
      .catch((err) => {
        if (buscaId === controle.current) setResultado({ status: "erro", mensagem: mensagemDeErro(err) });
      });
    return () => {
      controle.current++;
    };
  }, []);

  function handleBuscar(campo: CampoBusca) {
    const termo = campos[campo].trim();
    if (!termo) {
      toast.warning("Digite algo para buscar.");
      return;
    }
    buscar(termo);
  }

  function toggleVinculo(representante: Representative, vincular: boolean) {
    onChange(
      vincular
        ? [...vinculados, representante]
        : vinculados.filter((r) => r.id !== representante.id)
    );
  }

  const idsVinculados = new Set(vinculados.map((r) => r.id));
  // Vinculados primeiro, mesmo que a busca atual não os traga.
  const linhas = [
    ...vinculados,
    ...(resultado.status === "ok"
      ? resultado.representantes.filter((r) => !idsVinculados.has(r.id))
      : []),
  ];

  const columns: Column<Representative>[] = [
    {
      header: "",
      className: "w-10",
      cell: (row) => (
        <Checkbox
          aria-label={`Vincular ${row.name}`}
          checked={idsVinculados.has(row.id)}
          onCheckedChange={(checked) => toggleVinculo(row, checked === true)}
        />
      ),
    },
    { header: "Representante", cell: (row) => row.name },
    { header: "Segmentos", cell: () => "—" },
    { header: "Estado", cell: () => "—" },
    { header: "Cidade", cell: () => "—" },
    { header: "Whatsapp", cell: (row) => row.phone || "—" },
    { header: "Vigência", cell: () => "—" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CAMPOS_BUSCA.map((campo) => (
          <form
            key={campo.key}
            className="space-y-1.5"
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              handleBuscar(campo.key);
            }}
          >
            <label htmlFor={`representante-busca-${campo.key}`} className="text-sm font-medium">
              {campo.label}
            </label>
            <div className="relative">
              <Input
                id={`representante-busca-${campo.key}`}
                placeholder={campo.placeholder}
                value={campos[campo.key]}
                onChange={(e) => setCampos((prev) => ({ ...prev, [campo.key]: e.target.value }))}
                className="pr-9"
              />
              <button
                type="submit"
                aria-label={`Buscar representante por ${campo.label}`}
                className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <Search className="size-4" />
              </button>
            </div>
          </form>
        ))}
      </div>

      <div className="space-y-1.5">
        <div className="grid gap-4 sm:grid-cols-3">
          {FILTROS_REGIAO.map((f) => (
            <div key={f.key} className="space-y-1.5">
              <label htmlFor={`representante-filtro-${f.key}`} className="text-sm font-medium">
                {f.label}
              </label>
              <Select disabled>
                <SelectTrigger id={`representante-filtro-${f.key}`} className="w-full">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          A API ainda não informa segmento, região e vigência do representante.
        </p>
      </div>

      {resultado.status === "erro" ? (
        <EmptyState
          icon={AlertCircle}
          title="Não foi possível buscar representantes"
          description={resultado.mensagem}
          action={{ label: "Tentar novamente", onClick: () => buscar("") }}
          className="rounded-lg border border-border py-12"
        />
      ) : (
        <DataTable
          data={linhas}
          columns={columns}
          keyExtractor={(row) => row.id}
          isLoading={resultado.status === "carregando" && vinculados.length === 0}
          emptyTitle="Nenhum representante encontrado"
          emptyDescription="Tente outro termo ou cadastre um novo representante."
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="text-muted-foreground">
          {vinculados.length === 1 ? "1 representante vinculado" : `${vinculados.length} representantes vinculados`}
        </span>
        <Button size="sm" onClick={() => setNovoAberto(true)}>
          <Plus className="size-3.5" />
          Novo representante
        </Button>
      </div>

      {novoAberto && (
        <NovoRepresentante
          open={novoAberto}
          onOpenChange={setNovoAberto}
          onCriado={(criado) => onChange([...vinculados, criado])}
        />
      )}
    </div>
  );
}
