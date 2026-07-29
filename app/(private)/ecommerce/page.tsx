import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EmptyState } from "@/components/shared/empty-state";
import { ShoppingBag } from "lucide-react";

export default function EcommercePage() {
  return (
    <div className="px-[4.2vw] py-8 space-y-6">
      <Breadcrumb items={[{ label: "ERP", href: "/" }, { label: "E-comerce" }]} />

      <h1 className="text-2xl font-bold tracking-tight">E-comerce</h1>

      <EmptyState
        icon={ShoppingBag}
        title="Módulo em desenvolvimento"
        description="A gestão de pedidos do e-commerce dentro do ERP ainda está sendo construída."
      />
    </div>
  );
}
