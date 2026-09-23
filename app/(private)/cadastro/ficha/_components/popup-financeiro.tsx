"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Modal, ModalFooter } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { TabelaRegistros } from "./tabela-registros";

const COLUNAS = [
  { key: "responsavel", label: "Responsável" },
  { key: "loja", label: "Loja" },
  { key: "uf", label: "UF" },
  { key: "outro", label: "Outro" },
  { key: "data", label: "Data" },
  { key: "parcela", label: "Parcela" },
  { key: "valor", label: "Valor" },
] as const;

interface PopupFinanceiroProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nome: string;
}

// Popup da aba financeira (tela 04): registros de parcelas/valores do cadastro.
// Montar só quando aberto: a tabela lê as colunas salvas do localStorage.
export function PopupFinanceiro({ open, onOpenChange, nome }: PopupFinanceiroProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Registros financeiros"
      description={nome}
      size="5xl"
    >
      <TabelaRegistros
        id="popup-financeiro"
        colunas={COLUNAS}
        comAno
        descricaoVazia="A API ainda não expõe o financeiro (parcelas e valores) por cadastro."
      />
      <ModalFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Fechar
        </Button>
      </ModalFooter>
    </Modal>
  );
}

// Aba FINANCEIRO da ficha: ponto de entrada do popup da tela 04.
export function AbaFinanceiro({ nome }: { nome: string }) {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <EmptyState
        icon={Wallet}
        title="Financeiro do cadastro"
        description="Parcelas e valores deste cadastro."
        action={{ label: "Ver registros", onClick: () => setAberto(true) }}
      />
      {aberto && <PopupFinanceiro open onOpenChange={setAberto} nome={nome} />}
    </>
  );
}
