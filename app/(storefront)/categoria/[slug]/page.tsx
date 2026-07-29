import { redirect } from "next/navigation";
export default function CategoriaRedirect({ params }: { params: Promise<{ slug: string }> }) {
  // Movido para /loja/categoria/[slug]
  redirect("/loja");
}
