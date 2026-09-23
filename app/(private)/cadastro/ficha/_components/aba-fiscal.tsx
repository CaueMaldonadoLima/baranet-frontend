"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PopupNfe } from "./popup-nfe";
import { TabelaRegistros } from "./tabela-registros";

const COLUNAS_FISCAL = [
  { key: "loja", label: "Loja" },
  { key: "os", label: "OS" },
  { key: "nome", label: "Nome" },
  { key: "emissao", label: "Emissão" },
  { key: "situacao", label: "Situação" },
  { key: "data", label: "Data" },
  { key: "tipo", label: "Tipo" },
  { key: "numero", label: "Número" },
  { key: "formaPagamento", label: "Forma de pagamento" },
  { key: "vendedor", label: "Vendedor" },
  { key: "duplicata", label: "Duplicata" },
] as const;

// Aba Fiscal (tela 14), compartilhada entre Cliente e Fornecedor, com o popup
// de Emissão de NF-e (tela 15).
export function AbaFiscal({ nome }: { nome: string }) {
  const [nfeAberto, setNfeAberto] = useState(false);

  return (
    <>
      <TabelaRegistros
        id="fiscal"
        colunas={COLUNAS_FISCAL}
        comAno
        tituloVazio={({ ano }) => `Nenhuma nota fiscal em ${ano}`}
        descricaoVazia={`A API ainda não expõe as notas fiscais de ${nome}.`}
        rodape={() => (
          <Button size="sm" onClick={() => setNfeAberto(true)}>
            <FileText className="size-3.5" />
            Emissão de NF-e
          </Button>
        )}
      />
      {nfeAberto && <PopupNfe open onOpenChange={setNfeAberto} origem="fiscal" />}
    </>
  );
}
