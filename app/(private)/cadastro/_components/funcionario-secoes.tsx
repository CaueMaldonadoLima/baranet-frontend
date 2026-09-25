"use client";

import { useState } from "react";
import { Clock, Eye, EyeOff, List, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/shared/badge";
import { FormSection } from "@/components/shared/form-section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WEEK_DAYS = ["Todos", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

const TIME_FIELDS = [
  "Hora de entrada",
  "Hora de saída",
  "Almoço intervalo/início",
  "Almoço intervalo/término",
  "Intervalo início",
  "Intervalo término",
];

const DIA_LETRAS = ["S", "T", "Q", "Q", "S", "S", "D"];

function DiasTrabalho({
  selected,
  onToggle,
}: {
  selected: boolean[];
  onToggle: (index: number) => void;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">Dias de trabalho</p>
      <div className="flex gap-2">
        {DIA_LETRAS.map((letra, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onToggle(i)}
            className={cn(
              "flex size-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
              selected[i]
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input text-muted-foreground hover:bg-muted"
            )}
          >
            {letra}
          </button>
        ))}
      </div>
    </div>
  );
}

const FILA_OPCOES = [
  "Iniciado um atendimento, fica o nome do usuário vendedor fixo na venda iniciada, só podendo ser trocado mediante autorização",
  "Definir a fila de atendimento pelo primeiro a se logar",
  "Definir posição pelo horário cadastrado de entrada do usuário",
  "Usuário vendedor, se em atendimento e iniciado o seu horário de venda, logo que encerrar atendimento pega o primeiro horário de almoço disponível na fila",
  "Usa parâmetros de horário no dashboard fila de atendimento",
  "Se estiver em atendimento, passar o próximo da fila de atendimento que não estiver atendendo para horário de almoço",
  "Usuário vendedor: saída do intervalo retorna na mesma posição da fila",
  "Usuário vendedor: saída do intervalo retorna na última posição da fila",
  "Posição na fila definida pelo primeiro a se logar",
];

