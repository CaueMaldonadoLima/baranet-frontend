import Link from "next/link";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { DataTable, Column } from "@/components/shared/data-table";
import { Badge } from "@/components/shared/badge";
import { Button } from "@/components/ui/button";
import { mockAdminUsers } from "@/mocks/admin";

type AdminUser = (typeof mockAdminUsers)[number];

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin",
  suporte: "Suporte",
  comercial: "Comercial",
  financeiro: "Financeiro",
};

const ROLE_VARIANT: Record<string, "default" | "info" | "warning" | "muted"> = {
  super_admin: "default",
  suporte: "info",
  comercial: "warning",
  financeiro: "muted",
};

const columns: Column<AdminUser>[] = [
  { header: "Nome", accessor: "name" },
  { header: "E-mail", accessor: "email" },
  {
    header: "Papel",
    cell: (row) => (
      <Badge variant={ROLE_VARIANT[row.role] ?? "muted"}>
        {ROLE_LABEL[row.role] ?? row.role}
      </Badge>
    ),
  },
  {
    header: "Status",
    cell: (row) => (
      <Badge variant={row.status === "ativo" ? "success" : "error"}>
        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
      </Badge>
    ),
  },
  {
    header: "Último acesso",
    cell: (row) => new Date(row.lastAccess).toLocaleDateString("pt-BR"),
  },
  {
    header: "Ações",
    cell: (row) => (
      <Link
        href={`/admin/usuarios/${row.id}/editar`}
        className="text-xs text-primary underline-offset-2 hover:underline"
      >
        Editar
      </Link>
    ),
    className: "w-20",
  },
];

export default function UsuariosPage() {
  return (
    <div className="px-[4.2vw] py-8 space-y-6">
      <Breadcrumb
        items={[
          { label: "Admin", href: "/admin" },
          { label: "Usuários" },
        ]}
      />

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Usuários Admin</h1>
        <Button asChild>
          <Link href="/admin/usuarios/criar">Novo Usuário</Link>
        </Button>
      </div>

      <DataTable
        data={mockAdminUsers}
        columns={columns}
        keyExtractor={(row) => row.id}
        emptyTitle="Nenhum usuário encontrado"
        emptyDescription="Adicione o primeiro usuário administrador."
      />
    </div>
  );
}
