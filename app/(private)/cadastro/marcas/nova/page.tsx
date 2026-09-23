"use client";

import { use, useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shared/tabs";
import { useToast } from "@/components/shared/toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { brandsService } from "@/services/erp";
import { mensagemDeErro, type BrandWrite, type Representative } from "@/services/types";
import { RepresentantesMarca } from "./_components/representantes-marca";
import { SegmentosMarca, type SegmentoMarca } from "./_components/segmentos-marca";

// Cadastrar Marca (telas 17 e 18). Com ?fornecedor=<supplierId> (vindo da aba
// Marcas da ficha), a marca criada já é vinculada a esse fornecedor.
export default function NovaMarcaPage({
  searchParams,
}: {
  searchParams: Promise<{ fornecedor?: string }>;
}) {
  const { fornecedor } = use(searchParams);
  const supplierId = fornecedor && /^\d+$/.test(fornecedor) ? Number(fornecedor) : null;
  const router = useRouter();
  const toast = useToast();

  // Volta para quem abriu (a aba Marcas da ficha); aberta direto, vai para a ficha.
  function voltar() {
    if (window.history.length > 1) router.back();
    else router.push("/cadastro/ficha");
  }

  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");
  const [origem, setOrigem] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [historico, setHistorico] = useState("");
  const [ativa, setAtiva] = useState(true);
  const [segmentos, setSegmentos] = useState<SegmentoMarca[]>([]);
  const [representantes, setRepresentantes] = useState<Representative[]>([]);
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!nome.trim()) {
      toast.warning("Informe o nome da marca.");
      return;
    }

    const payload: BrandWrite = {
      name: nome.trim(),
      active: ativa,
      segments: segmentos,
      representativeIds: representantes.map((r) => r.id),
    };
    if (codigo.trim()) payload.code = codigo.trim();
    if (origem.trim()) payload.origin = origem.trim();
    if (logoUrl.trim()) payload.logoUrl = logoUrl.trim();
    if (historico.trim()) payload.history = historico.trim();

    setSalvando(true);
    let marcaId: number;
    try {
      marcaId = (await brandsService.create(payload)).id;
    } catch (err) {
      toast.error("Não foi possível cadastrar a marca", mensagemDeErro(err));
      setSalvando(false);
      return;
    }

    if (supplierId !== null) {
      try {
        await brandsService.attachToSupplier(supplierId, { brandId: marcaId });
      } catch (err) {
        // A marca já existe: o vínculo pode ser refeito por "Vincular marca".
        toast.warning(
          "Marca cadastrada, mas não vinculada ao fornecedor",
          `${mensagemDeErro(err)} Use “Vincular marca” na ficha do fornecedor.`
        );
        voltar();
        return;
      }
    }

    toast.success(supplierId !== null ? "Marca cadastrada e vinculada ao fornecedor." : "Marca cadastrada.");
    voltar();
  }

  const logoValida = /^https?:\/\//i.test(logoUrl.trim());

  return (
    <div className="px-[4.2vw] py-8 space-y-6">
      <Breadcrumb
        items={[
          { label: "ERP", href: "/" },
          { label: "Cadastro", href: "/cadastro" },
          { label: "Ficha", href: "/cadastro/ficha" },
          { label: "Nova marca" },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Cadastrar marca</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={voltar} disabled={salvando}>
            Cancelar
          </Button>
          <Button type="submit" form="nova-marca" disabled={salvando}>
            <Save className="size-3.5" />
            {salvando ? "Salvando…" : "Salvar"}
          </Button>
        </div>
      </div>

      <Card className="px-6">
        <form id="nova-marca" onSubmit={handleSubmit} className="flex flex-col gap-6 md:flex-row">
          <div className="flex w-full shrink-0 flex-col gap-2 md:w-44">
            <p className="text-sm font-medium">Logo</p>
            <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border border-input bg-muted/30">
              {logoValida ? (
                // URL externa arbitrária: sem otimização (não há remotePatterns)
                <Image
                  src={logoUrl.trim()}
                  alt="Logo da marca"
                  width={176}
                  height={176}
                  unoptimized
                  className="size-full object-contain"
                />
              ) : (
                <span className="text-xs text-muted-foreground">Sem logo</span>
              )}
            </div>
            <label htmlFor="marca-logo" className="sr-only">URL do logo</label>
            <Input
              id="marca-logo"
              type="url"
              placeholder="https://…/logo.png"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              A API recebe o logo por URL; ainda não há envio de arquivo.
            </p>
          </div>

          <div className="flex-1 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="marca-nome" className="text-sm font-medium">Nome</label>
                <Input id="marca-nome" value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="marca-codigo" className="text-sm font-medium">Código</label>
                <Input id="marca-codigo" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="marca-origem" className="text-sm font-medium">Origem</label>
                <Input
                  id="marca-origem"
                  placeholder="Ex: Nacional, Itália"
                  value={origem}
                  onChange={(e) => setOrigem(e.target.value)}
                />
              </div>
              <label className="flex items-center gap-2 self-end pb-2 text-sm">
                <Checkbox checked={ativa} onCheckedChange={(c) => setAtiva(c === true)} />
                Marca ativa
              </label>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="marca-historico" className="text-sm font-medium">Histórico</label>
              <Textarea
                id="marca-historico"
                className="min-h-28"
                value={historico}
                onChange={(e) => setHistorico(e.target.value)}
              />
            </div>
          </div>
        </form>
      </Card>

      <Tabs defaultValue="segmentos">
        <TabsList className="w-fit">
          <TabsTrigger value="segmentos">Segmentos</TabsTrigger>
          <TabsTrigger value="representantes">Representantes</TabsTrigger>
        </TabsList>
        <TabsContent value="segmentos">
          <Card className="px-6">
            <SegmentosMarca segmentos={segmentos} onChange={setSegmentos} />
          </Card>
        </TabsContent>
        <TabsContent value="representantes">
          <Card className="px-6">
            <RepresentantesMarca vinculados={representantes} onChange={setRepresentantes} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
