"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, Link2, Plus } from "lucide-react";
import { DataTable, type Column } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Modal, ModalFooter } from "@/components/shared/modal";
import { useToast } from "@/components/shared/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { brandsService } from "@/services/erp";
import {
  mensagemDeErro,
  type Brand,
  type SupplierBrand,
  type SupplierBrandAttach,
} from "@/services/types";

type Estado<T> =
  | { status: "carregando" }
  | { status: "erro"; mensagem: string }
  | { status: "ok"; dados: T };

/** "2026-01-31" → "31/01/2026", sem passar por Date (evita erro de fuso) */
function formatarData(iso: string | null) {
  if (!iso) return null;
  const [ano, mes, dia] = iso.slice(0, 10).split("-");
  return dia && mes && ano ? `${dia}/${mes}/${ano}` : iso;
}

function vigencia(marca: SupplierBrand) {
  const de = formatarData(marca.validFrom);
  const ate = formatarData(marca.validUntil);
  if (de && ate) return `${de} a ${ate}`;
  if (de) return `Desde ${de}`;
  if (ate) return `Até ${ate}`;
  return "—";
}

/** O representante do vínculo é um dos representantes da marca */
function representanteDoVinculo(marca: SupplierBrand) {
  return marca.representatives?.find((r) => r.id === marca.representativeId) ?? null;
}

const SEM_REPRESENTANTE = "nenhum";
// Máximo da API por página; o select de marcas não pagina.
const MARCAS_POR_PAGINA = 100;

interface VincularMarcaProps {
  supplierId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVinculada: () => void;
}

