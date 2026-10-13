"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AlertCircle, Pencil, Plus, Search } from "lucide-react";
import { DataTable, type Column } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
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
import { cn } from "@/lib/utils";
import { peopleService, representativesService } from "@/services/erp";
import { mensagemDeErro, type Representative } from "@/services/types";
import { Campo } from "../../_components/campo";
import { UFS } from "../../_lib/comum";
import {
  SEGMENTOS_REPRESENTANTE,
  formParaRepresentativeWrite,
  pessoaParaRepresentante,
  representanteParaForm,
  representanteVazio,
  rotuloSegmentos,
  validarRepresentante,
  type RepresentanteForm,
} from "../../_lib/representante-form";

type Resultado =
  | { status: "carregando" }
  | { status: "erro"; mensagem: string }
  | { status: "ok"; representantes: Representative[] };

interface RepresentantesMarcaProps {
  vinculados: Representative[];
  onChange: (vinculados: Representative[]) => void;
}

// Sub-aba Representantes da marca (tela 18). A linha de campos inclui um
// representante novo (ou reaproveita a pessoa do Código) e já o vincula; a
// grid lista os cadastrados para marcar quais atendem a marca. Os marcados vão
// em representativeIds no POST /brands. Vigência ainda não vem na API.
export function RepresentantesMarca({ vinculados, onChange }: RepresentantesMarcaProps) {
  const toast = useToast();
  const [form, setForm] = useState<RepresentanteForm>(representanteVazio);
  /** Representante sendo alterado (PUT) em vez de incluído */
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [buscandoCodigo, setBuscandoCodigo] = useState(false);
  const [termo, setTermo] = useState("");
  const [resultado, setResultado] = useState<Resultado>({ status: "carregando" });
  const ultimaBuscaId = useRef(0);

  const atualizar = (patch: Partial<RepresentanteForm>) => setForm((prev) => ({ ...prev, ...patch }));

  function buscar(busca: string) {
    const buscaId = ++ultimaBuscaId.current;
    setResultado({ status: "carregando" });
    representativesService
      .list({ search: busca || undefined, per_page: 100 })
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

  function limpar() {
    setForm(representanteVazio());
    setEditandoId(null);
  }

  function vincular(representante: Representative) {
    if (vinculados.some((r) => r.id === representante.id)) return;
    onChange([...vinculados, representante]);
  }

  /** Troca o representante alterado onde ele aparece (vinculados e grid) */
  function substituir(salvo: Representative) {
    onChange(vinculados.map((r) => (r.id === salvo.id ? salvo : r)));
    setResultado((prev) =>
      prev.status === "ok"
        ? { ...prev, representantes: prev.representantes.map((r) => (r.id === salvo.id ? salvo : r)) }
        : prev
    );
  }

  // Código = pessoa já cadastrada. Se já for representante, só vincula;
  // senão, traz os dados dela para completar segmentos e região.
  async function buscarCodigo() {
    const codigo = form.codigo.trim();
    if (!/^\d+$/.test(codigo)) {
      toast.warning("Digite o código numérico do cadastro.");
      return;
    }
    setBuscandoCodigo(true);
    try {
      const pessoa = await peopleService.get(Number(codigo));
      if (pessoa.representativeId !== null) {
        const existente = await representativesService.get(pessoa.representativeId);
        vincular(existente);
        limpar();
        toast.success(`${existente.name} já é representante e foi vinculado à marca.`);
        return;
      }
      setForm({ ...pessoaParaRepresentante(pessoa), segmentos: form.segmentos });
    } catch (err) {
      toast.warning("Cadastro não encontrado", mensagemDeErro(err));
    } finally {
      setBuscandoCodigo(false);
    }
  }

  async function handleIncluir(e: FormEvent) {
    e.preventDefault();
    const erro = validarRepresentante(form);
    if (erro) {
      toast.warning(erro);
      return;
    }
    setSalvando(true);
    try {
      if (editandoId !== null) {
        const salvo = await representativesService.update(editandoId, formParaRepresentativeWrite(form, "editar"));
        substituir(salvo);
        toast.success("Representante atualizado.");
      } else {
        const criado = await representativesService.create(formParaRepresentativeWrite(form));
        vincular(criado);
        toast.success("Representante incluído e vinculado à marca.");
      }
      limpar();
    } catch (err) {
      toast.error(
        editandoId !== null ? "Não foi possível alterar o representante" : "Não foi possível incluir o representante",
        mensagemDeErro(err)
      );
    } finally {
      setSalvando(false);
    }
  }

  function alternarSegmento(slug: RepresentanteForm["segmentos"][number]) {
    atualizar({
      segmentos: form.segmentos.includes(slug)
        ? form.segmentos.filter((s) => s !== slug)
        : [...form.segmentos, slug],
    });
  }

  function toggleVinculo(representante: Representative, marcar: boolean) {
    if (marcar) vincular(representante);
    else onChange(vinculados.filter((r) => r.id !== representante.id));
  }

  const idsVinculados = new Set(vinculados.map((r) => r.id));
  // Vinculados primeiro, mesmo que a busca atual não os traga.
  const linhas = [
    ...vinculados,
    ...(resultado.status === "ok" ? resultado.representantes.filter((r) => !idsVinculados.has(r.id)) : []),
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
    { header: "Segmentos", cell: (row) => rotuloSegmentos(row) || "—" },
    { header: "Estado", cell: (row) => row.state || "—" },
    { header: "Cidade", cell: (row) => row.city || "—" },
    { header: "Whatsapp", cell: (row) => row.whatsapp || row.phone || "—" },
    { header: "Vigência", cell: () => "—" },
    {
      header: "",
      className: "w-12 text-right",
      cell: (row) => (
        <Button
          size="xs"
          variant="ghost"
          aria-label={`Alterar ${row.name}`}
          onClick={() => {
            setForm(representanteParaForm(row));
            setEditandoId(row.id);
          }}
        >
          <Pencil className="size-3.5" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <form onSubmit={handleIncluir} className="space-y-4" aria-label="Incluir representante">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Campo id="representante-codigo" label="Código">
            <div className="relative">
              <Input
                id="representante-codigo"
                inputMode="numeric"
                placeholder="Cadastro existente"
                value={form.codigo}
                disabled={editandoId !== null}
                onChange={(e) => atualizar({ codigo: e.target.value, personId: null })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    buscarCodigo();
                  }
                }}
                className="pr-9"
              />
              <button
                type="button"
                aria-label="Buscar cadastro pelo código"
                disabled={buscandoCodigo || editandoId !== null}
                onClick={buscarCodigo}
                className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                <Search className="size-4" />
              </button>
            </div>
          </Campo>
          <Campo id="representante-nome" label="Nome">
            <Input
              id="representante-nome"
              placeholder="Nome do representante"
              value={form.nome}
              onChange={(e) => atualizar({ nome: e.target.value })}
            />
          </Campo>
          <Campo id="representante-documento" label="CPF / CNPJ">
            <Input
              id="representante-documento"
              placeholder="000.000.000-00"
              value={form.documento}
              onChange={(e) => atualizar({ documento: e.target.value })}
            />
          </Campo>
          <Campo id="representante-whatsapp" label="Whatsapp">
            <Input
              id="representante-whatsapp"
              placeholder="(00) 00000-0000"
              value={form.whatsapp}
              onChange={(e) => atualizar({ whatsapp: e.target.value })}
            />
          </Campo>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_8rem_14rem_auto] lg:items-end">
          <fieldset className="space-y-1.5">
            <legend className="mb-1.5 text-sm font-medium">Segmentos</legend>
            <div className="flex flex-wrap gap-2">
              {SEGMENTOS_REPRESENTANTE.map((s) => {
                const marcado = form.segmentos.includes(s.value);
                return (
                  <button
                    key={s.value}
                    type="button"
                    aria-pressed={marcado}
                    onClick={() => alternarSegmento(s.value)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      marcado
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <Campo id="representante-estado" label="Estado">
            <Select value={form.estado} onValueChange={(estado) => atualizar({ estado })}>
              <SelectTrigger id="representante-estado" className="w-full">
                <SelectValue placeholder="UF" />
              </SelectTrigger>
              <SelectContent>
                {UFS.map((uf) => (
                  <SelectItem key={uf} value={uf}>
                    {uf}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Campo>
          <Campo id="representante-cidade" label="Cidade">
            <Input
              id="representante-cidade"
              value={form.cidade}
              onChange={(e) => atualizar({ cidade: e.target.value })}
            />
          </Campo>
          <div className="flex gap-2">
            {(editandoId !== null || form.personId !== null) && (
              <Button type="button" size="sm" variant="outline" onClick={limpar} disabled={salvando}>
                Cancelar
              </Button>
            )}
            <Button type="submit" size="sm" disabled={salvando}>
              {editandoId === null && <Plus className="size-3.5" />}
              {salvando ? "Salvando…" : editandoId !== null ? "Salvar" : "Incluir"}
            </Button>
          </div>
        </div>
        {form.personId !== null && editandoId === null && (
          <p className="text-xs text-muted-foreground">
            Usando o cadastro nº {form.codigo}: complete segmentos e região e clique em Incluir.
          </p>
        )}
      </form>

      <div className="space-y-4">
        <form
          className="flex max-w-md items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            buscar(termo.trim());
          }}
        >
          <Campo id="representante-busca" label="Buscar representante cadastrado" className="flex-1">
            <Input
              id="representante-busca"
              placeholder="Nome ou CPF / CNPJ"
              value={termo}
              onChange={(e) => setTermo(e.target.value)}
            />
          </Campo>
          <Button type="submit" size="sm" variant="outline">
            <Search className="size-3.5" />
            Buscar
          </Button>
        </form>

        {resultado.status === "erro" ? (
          <EmptyState
            icon={AlertCircle}
            title="Não foi possível buscar representantes"
            description={resultado.mensagem}
            action={{ label: "Tentar novamente", onClick: () => buscar(termo.trim()) }}
            className="rounded-lg border border-border py-12"
          />
        ) : (
          <DataTable
            data={linhas}
            columns={columns}
            keyExtractor={(row) => row.id}
            isLoading={resultado.status === "carregando" && vinculados.length === 0}
            emptyTitle="Nenhum representante encontrado"
            emptyDescription="Inclua um representante pelos campos acima."
          />
        )}

        <p className="text-sm text-muted-foreground">
          {vinculados.length === 1 ? "1 representante vinculado" : `${vinculados.length} representantes vinculados`}
        </p>
      </div>
    </div>
  );
}
