import { redirect } from "next/navigation";
export default function ProdutoRedirect({ params }: { params: Promise<{ slug: string }> }) {
  // Movido para /loja/produto/[slug]
  redirect("/loja");
}
