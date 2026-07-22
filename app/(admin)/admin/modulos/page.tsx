"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { DataTable, Column } from "@/components/shared/data-table";
import { Badge } from "@/components/shared/badge";
import { Switch } from "@/components/ui/switch";
import { mockModules } from "@/mocks/admin";

type ModuleItem = (typeof mockModules)[number];

const CATEGORY_VARIANT: Record<string, "default" | "info" | "warning" | "success" | "muted"> = {
  core: "default",
  fiscal: "warning",
  operacional: "info",
  rh: "success",
  analytics: "info",
  enterprise: "warning",
};

export default function ModulosPage() {
  const [modules, setModules] = useState(mockModules);

  function toggleModule(id: number) {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, active: !m.active } : m))
    );
  }

  const columns: Column<ModuleItem>[] = [
    { header: "Nome", accessor: "name" },
    { header: "Descrição", accessor: "description" },
    {
      header: "Categoria",
      cell: (row) => (
        <Badge variant={CATEGORY_VARIANT[row.category] ?? "muted"} size="sm">
          {row.category}
        </Badge>
      ),
    },
    {
      header: "Status",
      cell: (row) => (
        <Switch
          checked={row.active}
          onCheckedChange={() => toggleModule(row.id)}
          label={row.active ? "Ativo" : "Inativo"}
        />
      ),
    },
  ];

  return (
    <div className="px-[4.2vw] py-8 space-y-6">
      <Breadcrumb
        items={[
          { label: "Admin", href: "/admin" },
          { label: "Módulos" },
        ]}
      />

      <h1 className="text-2xl font-bold tracking-tight">Módulos do Sistema</h1>

      <DataTable
        data={modules}
        columns={columns}
        keyExtractor={(row) => row.id}
        emptyTitle="Nenhum módulo encontrado"
      />
    </div>
  );
}
