
"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { BarChart, PiggyBank, Calculator, Download, LockKeyhole } from "lucide-react";
import { PaymentDialog } from "@/components/payment-dialog";

// Esquema de validação com Zod
const formSchema = z.object({
  areaTotal: z.coerce.number().min(0, "Área total é obrigatória"),
  tipoBloco: z.enum(["alvenaria", "bloco_estrutural", "gesso_acartonado"]),
  padraoAcabamento: z.enum(["economico", "medio", "alto"]),
  acabamentoParedes: z.enum(["pintura", "chapisco", "emboco", "reboco"]),
  areaEsquadrias: z.coerce.number().min(0),
  qtdBanheiros: z.coerce.number().int().min(0),
  areaPisoCeramico: z.coerce.number().min(0),
  metragemForro: z.coerce.number().min(0),
  tipoForro: z.enum(["pvc", "gesso"]),
  tipoCobertura: z.enum(["ceramica", "metalica", "laje"]),
  areaCobertura: z.coerce.number().min(0),
  fundacaoHeliceContinua: z.boolean(),
  percentualDesperdicio: z.coerce.number().min(0).max(100),
});

type FormData = z.infer<typeof formSchema>;

// Fatores de Custo Padrão (Fallback)
const defaultCostFactors = {
  baseCostPerMeter: 1500, // Custo base por m² em BRL
  eap: {
    fundacao: 0.10,
    estrutura: 0.15,
    alvenaria: 0.08,
    instalacoesHidraulicas: 0.07,
    instalacoesEletricas: 0.07,
    revestimentos: 0.12,
    esquadrias: 0.08,
    cobertura: 0.10,
    forro: 0.03,
    impermeabilizacao: 0.03,
    pintura: 0.05,
  },
  qualityMultiplier: {
    economico: 1,
    medio: 1.2,
    alto: 1.4,
  },
  blockTypeMultiplier: {
    alvenaria: 1,
    bloco_estrutural: 1.1,
    gesso_acartonado: 0.85,
  },
  wallFinishMultiplier: {
    pintura: 1,
    chapisco: 1.1,
    emboco: 1.15,
    reboco: 1.2,
  },
  roofTypeMultiplier: {
    ceramica: 1,
    metalica: 0.9,
    laje: 1.3,
  },
  ceilingTypeMultiplier: {
    pvc: 1,
    gesso: 1.25,
  },
  foundationMultiplier: {
    normal: 1,
    helice_continua: 1.3,
  },
  costPerSqMeter: {
    esquadrias: 500, // R$500/m²
    pisoCeramico: 80, // R$80/m²
    forro: 60,       // R$60/m²
  },
  costPerUnit: {
    banheiro: 3000, // R$3000 por banheiro
  },
};

