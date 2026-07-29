import { Breadcrumb } from "@/components/shared/breadcrumb";
import {
  Building2,
  CreditCard,
  Ban,
  Clock,
  UserPlus,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const notifications = [
  {
    id: 1,
    icon: UserPlus,
    color: "text-success bg-success/10",
    title: "Nova ótica cadastrada",
    description: "Ótica Premium (Brasília/DF) iniciou o período de trial.",
    time: "Hoje às 09:14",
  },
  {
    id: 2,
    icon: CreditCard,
    color: "text-info bg-info/10",
    title: "Pagamento recebido",
    description: "Grupo Optical realizou o pagamento de R$ 1.299,00 referente a maio/2026.",
    time: "Hoje às 08:30",
  },
  {
    id: 3,
    icon: Ban,
    color: "text-destructive bg-destructive/10",
    title: "Ótica suspensa por inadimplência",
    description: "Ótica Família (Fortaleza/CE) foi suspensa automaticamente após 15 dias de atraso.",
    time: "Hoje às 07:00",
  },
  {
    id: 4,
    icon: Clock,
    color: "text-warning bg-warning/10",
    title: "Trial expirando",
    description: "A Ótica Premium tem 2 dias restantes de trial. Nenhuma conversão registrada.",
    time: "Hoje às 06:00",
  },
  {
    id: 5,
    icon: AlertTriangle,
    color: "text-warning bg-warning/10",
    title: "Pagamento atrasado",
    description: "Ótica Express (Manaus/AM) está com fatura de R$ 199,00 em atraso há 37 dias.",
    time: "Ontem às 23:00",
  },
  {
    id: 6,
    icon: Building2,
    color: "text-info bg-info/10",
    title: "Nova loja adicionada",
    description: "Grupo Optical cadastrou a 8ª loja no sistema.",
    time: "Ontem às 14:22",
  },
];

export default function NotificacoesPage() {
  return (
    <div className="px-[4.2vw] py-8 space-y-6">
      <Breadcrumb
        items={[
          { label: "Admin", href: "/admin" },
          { label: "Notificações" },
        ]}
      />

      <h1 className="text-2xl font-bold tracking-tight">Notificações</h1>

      <div className="rounded-lg border border-border bg-card divide-y divide-border">
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
            <div key={n.id} className="flex items-start gap-4 px-5 py-4">
              <div className={cn("mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md", n.color)}>
                <Icon className="size-4" aria-hidden />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{n.title}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{n.description}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0 mt-0.5">
                {n.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
