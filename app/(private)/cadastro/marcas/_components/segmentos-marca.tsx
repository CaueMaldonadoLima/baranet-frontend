"use client";

import { useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import { DataTable, type Column } from "@/components/shared/data-table";
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
import type { BrandWrite } from "@/services/types";

export type SegmentoMarca = NonNullable<BrandWrite["segments"]>[number];

interface SegmentosMarcaProps {
  segmentos: SegmentoMarca[];
  onChange: (segmentos: SegmentoMarca[]) => void;
}

// Sub-aba Segmentos da marca (tela 17): categorias de produto que a marca
// atende. Vão no mesmo POST /brands da marca.
export function SegmentosMarca({ segmentos, onChange }: SegmentosMarcaProps) {
  const toast = useToast();
  const [novo, setNovo] = useState<string | null>(null);

  function handleAdicionar(e: FormEvent) {
    e.preventDefault();
    const nome = (novo ?? "").trim();
    if (!nome) {
      toast.warning("Digite o nome do segmento.");
      return;
    }
    if (segmentos.some((s) => s.name.toLowerCase() === nome.toLowerCase())) {
      toast.warning(`O segmento “${nome}” já está na lista.`);
      return;
    }
    onChange([...segmentos, { name: nome, status: "ativo" }]);
    setNovo(null);
  }

  const columns: Column<SegmentoMarca>[] = [
    { header: "Segmento", cell: (row) => row.name },
    {
      header: "Status",
      className: "w-40",
      cell: (row, index) => (
        <Select
          value={row.status}
          onValueChange={(status) =>
            onChange(
              segmentos.map((s, i) =>
                i === index ? { ...s, status: status as SegmentoMarca["status"] } : s
              )
            )
          }
        >
          <SelectTrigger aria-label={`Status de ${row.name}`} className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      header: "",
      className: "w-16 text-right",
      cell: (row, index) => (
        <Button
          size="xs"
          variant="ghost"
          aria-label={`Remover ${row.name}`}
          onClick={() => onChange(segmentos.filter((_, i) => i !== index))}
        >
          <Trash2 className="size-3.5" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        data={segmentos}
        columns={columns}
        keyExtractor={(row) => row.name}
        emptyTitle="Nenhum segmento"
        emptyDescription="Use “Novo” para adicionar os segmentos que a marca atende (ex: Roupa)."
      />
      {novo !== null ? (
        <form onSubmit={handleAdicionar} className="flex flex-wrap items-end gap-2">
          <div className="min-w-48 flex-1 space-y-1.5">
            <label htmlFor="novo-segmento" className="text-sm font-medium">Novo segmento</label>
            <Input
              id="novo-segmento"
              autoFocus
              placeholder="Ex: Roupa"
              value={novo}
              onChange={(e) => setNovo(e.target.value)}
            />
          </div>
          <Button type="button" size="sm" variant="outline" onClick={() => setNovo(null)}>
            Cancelar
          </Button>
          <Button type="submit" size="sm">
            Adicionar
          </Button>
        </form>
      ) : (
        <div className="flex justify-end">
          <Button size="sm" onClick={() => setNovo("")}>
            <Plus className="size-3.5" />
            Novo
          </Button>
        </div>
      )}
    </div>
  );
}