export default function OrcamentoPage() {
  const [budget, setBudget] = useState<Record<string, number> | null>(null);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [costFactors, setCostFactors] = useState(defaultCostFactors);
  const [isPaid, setIsPaid] = useState(false);
  const [isPaymentDialogOpen, setPaymentDialogOpen] = useState(false);


  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      areaTotal: 0,
      tipoBloco: "alvenaria",
      padraoAcabamento: "medio",
      acabamentoParedes: "pintura",
      areaEsquadrias: 0,
      qtdBanheiros: 0,
      areaPisoCeramico: 0,
      metragemForro: 0,
      tipoForro: "pvc",
      tipoCobertura: "ceramica",
      areaCobertura: 0,
      fundacaoHeliceContinua: false,
      percentualDesperdicio: 0,
    },
  });

  const calculateBudget = (data: FormData) => {
    const factors = costFactors;
    const costs = { ...factors.eap };

    const areaTotal = data.areaTotal;

    if (!areaTotal || areaTotal <= 0) {
        setBudget(null);
        setTotalCost(0);
        return;
    }

    costs.alvenaria *= factors.blockTypeMultiplier[data.tipoBloco];
    const qualityMultiplier = factors.qualityMultiplier[data.padraoAcabamento];
    costs.revestimentos *= qualityMultiplier;
    costs.esquadrias *= qualityMultiplier;
    costs.pintura *= qualityMultiplier;

    const wallFinishMultiplier = factors.wallFinishMultiplier[data.acabamentoParedes];
    costs.revestimentos *= wallFinishMultiplier;
    costs.pintura *= wallFinishMultiplier;
    
    const extraCostBanheiros = data.qtdBanheiros * factors.costPerUnit.banheiro;
    const baseTotalCostForPercentage = factors.baseCostPerMeter * areaTotal;
    costs.instalacoesHidraulicas += extraCostBanheiros / baseTotalCostForPercentage;
    costs.instalacoesEletricas += extraCostBanheiros / baseTotalCostForPercentage;
    
    const forroCost = data.metragemForro * factors.costPerSqMeter.forro * factors.ceilingTypeMultiplier[data.tipoForro];
    costs.forro = forroCost / baseTotalCostForPercentage;

    const roofMultiplier = factors.roofTypeMultiplier[data.tipoCobertura];
    costs.cobertura *= roofMultiplier;
    if (data.tipoCobertura === 'laje') {
        costs.impermeabilizacao *= 1.2;
    }

    costs.fundacao *= data.fundacaoHeliceContinua ? factors.foundationMultiplier.helice_continua : factors.foundationMultiplier.normal;
    
    let calculatedCosts: Record<string, number> = {};
    let subtotal = 0;

    Object.keys(factors.eap).forEach(key => {
        const stageCost = costs[key as keyof typeof costs] * factors.baseCostPerMeter * areaTotal;
        calculatedCosts[key] = stageCost;
        subtotal += stageCost;
    });

    calculatedCosts.esquadrias += data.areaEsquadrias * factors.costPerSqMeter.esquadrias;
    calculatedCosts.revestimentos += data.areaPisoCeramico * factors.costPerSqMeter.pisoCeramico * qualityMultiplier;

    if (data.areaCobertura > 0) {
        calculatedCosts.cobertura = (calculatedCosts.cobertura / areaTotal) * data.areaCobertura;
        calculatedCosts.impermeabilizacao = (calculatedCosts.impermeabilizacao / areaTotal) * data.areaCobertura;
    }
    
    subtotal = Object.values(calculatedCosts).reduce((acc, cost) => acc + cost, 0);

    const desperdicioCost = subtotal * (data.percentualDesperdicio / 100);
    calculatedCosts['desperdicio'] = desperdicioCost;
    let totalWithWaste = subtotal + desperdicioCost;

    const finalCost = totalWithWaste;

    const orderedBudget: Record<string, number> = {};
    const eapOrder = [
        'fundacao', 'estrutura', 'alvenaria', 'instalacoesHidraulicas', 'instalacoesEletricas',
        'revestimentos', 'esquadrias', 'cobertura', 'forro', 'impermeabilizacao', 'pintura',
        'desperdicio'
    ];

    eapOrder.forEach(key => {
        if (calculatedCosts[key] !== undefined) {
            orderedBudget[key] = calculatedCosts[key];
        }
    });

    setBudget(orderedBudget);
    setTotalCost(finalCost);
  };
  
  useEffect(() => {
    try {
      const savedFactors = localStorage.getItem("costFactors");
      if (savedFactors) {
        setCostFactors(JSON.parse(savedFactors));
      }
    } catch (error) {
      console.error("Could not load cost factors from localStorage, using defaults.", error);
    }
  }, []);

  useEffect(() => {
    // Recalcula o orçamento sempre que qualquer valor do formulário mudar
    const subscription = form.watch((values) => {
        calculateBudget(values as FormData);
        // Reseta o status de pagamento se os valores que afetam o custo mudarem
        setIsPaid(false); 
    });
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, costFactors]);
  
  const handlePaymentSuccess = () => {
    setIsPaid(true);
    setPaymentDialogOpen(false);
  };

  return (
    <>
    <PaymentDialog 
        isOpen={isPaymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        onPaymentSuccess={handlePaymentSuccess}
    />
    <div className="container mx-auto p-4 py-8 md:p-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">Calculadora de Custo de Obra</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Preencha os campos abaixo para obter uma estimativa detalhada e realista do custo da sua construção.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Formulário de Inputs */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle>Parâmetros da Construção</CardTitle>
            <CardDescription>Ajuste os detalhes para refinar o orçamento.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              {/* Campos do formulário */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="areaTotal">Área Total da Construção (m²)</Label>
                    <Input id="areaTotal" type="number" {...form.register("areaTotal")} placeholder="Ex: 100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="areaCobertura">Área de Cobertura (m²)</Label>
                    <Input id="areaCobertura" type="number" {...form.register("areaCobertura")} placeholder="Ex: 120"/>
                  </div>
              </div>

               <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                 <div className="space-y-2">
                    <Label>Padrão de Acabamento</Label>
                    <Controller
                        name="padraoAcabamento"
                        control={form.control}
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                            <SelectItem value="economico">Econômico</SelectItem>
                            <SelectItem value="medio">Médio</SelectItem>
                            <SelectItem value="alto">Alto</SelectItem>
                            </SelectContent>
                        </Select>
                        )}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Tipo de Bloco</Label>
                     <Controller
                        name="tipoBloco"
                        control={form.control}
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                            <SelectItem value="alvenaria">Alvenaria Comum</SelectItem>
                            <SelectItem value="bloco_estrutural">Bloco Estrutural</SelectItem>
                            <SelectItem value="gesso_acartonado">Gesso Acartonado</SelectItem>
                            </SelectContent>
                        </Select>
                        )}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Acabamento das Paredes</Label>
                     <Controller
                        name="acabamentoParedes"
                        control={form.control}
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                            <SelectItem value="pintura">Apenas Pintura</SelectItem>
                            <SelectItem value="chapisco">Chapisco + Pintura</SelectItem>
                            <SelectItem value="emboco">Emboço + Pintura</SelectItem>
                            <SelectItem value="reboco">Reboco + Pintura</SelectItem>
                            </SelectContent>
                        </Select>
                        )}
                    />
                </div>
              </div>
              
              <Separator />

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="areaEsquadrias">Área de Esquadrias (m²)</Label>
                    <Input id="areaEsquadrias" type="number" {...form.register("areaEsquadrias")} placeholder="Ex: 20"/>
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="areaPisoCeramico">Área de Piso Cerâmico (m²)</Label>
                    <Input id="areaPisoCeramico" type="number" {...form.register("areaPisoCeramico")} placeholder="Ex: 80" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qtdBanheiros">Quantidade de Banheiros</Label>
                    <Input id="qtdBanheiros" type="number" {...form.register("qtdBanheiros")} placeholder="Ex: 2"/>
                  </div>
              </div>

               <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="metragemForro">Metragem de Forro (m²)</Label>
                    <Input id="metragemForro" type="number" {...form.register("metragemForro")} placeholder="Ex: 100" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de Forro</Label>
                     <Controller
                        name="tipoForro"
                        control={form.control}
                        render={({ field }) => (
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex items-center space-x-4 pt-2">
                                <div className="flex items-center space-x-2"><RadioGroupItem value="pvc" id="pvc" /><Label htmlFor="pvc">PVC</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="gesso" id="gesso" /><Label htmlFor="gesso">Gesso</Label></div>
                            </RadioGroup>
                        )}
                    />
                  </div>
              </div>
               
               <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Tipo de Cobertura</Label>
                     <Controller
                        name="tipoCobertura"
                        control={form.control}
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                            <SelectItem value="ceramica">Telha Cerâmica</SelectItem>
                            <SelectItem value="metalica">Telha Metálica</SelectItem>
                            <SelectItem value="laje">Laje</SelectItem>
                            </SelectContent>
                        </Select>
                        )}
                    />
                </div>
                <div className="space-y-2 flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                        <Label>Fundação Hélice Contínua?</Label>
                        <p className="text-xs text-muted-foreground">Ative se for usar este tipo de fundação.</p>
                    </div>
                     <Controller
                        name="fundacaoHeliceContinua"
                        control={form.control}
                        render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                    />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="percentualDesperdicio">Percentual de Desperdício (%)</Label>
                    <Input id="percentualDesperdicio" type="number" {...form.register("percentualDesperdicio")} placeholder="Ex: 5" />
                  </div>
              </div>

            </form>
          </CardContent>
        </Card>

        {/* Painel de Resultados */}
        <div className="space-y-6 lg:sticky top-24">
            <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Custo Total Estimado</CardTitle>
                    <PiggyBank className="w-8 h-8 text-accent" />
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold text-accent">
                    {totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Valor aproximado da obra.</p>
                </CardContent>
            </Card>
            <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Detalhamento do Custo (EAP)</CardTitle>
                    <BarChart className="w-8 h-8 text-primary" />
                </CardHeader>
                <CardContent>
                    {!budget || totalCost === 0 ? (
                        <p className="text-muted-foreground text-center">Preencha os dados ao lado para ver a estimativa.</p>
                    ) : isPaid ? (
                        <div className="space-y-2 text-sm">
                            {budget &&
                                Object.entries(budget).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                    <span className="capitalize text-muted-foreground">{key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}</span>
                                    <span className="font-medium">
                                    {value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </span>
                                </div>
                                ))}
                        </div>
                    ) : (
                        <div className="text-center p-6 bg-secondary/50 rounded-md">
                            <LockKeyhole className="mx-auto w-12 h-12 text-primary/70 mb-4" />
                            <h3 className="font-semibold text-lg mb-2">Desbloqueie seu Orçamento</h3>
                            <p className="text-muted-foreground mb-4 text-sm">
                                Efetue o pagamento de uma pequena taxa para ter acesso ao detalhamento completo do seu orçamento.
                            </p>
                            <Button onClick={() => setPaymentDialogOpen(true)}>
                                <Download className="mr-2 h-4 w-4"/>
                                Pagar e ver detalhamento
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

      </div>
    </div>
    </>
  );
}

    