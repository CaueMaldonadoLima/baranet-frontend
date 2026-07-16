// Usage:
// const columns: Column<Customer>[] = [
//   { header: "Nome", accessor: "name" },
//   { header: "Status", cell: (row) => <Badge variant={row.active ? "success" : "muted"}>{row.active ? "Ativo" : "Inativo"}</Badge> },
//   { header: "Ações", cell: (row) => <Button size="xs" onClick={() => edit(row)}>Editar</Button>, className: "w-20" },
// ];
//
// <DataTable
//   data={customers}
//   columns={columns}
//   isLoading={isFetching}
//   emptyTitle="Nenhum cliente"
//   emptyDescription="Cadastre o primeiro cliente para começar."
//   keyExtractor={(row) => row.id}
// />

import * as React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/shared/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import type { LucideIcon } from "lucide-react";

export interface Column<T> {
  header: string;
  /** Chave do objeto — usado quando não há `cell` */
  accessor?: keyof T;
  /** Renderer customizado da célula */
  cell?: (row: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T, index: number) => string | number;
  isLoading?: boolean;
  /** Número de linhas skeleton exibidas no loading. Default: 5 */
  skeletonRows?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: LucideIcon;
  className?: string;
  tableClassName?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  skeletonRows = 5,
  emptyTitle = "Nenhum resultado encontrado",
  emptyDescription,
  emptyIcon,
  className,
  tableClassName,
}: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-auto rounded-lg border border-border", className)}>
      <table className={cn("w-full text-sm", tableClassName)}>
        {/* Header */}
        <thead className="bg-muted/60">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className={cn(
                  "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                  col.headerClassName
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-border">
          {/* Loading */}
          {isLoading &&
            Array.from({ length: skeletonRows }).map((_, i) => (
              <tr key={`skeleton-${i}`} aria-hidden>
                {columns.map((_, j) => (
                  <td key={j} className="px-4 py-3">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))}

          {/* Dados */}
          {!isLoading &&
            data.map((row, index) => (
              <tr
                key={keyExtractor(row, index)}
                className="bg-card transition-colors hover:bg-muted/40"
              >
                {columns.map((col, j) => (
                  <td
                    key={j}
                    className={cn("px-4 py-3 text-foreground", col.className)}
                  >
                    {col.cell
                      ? col.cell(row, index)
                      : col.accessor !== undefined
                      ? String(row[col.accessor] ?? "—")
                      : "—"}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>

      {/* Empty state — fora da tabela para ocupar largura total */}
      {!isLoading && data.length === 0 && (
        <EmptyState
          icon={emptyIcon}
          title={emptyTitle}
          description={emptyDescription}
          className="py-12"
        />
      )}
    </div>
  );
}