// Seções só de funcionário da tela Cadastro (protótipo "Usuários"): acesso,
// senha, horário, direitos de acesso, admissão, adicionais, benefícios, férias
// e 13º. Ainda não são gravadas na API.
export function FuncionarioSecoes() {
  const [senhaManual, setSenhaManual] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [trocarProximoAcesso, setTrocarProximoAcesso] = useState(false);
  const [funcTab, setFuncTab] = useState<"usuario" | "direitos">("usuario");
  const [horarioModo, setHorarioModo] = useState("controla");
  const [horarioDia, setHorarioDia] = useState("todos");
  const [usuarioVendedor, setUsuarioVendedor] = useState(false);
  const [filaOpcao, setFilaOpcao] = useState(FILA_OPCOES[0]);
  const [ipsLivre, setIpsLivre] = useState(true);
  const [usuarioFuncionario, setUsuarioFuncionario] = useState(false);
  const [insalubridade, setInsalubridade] = useState(false);
  const [insalubridadeNivel, setInsalubridadeNivel] = useState("baixa");
  const [periculosidade, setPericulosidade] = useState(false);

  const [valeTransporte, setValeTransporte] = useState(false);
  const [valeTransporteDias, setValeTransporteDias] = useState(Array(7).fill(true));
  const [valeAlimentacao, setValeAlimentacao] = useState(false);
  const [valeAlimentacaoDias, setValeAlimentacaoDias] = useState(Array(7).fill(true));
  const [cestaBasica, setCestaBasica] = useState(false);
  const [cestaBasicaDias, setCestaBasicaDias] = useState(Array(7).fill(true));
  const [planoSaude, setPlanoSaude] = useState(false);

  function toggleDia(setter: (fn: (prev: boolean[]) => boolean[]) => void, index: number) {
    setter((prev) => prev.map((v, i) => (i === index ? !v : v)));
  }

  return (
    <>
      <Card className="px-6">
      <FormSection
        title="Acesso"
        description="Identificação do usuário para login e fila de atendimento."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Apelido de usuário</label>
            <Input placeholder="Como o usuário aparece no sistema" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Acesso Whatsapp</label>
            <Input placeholder="(00) 00000-0000" />
          </div>
        </div>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <Checkbox />
          <span className="text-sm text-foreground">
            Usuário vendedor loga na fila de vendas
          </span>
        </label>
      </FormSection>
      </Card>

      <Card className="px-6">
      <FormSection title="Senha" description="Política de senha do usuário.">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <Checkbox
            checked={senhaManual}
            onCheckedChange={(checked) => setSenhaManual(checked === true)}
          />
          <span className="text-sm text-foreground">Definir senha manualmente</span>
        </label>

        {senhaManual && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Senha</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  className="pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Repetir senha</label>
              <Input type={showPassword ? "text" : "password"} placeholder="Repetir senha" />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 max-w-xs">
          <label className="text-sm font-medium whitespace-nowrap">
            Trocar a senha a cada
          </label>
          <Input type="number" min={0} placeholder="0" className="w-20" />
          <span className="text-sm text-muted-foreground whitespace-nowrap">dias</span>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <Checkbox
            checked={trocarProximoAcesso}
            onCheckedChange={(checked) => setTrocarProximoAcesso(checked === true)}
          />
          <span className="text-sm text-foreground">Trocar senha no próximo acesso</span>
        </label>
      </FormSection>
      </Card>

      <Card className="px-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFuncTab("usuario")}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
              funcTab === "usuario"
                ? "bg-login-button-bg text-white"
                : "border border-input text-foreground hover:bg-muted"
            )}
          >
            Usuário Funcionário
          </button>
          <button
            type="button"
            onClick={() => setFuncTab("direitos")}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
              funcTab === "direitos"
                ? "bg-login-button-bg text-white"
                : "border border-input text-foreground hover:bg-muted"
            )}
          >
            Direitos de Acesso
          </button>
        </div>

        {funcTab === "direitos" ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            Direitos de acesso ainda não configurados para esta tela.
          </p>
        ) : (
          <div className="space-y-8 pt-6">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Horário de trabalho</label>
                <RadioGroup
                  name="horarioModo"
                  value={horarioModo}
                  onValueChange={setHorarioModo}
                  className="flex-row gap-4"
                >
                  <RadioGroupItem value="livre" label="Livre" />
                  <RadioGroupItem value="controla" label="Controla horário" />
                </RadioGroup>
              </div>

              <RadioGroup
                name="horarioDia"
                value={horarioDia}
                onValueChange={setHorarioDia}
                className="contents"
              >
                <div className="overflow-x-auto rounded-lg border border-input">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-input bg-muted/50">
                        <th className="w-32" />
                        {TIME_FIELDS.map((field) => (
                          <th
                            key={field}
                            className="px-2 py-2 text-left text-xs font-medium text-muted-foreground"
                          >
                            {field}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {WEEK_DAYS.map((day) => (
                        <tr key={day} className="border-b border-input last:border-0">
                          <td className="px-2 py-1.5 whitespace-nowrap">
                            <RadioGroupItem value={day.toLowerCase()} label={day} />
                          </td>
                          {TIME_FIELDS.map((field) => (
                            <td key={field} className="px-2 py-1.5">
                              <div className="relative">
                                <Input
                                  placeholder={field}
                                  className="pr-7 text-xs h-8"
                                />
                                <Clock className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </RadioGroup>

              <div className="flex flex-wrap items-center gap-6 pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <Checkbox />
                  <span className="text-sm text-foreground">
                    Autoriza visualizar fora do horário de trabalho
                  </span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <Checkbox />
                  <span className="text-sm text-foreground">
                    Autoriza trabalhar fora do horário de trabalho
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-3 border-t border-border pt-6">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <Checkbox
                  checked={usuarioVendedor}
                  onCheckedChange={(checked) => setUsuarioVendedor(checked === true)}
                />
                <span className="text-sm text-foreground">
                  Usuário vendedor — usa parâmetros do horário para fila de vendas
                </span>
              </label>

              <p className="text-sm font-medium pt-2">
                Usuários vendedores — parâmetros da fila de atendimento
              </p>

              <div className="flex flex-wrap items-center gap-2 text-sm text-foreground">
                <span>Aceita</span>
                <Select defaultValue="0">
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>vendedores no mesmo horário de almoço/intervalo</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm text-foreground">
                <Select defaultValue="10">
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 15, 20, 30].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>
                  minutos antes de iniciar horário de intervalo passa para último na fila de
                  atendimento
                </span>
              </div>

              <RadioGroup
                name="filaOpcao"
                value={filaOpcao}
                onValueChange={setFilaOpcao}
                className="gap-2.5 pt-2"
              >
                {FILA_OPCOES.map((opcao) => (
                  <RadioGroupItem key={opcao} value={opcao} label={opcao} />
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-3 border-t border-border pt-6">
              <p className="text-sm font-medium">
                IPs de acesso cadastrado para este usuário
              </p>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <Checkbox
                  checked={ipsLivre}
                  onCheckedChange={(checked) => setIpsLivre(checked === true)}
                />
                <span className="text-sm text-foreground">Livre</span>
              </label>
              <Button size="sm" variant="outline">
                <Plus className="size-3.5" />
                Cadastrar IP
              </Button>
              <div className="space-y-1.5 pt-1">
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  <List className="size-3.5" />
                  IPs liberados para este usuário
                </p>
                <Badge variant="muted">Computador Loja</Badge>
              </div>
            </div>
          </div>
        )}
      </Card>

      <Card className="px-6">
        <FormSection
          title="Dados de admissão"
          description="Informações de admissão, cargo e salário do funcionário."
        >
          <label className="flex items-center gap-2.5 cursor-pointer">
            <Checkbox
              checked={usuarioFuncionario}
              onCheckedChange={(checked) => setUsuarioFuncionario(checked === true)}
            />
            <span className="text-sm text-foreground">Usuário funcionário</span>
          </label>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Data de admissão</label>
              <Input type="date" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">PIS/PASEP</label>
              <Input placeholder="PIS/PASEP" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">No. CTPS</label>
              <Input placeholder="Número da CTPS" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Série</label>
              <Input placeholder="Série" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">UF</label>
              <Input placeholder="UF" maxLength={2} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Data de saída</label>
              <Input type="date" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Cargo</label>
              <Input placeholder="Cargo" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Piso categoria</label>
              <Input placeholder="Piso categoria" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Salário de registro</label>
              <Input placeholder="R$ 0,00" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Repasse reajuste anual</label>
              <Input placeholder="R$ 0,00" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Salário reajustado ano base</label>
              <Input placeholder="R$ 0,00" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Novo valor</label>
              <Input placeholder="R$ 0,00" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Percentual</label>
              <Input placeholder="0%" />
            </div>
          </div>

          <div className="space-y-3 border-t border-border pt-6">
            <label className="text-sm font-medium">Gerar licença</label>
            <div className="flex flex-wrap items-end gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">De</label>
                <Input type="date" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">A</label>
                <Input type="date" />
              </div>
              <Button size="sm">
                <Plus className="size-3.5" />
                Incluir
              </Button>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Licenças geradas</label>
              <Textarea placeholder="Nenhuma licença gerada" readOnly className="min-h-24" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
            <Button variant="outline" size="sm">Alterar</Button>
            <Button size="sm">Gravar</Button>
          </div>
        </FormSection>
      </Card>

      <Card className="px-6">
        <FormSection
          title="Adicionais"
          description="Adicionais de remuneração aplicados ao salário do funcionário."
        >
          <label className="flex items-center gap-2.5 cursor-pointer">
            <Checkbox
              checked={insalubridade}
              onCheckedChange={(checked) => setInsalubridade(checked === true)}
            />
            <span className="text-sm font-medium text-foreground">
              Incluir adicional de insalubridade
            </span>
          </label>

          {insalubridade && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Base de cálculo sobre salário mínimo vigente
                </label>
                <Input placeholder="R$ 0,00" />
              </div>
              <div className="space-y-2">
                <RadioGroup
                  name="insalubridadeNivel"
                  value={insalubridadeNivel}
                  onValueChange={setInsalubridadeNivel}
                  className="gap-2"
                >
                  <RadioGroupItem value="baixa" label="Insalubridade baixa — 10%" />
                  <RadioGroupItem value="media" label="Insalubridade média — 20%" />
                  <RadioGroupItem value="alta" label="Insalubridade alta — 40%" />
                </RadioGroup>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Valor adicional</label>
                <Input placeholder="R$ 0,00" />
              </div>
            </div>
          )}

          <label className="flex items-center gap-2.5 cursor-pointer border-t border-border pt-6">
            <Checkbox
              checked={periculosidade}
              onCheckedChange={(checked) => setPericulosidade(checked === true)}
            />
            <span className="text-sm font-medium text-foreground">
              Incluir adicional de periculosidade
            </span>
          </label>

          {periculosidade && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Base de cálculo sobre salário bruto do beneficiado
                  <span className="ml-1 text-xs text-muted-foreground">(Alíquota 30%)</span>
                </label>
                <Input placeholder="R$ 0,00" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Descrição da periculosidade</label>
                <Textarea placeholder="Descrição" className="min-h-20" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Valor adicional</label>
                <Input placeholder="R$ 0,00" />
              </div>
            </div>
          )}
        </FormSection>
      </Card>

      <Card className="px-6">
        <FormSection
          title="Benefícios"
          description="Benefícios recorrentes pagos ao funcionário."
        >
          <div className="space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <Checkbox
                checked={valeTransporte}
                onCheckedChange={(checked) => setValeTransporte(checked === true)}
              />
              <span className="text-sm font-medium text-foreground">
                Pagamento vale transporte
              </span>
            </label>

            {valeTransporte && (
              <div className="grid gap-4 sm:grid-cols-3">
                <DiasTrabalho
                  selected={valeTransporteDias}
                  onToggle={(i) => toggleDia(setValeTransporteDias, i)}
                />
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Valor do vale de transporte</label>
                  <Input placeholder="R$ 0,00" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">
                    Funcionário necessita de passagem por dia
                  </label>
                  <Input placeholder="0" />
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer sm:col-span-3">
                  <Checkbox />
                  <span className="text-sm text-foreground">
                    Gera automaticamente como conta previsão no 1º dia útil de cada mês
                  </span>
                </label>
              </div>
            )}
          </div>

          <div className="space-y-3 border-t border-border pt-6">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <Checkbox
                checked={valeAlimentacao}
                onCheckedChange={(checked) => setValeAlimentacao(checked === true)}
              />
              <span className="text-sm font-medium text-foreground">
                Pagamento vale alimentação
              </span>
            </label>

            {valeAlimentacao && (
              <div className="grid gap-4 sm:grid-cols-3">
                <DiasTrabalho
                  selected={valeAlimentacaoDias}
                  onToggle={(i) => toggleDia(setValeAlimentacaoDias, i)}
                />
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Valor do vale de alimentação</label>
                  <Input placeholder="R$ 0,00" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">
                    Funcionário necessita de passagem por dia
                  </label>
                  <Input placeholder="0" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Fornecedor do vale alimentação</label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alelo">Alelo</SelectItem>
                      <SelectItem value="sodexo">Sodexo</SelectItem>
                      <SelectItem value="vr">VR Benefícios</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer sm:col-span-3">
                  <Checkbox />
                  <span className="text-sm text-foreground">
                    Gera automaticamente como conta previsão no 1º dia útil de cada mês
                  </span>
                </label>
              </div>
            )}
          </div>

          <div className="space-y-3 border-t border-border pt-6">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <Checkbox
                checked={cestaBasica}
                onCheckedChange={(checked) => setCestaBasica(checked === true)}
              />
              <span className="text-sm font-medium text-foreground">
                Pagamento de cesta básica e outros
              </span>
            </label>

            {cestaBasica && (
              <div className="grid gap-4 sm:grid-cols-3">
                <DiasTrabalho
                  selected={cestaBasicaDias}
                  onToggle={(i) => toggleDia(setCestaBasicaDias, i)}
                />
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Valor da cesta básica</label>
                  <Input placeholder="R$ 0,00" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">
                    Funcionário necessita de passagem por dia
                  </label>
                  <Input placeholder="0" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">
                    Aplicar desconto na folha de pagamentos
                  </label>
                  <Input placeholder="0%" />
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer sm:col-span-3">
                  <Checkbox />
                  <span className="text-sm text-foreground">
                    Gera automaticamente como conta previsão no 1º dia útil de cada mês
                  </span>
                </label>
              </div>
            )}
          </div>

          <div className="space-y-3 border-t border-border pt-6">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <Checkbox
                checked={planoSaude}
                onCheckedChange={(checked) => setPlanoSaude(checked === true)}
              />
              <span className="text-sm font-medium text-foreground">
                Pagamento plano de saúde
              </span>
            </label>

            {planoSaude && (
              <>
                <div className="flex flex-wrap items-end gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Fornecedor de plano de saúde</label>
                    <Select>
                      <SelectTrigger className="w-56">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unimed">Unimed</SelectItem>
                        <SelectItem value="amil">Amil</SelectItem>
                        <SelectItem value="bradesco">Bradesco Saúde</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Valor do benefício</label>
                    <Input placeholder="R$ 0,00" />
                  </div>
                  <Button size="icon" variant="outline" aria-label="Adicionar plano">
                    <Plus className="size-4" />
                  </Button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-input">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        {["Plano", "Usuário", "Valor"].map((col) => (
                          <th key={col} className="p-2">
                            <span className="inline-block rounded bg-login-button-bg px-2.5 py-1 text-xs font-semibold uppercase text-white">
                              {col}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i}>
                          <td className="p-2"><Input className="h-8" /></td>
                          <td className="p-2"><Input className="h-8" /></td>
                          <td className="p-2"><Input className="h-8" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <Checkbox />
                  <span className="text-sm text-foreground">Benefício da empresa</span>
                </label>
                <div className="flex items-center gap-2">
                  <Checkbox />
                  <span className="text-sm text-foreground">Aplicar desconto em folha de</span>
                  <Input placeholder="0" className="w-16 h-8" />
                  <span className="text-sm text-foreground">% do valor do plano</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox />
                  <span className="text-sm text-foreground">
                    Gera automaticamente como conta previsão na data do dia
                  </span>
                  <Input type="date" className="w-40 h-8" />
                </div>

                <div className="flex justify-end">
                  <Button size="sm">Gerar financeiro</Button>
                </div>
              </>
            )}
          </div>
        </FormSection>
      </Card>

      <Card className="px-6">
        <FormSection title="Férias" description="Controle de período aquisitivo e concessão de férias.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Período aquisitivo — de</label>
              <Input type="date" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Período aquisitivo — a</label>
              <Input type="date" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Dias de férias a ser gozada (sem direito ainda)
              </label>
              <Input placeholder="0" />
            </div>
            <Button size="sm">Conceder férias</Button>
          </div>

          <div className="space-y-4 border-t border-border pt-6">
            <p className="text-sm font-medium">
              Férias concedida: 30 dias / fracionada / 20 dias com compra de 10
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">De</label>
                <Input type="date" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">A</label>
                <Input type="date" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Valor das férias</label>
                <Input placeholder="R$ 0,00" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Adicional 1/3</label>
                <Input placeholder="R$ 0,00" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">IR alíquota</label>
                <Input placeholder="0%" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">IR valor</label>
                <Input placeholder="R$ 0,00" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">FGTS alíquota</label>
                <Input placeholder="0%" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">FGTS valor</label>
                <Input placeholder="R$ 0,00" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">INSS alíquota</label>
                <Input placeholder="0%" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">INSS valor</label>
                <Input placeholder="R$ 0,00" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-sm font-medium">Valor líquido de férias</label>
                <Input placeholder="R$ 0,00" />
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Dias concedidos</label>
                <Input placeholder="0" className="w-24" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Dias restantes</label>
                <Input placeholder="0" className="w-24" />
              </div>
              <Button size="sm">Gerar financeiro</Button>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <Checkbox />
              <span className="text-sm text-foreground">
                Gera automaticamente como conta previsão ao término de cada doze meses
              </span>
            </label>
          </div>
        </FormSection>
      </Card>

      <Card className="px-6">
        <FormSection title="13º Salário" description="Cálculo e pagamento do décimo terceiro salário.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Data de admissão</label>
              <Input type="date" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Ano corrente</label>
              <Input placeholder="2026" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Medida últimos 12 meses</label>
              <Input placeholder="0" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Dividido por 12x</label>
              <Input placeholder="0" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Valor líquido 1ª parcela</label>
              <Input placeholder="R$ 0,00" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">2ª parcela</label>
              <Input placeholder="R$ 0,00" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Alíq. INSS</label>
              <Input placeholder="0%" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Valor INSS</label>
              <Input placeholder="R$ 0,00" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Alíq. FGTS</label>
              <Input placeholder="0%" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Valor FGTS</label>
              <Input placeholder="R$ 0,00" />
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3 border-t border-border pt-6">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <Checkbox />
              <span className="text-sm text-foreground">
                Gera automaticamente como conta previsão na data do dia
              </span>
            </label>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">De</label>
              <Input type="date" className="w-40" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">A</label>
              <Input type="date" className="w-40" />
            </div>
            <Button size="sm">Gerar financeiro</Button>
          </div>
        </FormSection>
      </Card>
    </>
  );
}
