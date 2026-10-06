"use client";

import { useState } from "react";
import { Ban, Copy, Download, FileSearch, PackagePlus, Printer, Send } from "lucide-react";
import { Modal, ModalFooter } from "@/components/shared/modal";
import { useToast } from "@/components/shared/toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const OPCOES_IMPRESSAO = [
  { key: "infoOs", label: "Inserir informações da O.S. nos dados adicionais" },
  { key: "observacoesPedido", label: "Imprimir as observações do pedido nos dados adicionais" },
  { key: "dataDigitacao", label: "Imprimir a data de digitação" },
] as const;

type OpcaoImpressao = (typeof OPCOES_IMPRESSAO)[number]["key"];

const ACOES_NFE = [
  { label: "Transmitir", icon: Send },
  { label: "Buscar protocolos", icon: FileSearch },
  { label: "Imprimir Danfe", icon: Printer },
  { label: "Download XML", icon: Download },
  { label: "Cancelar NF-e", icon: Ban },
] as const;

const ACOES_DUPLICAR = [
  { label: "Duplicar na mesma loja de origem da nota", icon: Copy },
  { label: "Duplicar na loja em que estou logado", icon: Copy },
  { label: "Gerar movimento de estoque", icon: PackagePlus },
] as const;

// Popup "Emissão de NF-e" (telas 08 e 15 — o mesmo nas duas origens). A
// emissão e a transmissão para a Sefaz são integração fiscal do backend, que a
// API ainda não expõe: as ações avisam que ainda não estão disponíveis.
export function PopupNfe({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const toast = useToast();
  const [impressao, setImpressao] = useState<Record<OpcaoImpressao, boolean>>({
    infoOs: false,
    observacoesPedido: false,
    dataDigitacao: false,
  });

  function avisarIndisponivel(acao: string) {
    toast.info(
      `${acao}: ainda não disponível`,
      "A emissão de NF-e depende da integração fiscal do backend, que a API ainda não expõe."
    );
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Emissão de NF-e" size="5xl">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {ACOES_NFE.map(({ label, icon: Icon }) => (
            <Button key={label} size="sm" variant="outline" onClick={() => avisarIndisponivel(label)}>
              <Icon className="size-3.5" />
              {label}
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Duplicar NF-e</p>
          <div className="flex max-w-md flex-col gap-2">
            {ACOES_DUPLICAR.map(({ label, icon: Icon }) => (
              <Button key={label} size="sm" onClick={() => avisarIndisponivel(label)}>
                <Icon className="size-3.5" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="nfe-transmissao" className="text-sm font-medium">
            Transmissão de Nota Fiscal Eletrônica para Sefaz
          </label>
          <Textarea
            id="nfe-transmissao"
            readOnly
            className="min-h-24 max-w-md"
            placeholder="O retorno da Sefaz aparece aqui depois de transmitir."
          />
        </div>

        <fieldset className="flex flex-wrap gap-x-6 gap-y-2">
          <legend className="sr-only">Impressão</legend>
          {OPCOES_IMPRESSAO.map((o) => (
            <label key={o.key} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={impressao[o.key]}
                onCheckedChange={(c) => setImpressao((prev) => ({ ...prev, [o.key]: c === true }))}
              />
              {o.label}
            </label>
          ))}
        </fieldset>
      </div>

      <ModalFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Fechar
        </Button>
      </ModalFooter>
    </Modal>
  );
}
