"use client";

import { useState } from "react";
import { Ban, Download, FileSearch, Printer, Send } from "lucide-react";
import { Modal, ModalFooter } from "@/components/shared/modal";
import { useToast } from "@/components/shared/toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const OPCOES_IMPRESSAO = [
  { key: "infoOs", label: "Informações da O.S. nos dados adicionais" },
  { key: "observacoesPedido", label: "Observações do pedido" },
  { key: "dataDigitacao", label: "Data de digitação" },
] as const;

type OpcaoImpressao = (typeof OPCOES_IMPRESSAO)[number]["key"];

// Ações sobre uma NF-e já emitida — só na origem Fiscal (tela 15).
const ACOES_NFE = [
  { label: "Transmitir", icon: Send },
  { label: "Buscar protocolos", icon: FileSearch },
  { label: "Imprimir Danfe", icon: Printer },
  { label: "Download XML", icon: Download },
  { label: "Cancelar NF-e", icon: Ban },
] as const;

interface PopupNfeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Financeiro do cliente (tela 08) ou aba Fiscal (tela 15) */
  origem: "financeiro" | "fiscal";
}

// Popup "Emissão de NF-e" (telas 08 e 15). A emissão e a transmissão para a
// Sefaz são integração fiscal do backend, que a API ainda não expõe: o
// formulário fica pronto e as ações avisam que ainda não estão disponíveis.
export function PopupNfe({ open, onOpenChange, origem }: PopupNfeProps) {
  const toast = useToast();
  const [duplicar, setDuplicar] = useState(false);
  const [lojaDuplicacao, setLojaDuplicacao] = useState<"origem" | "logada">("origem");
  const [gerarMovimentoEstoque, setGerarMovimentoEstoque] = useState(false);
  const [transmitirSefaz, setTransmitirSefaz] = useState(true);
  const [impressao, setImpressao] = useState<Record<OpcaoImpressao, boolean>>({
    infoOs: false,
    observacoesPedido: false,
    dataDigitacao: false,
  });

  function avisarIndisponivel(acao: string) {
    toast.info(
      `${acao} ainda não disponível`,
      "A emissão de NF-e depende da integração fiscal do backend, que a API ainda não expõe."
    );
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Emissão de NF-e" size="xl">
      <div className="space-y-6">
        {origem === "fiscal" && (
          <div className="flex flex-wrap gap-2">
            {ACOES_NFE.map(({ label, icon: Icon }) => (
              <Button key={label} size="sm" variant="outline" onClick={() => avisarIndisponivel(label)}>
                <Icon className="size-3.5" />
                {label}
              </Button>
            ))}
          </div>
        )}

        <fieldset className="space-y-3">
          <legend className="sr-only">Duplicação</legend>
          <label className="flex items-center gap-2 text-sm font-medium">
            <Checkbox checked={duplicar} onCheckedChange={(c) => setDuplicar(c === true)} />
            Duplicar NF-e
          </label>
          <div className="space-y-3 pl-6">
            <RadioGroup
              name="nfe-loja-duplicacao"
              value={lojaDuplicacao}
              onValueChange={(v) => setLojaDuplicacao(v as typeof lojaDuplicacao)}
            >
              <RadioGroupItem
                id="nfe-loja-origem"
                value="origem"
                label="Na mesma loja de origem"
                disabled={!duplicar}
              />
              <RadioGroupItem
                id="nfe-loja-logada"
                value="logada"
                label="Na loja logada"
                disabled={!duplicar}
              />
            </RadioGroup>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={gerarMovimentoEstoque}
                onCheckedChange={(c) => setGerarMovimentoEstoque(c === true)}
                disabled={!duplicar}
              />
              Gerar movimento de estoque
            </label>
          </div>
        </fieldset>

        <label className="flex items-center gap-2 text-sm font-medium">
          <Checkbox checked={transmitirSefaz} onCheckedChange={(c) => setTransmitirSefaz(c === true)} />
          Transmitir a NF-e para a Sefaz
        </label>

        <fieldset className="space-y-2">
          <legend className="mb-2 text-sm font-medium">Impressão</legend>
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
        <Button onClick={() => avisarIndisponivel("Emissão de NF-e")}>Emitir NF-e</Button>
      </ModalFooter>
    </Modal>
  );
}
