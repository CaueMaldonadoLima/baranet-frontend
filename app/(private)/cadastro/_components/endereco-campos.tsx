"use client";

import { FormSection } from "@/components/shared/form-section";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EnderecoForm } from "../_lib/comum";
import { Campo } from "./campo";

const CAMPOS_TEXTO = [
  { key: "bairro", label: "Bairro", placeholder: "Bairro" },
  { key: "pais", label: "País", placeholder: "Brasil" },
  { key: "cidade", label: "Cidade", placeholder: "Cidade" },
  { key: "logradouro", label: "Logradouro", placeholder: "Rua, avenida..." },
  { key: "numero", label: "Número", placeholder: "Número" },
  { key: "complemento", label: "Complemento", placeholder: "Complemento" },
] as const;

export function EnderecoCampos({
  endereco,
  onChange,
  descricao,
}: {
  endereco: EnderecoForm;
  onChange: (endereco: EnderecoForm) => void;
  descricao: string;
}) {
  function set<K extends keyof EnderecoForm>(key: K, value: EnderecoForm[K]) {
    onChange({ ...endereco, [key]: value });
  }

  return (
    <Card className="px-6">
      <FormSection title="Endereço" description={descricao}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <Campo id="endereco-cep" label="CEP">
            <Input
              id="endereco-cep"
              placeholder="00000-000"
              maxLength={9}
              value={endereco.cep}
              onChange={(e) => set("cep", e.target.value)}
            />
          </Campo>
          <Campo id="endereco-uf" label="UF">
            <Input
              id="endereco-uf"
              placeholder="SP"
              maxLength={2}
              value={endereco.uf}
              onChange={(e) => set("uf", e.target.value)}
            />
          </Campo>
          <Campo id="endereco-tipo" label="Tipo">
            <Select value={endereco.tipo} onValueChange={(v) => set("tipo", v)}>
              <SelectTrigger id="endereco-tipo" className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comercial">Comercial</SelectItem>
                <SelectItem value="cobranca">Cobrança</SelectItem>
                <SelectItem value="entrega">Entrega</SelectItem>
              </SelectContent>
            </Select>
          </Campo>
          {CAMPOS_TEXTO.map((c) => (
            <Campo key={c.key} id={`endereco-${c.key}`} label={c.label}>
              <Input
                id={`endereco-${c.key}`}
                placeholder={c.placeholder}
                value={endereco[c.key]}
                onChange={(e) => set(c.key, e.target.value)}
              />
            </Campo>
          ))}
        </div>
      </FormSection>
    </Card>
  );
}