function VincularMarca({ supplierId, open, onOpenChange, onVinculada }: VincularMarcaProps) {
  const toast = useToast();
  const [marcas, setMarcas] = useState<Estado<{ lista: Brand[]; total: number }>>({ status: "carregando" });
  const [brandId, setBrandId] = useState("");
  const [produto, setProduto] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [representativeId, setRepresentativeId] = useState(SEM_REPRESENTANTE);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    let ativo = true;
    brandsService
      .list({ per_page: MARCAS_POR_PAGINA })
      .then((res) => {
        if (ativo) setMarcas({ status: "ok", dados: { lista: res.data, total: res.meta?.total ?? res.data.length } });
      })
      .catch((err) => {
        if (ativo) setMarcas({ status: "erro", mensagem: mensagemDeErro(err) });
      });
    return () => {
      ativo = false;
    };
  }, []);

  const marcaSelecionada =
    marcas.status === "ok" ? marcas.dados.lista.find((m) => String(m.id) === brandId) : undefined;
  const representantesDaMarca = marcaSelecionada?.representatives ?? [];

  function handleTrocarMarca(id: string) {
    setBrandId(id);
    setRepresentativeId(SEM_REPRESENTANTE);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!brandId) {
      toast.warning("Selecione a marca.");
      return;
    }
    if (validFrom && validUntil && validUntil < validFrom) {
      toast.warning("O fim da vigência precisa ser depois do início.");
      return;
    }
    const payload: SupplierBrandAttach = { brandId: Number(brandId) };
    if (produto.trim()) payload.product = produto.trim();
    if (validFrom) payload.validFrom = validFrom;
    if (validUntil) payload.validUntil = validUntil;
    if (representativeId !== SEM_REPRESENTANTE) payload.representativeId = Number(representativeId);

    setSalvando(true);
    try {
      await brandsService.attachToSupplier(supplierId, payload);
      toast.success("Marca vinculada ao fornecedor.");
      onVinculada();
      onOpenChange(false);
    } catch (err) {
      toast.error("Não foi possível vincular a marca", mensagemDeErro(err));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Vincular marca" size="lg">
      {marcas.status === "erro" ? (
        <EmptyState icon={AlertCircle} title="Não foi possível carregar as marcas" description={marcas.mensagem} />
      ) : (
        <form id="vincular-marca" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="vinculo-marca" className="text-sm font-medium">Marca</label>
            <Select value={brandId} onValueChange={handleTrocarMarca} disabled={marcas.status !== "ok"}>
              <SelectTrigger id="vinculo-marca" className="w-full">
                <SelectValue placeholder={marcas.status === "ok" ? "Selecione" : "Carregando…"} />
              </SelectTrigger>
              <SelectContent>
                {marcas.status === "ok" &&
                  marcas.dados.lista.map((m) => (
                    <SelectItem key={m.id} value={String(m.id)}>
                      {m.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {marcas.status === "ok" && marcas.dados.lista.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Nenhuma marca cadastrada. Use “Cadastrar marca” primeiro.
              </p>
            )}
            {marcas.status === "ok" && marcas.dados.total > marcas.dados.lista.length && (
              <p className="text-xs text-muted-foreground">
                Mostrando {marcas.dados.lista.length} de {marcas.dados.total} marcas.
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label htmlFor="vinculo-produto" className="text-sm font-medium">Produto</label>
            <Input
              id="vinculo-produto"
              placeholder="Ex: armações, lentes"
              value={produto}
              onChange={(e) => setProduto(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="vinculo-inicio" className="text-sm font-medium">Início da vigência</label>
              <Input id="vinculo-inicio" type="date" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="vinculo-fim" className="text-sm font-medium">Fim da vigência</label>
              <Input id="vinculo-fim" type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="vinculo-representante" className="text-sm font-medium">Representante</label>
            <Select
              value={representativeId}
              onValueChange={setRepresentativeId}
              disabled={representantesDaMarca.length === 0}
            >
              <SelectTrigger id="vinculo-representante" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SEM_REPRESENTANTE}>Nenhum</SelectItem>
                {representantesDaMarca.map((r) => (
                  <SelectItem key={r.id} value={String(r.id)}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {marcaSelecionada && representantesDaMarca.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Esta marca não tem representantes. Cadastre-os na marca.
              </p>
            )}
          </div>
        </form>
      )}
      <ModalFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button type="submit" form="vincular-marca" disabled={salvando || marcas.status !== "ok"}>
          {salvando ? "Vinculando…" : "Vincular"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

// Aba Marcas do fornecedor (tela 16): marcas vinculadas via
// GET /suppliers/{id}/brands, com os dados do vínculo (produto, vigência,
// representante).
export function MarcasFornecedor({ supplierId }: { supplierId: number }) {
  const [estado, setEstado] = useState<Estado<SupplierBrand[]>>({ status: "carregando" });
  const [tentativa, setTentativa] = useState(0);
  const [vincularAberto, setVincularAberto] = useState(false);

  useEffect(() => {
    let ativo = true;
    brandsService
      .listBySupplier(supplierId)
      .then((res) => {
        if (ativo) setEstado({ status: "ok", dados: res.data });
      })
      .catch((err) => {
        if (ativo) setEstado({ status: "erro", mensagem: mensagemDeErro(err) });
      });
    return () => {
      ativo = false;
    };
  }, [supplierId, tentativa]);

  function recarregar() {
    setEstado({ status: "carregando" });
    setTentativa((t) => t + 1);
  }

  const columns: Column<SupplierBrand>[] = [
    { header: "Marca", cell: (row) => row.name },
    {
      header: "Logo",
      className: "w-20",
      cell: (row) =>
        row.logoUrl ? (
          // URL externa arbitrária: sem otimização (não há remotePatterns)
          <Image
            src={row.logoUrl}
            alt={`Logo ${row.name}`}
            width={64}
            height={32}
            unoptimized
            className="h-8 w-auto max-w-16 object-contain"
          />
        ) : (
          "—"
        ),
    },
    { header: "Produto", cell: (row) => row.product || "—" },
    { header: "Vigência", cell: (row) => vigencia(row) },
    { header: "Representante", cell: (row) => representanteDoVinculo(row)?.name ?? "—" },
    { header: "Whatsapp / Celular", cell: (row) => representanteDoVinculo(row)?.phone || "—" },
  ];

  return (
    <div className="space-y-4">
      {estado.status === "erro" ? (
        <EmptyState
          icon={AlertCircle}
          title="Não foi possível carregar as marcas"
          description={estado.mensagem}
          action={{ label: "Tentar novamente", onClick: recarregar }}
          className="rounded-lg border border-border py-12"
        />
      ) : (
        <DataTable
          data={estado.status === "ok" ? estado.dados : []}
          columns={columns}
          keyExtractor={(row) => row.id}
          isLoading={estado.status === "carregando"}
          emptyTitle="Nenhuma marca vinculada"
          emptyDescription="Vincule uma marca já cadastrada ou cadastre uma nova."
        />
      )}

      <div className="flex flex-wrap justify-end gap-2">
        <Button size="sm" variant="outline" onClick={() => setVincularAberto(true)}>
          <Link2 className="size-3.5" />
          Vincular marca
        </Button>
        <Button size="sm" asChild>
          <Link href={`/cadastro/marcas/nova?fornecedor=${supplierId}`}>
            <Plus className="size-3.5" />
            Cadastrar marca
          </Link>
        </Button>
      </div>

      {vincularAberto && (
        <VincularMarca
          supplierId={supplierId}
          open={vincularAberto}
          onOpenChange={setVincularAberto}
          onVinculada={recarregar}
        />
      )}
    </div>
  );
}
