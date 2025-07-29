
// src/app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Fatores de Custo Padrão (como fallback)
const defaultCostFactors = {
  baseCostPerMeter: 1500,
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
    esquadrias: 500,
    pisoCeramico: 80,
    forro: 60,
  },
  costPerUnit: {
    banheiro: 3000,
  },
};

const costFactorsSchema = z.object({
    baseCostPerMeter: z.coerce.number().positive(),
    eap: z.object({
        fundacao: z.coerce.number(),
        estrutura: z.coerce.number(),
        alvenaria: z.coerce.number(),
        instalacoesHidraulicas: z.coerce.number(),
        instalacoesEletricas: z.coerce.number(),
        revestimentos: z.coerce.number(),
        esquadrias: z.coerce.number(),
        cobertura: z.coerce.number(),
        forro: z.coerce.number(),
        impermeabilizacao: z.coerce.number(),
        pintura: z.coerce.number(),
    }),
    qualityMultiplier: z.object({
        economico: z.coerce.number(),
        medio: z.coerce.number(),
        alto: z.coerce.number(),
    }),
     blockTypeMultiplier: z.object({
        alvenaria: z.coerce.number(),
        bloco_estrutural: z.coerce.number(),
        gesso_acartonado: z.coerce.number(),
    }),
    wallFinishMultiplier: z.object({
        pintura: z.coerce.number(),
        chapisco: z.coerce.number(),
        emboco: z.coerce.number(),
        reboco: z.coerce.number(),
    }),
    roofTypeMultiplier: z.object({
        ceramica: z.coerce.number(),
        metalica: z.coerce.number(),
        laje: z.coerce.number(),
    }),
    ceilingTypeMultiplier: z.object({
        pvc: z.coerce.number(),
        gesso: z.coerce.number(),
    }),
    foundationMultiplier: z.object({
        normal: z.coerce.number(),
        helice_continua: z.coerce.number(),
    }),
    costPerSqMeter: z.object({
        esquadrias: z.coerce.number(),
        pisoCeramico: z.coerce.number(),
        forro: z.coerce.number(),
    }),
    costPerUnit: z.object({
        banheiro: z.coerce.number(),
    }),
});

type CostFactors = z.infer<typeof costFactorsSchema>;

export default function AdminPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const form = useForm<CostFactors>({
    resolver: zodResolver(costFactorsSchema),
    defaultValues: defaultCostFactors,
  });

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    if (authStatus !== "true") {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      try {
        const savedFactors = localStorage.getItem("costFactors");
        if (savedFactors) {
          const parsedFactors = JSON.parse(savedFactors);
          form.reset(parsedFactors);
        }
      } catch (error) {
          console.error("Failed to load or parse cost factors from localStorage", error);
          toast({
              title: "Erro ao carregar configurações",
              description: "Usando configurações padrão.",
              variant: "destructive"
          })
      }
    }
    setIsLoading(false);
  }, [form, toast, router]);

  const onSubmit = (data: CostFactors) => {
    try {
        localStorage.setItem("costFactors", JSON.stringify(data));
        toast({
        title: "Configurações Salvas!",
        description: "Os fatores de custo foram atualizados com sucesso.",
        });
    } catch (error) {
        console.error("Failed to save cost factors to localStorage", error);
        toast({
            title: "Erro ao salvar",
            description: "Não foi possível salvar as configurações.",
            variant: "destructive"
        })
    }
  };
  
  if (isLoading || !isAuthenticated) {
      return (
          <div className="container mx-auto p-4 md:p-8 text-center">
              <p>Verificando autenticação...</p>
          </div>
      )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">Painel Administrativo</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Ajuste os fatores de custo e os multiplicadores usados na calculadora de orçamento.
        </p>
      </div>

      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Configurações de Custo</CardTitle>
          <CardDescription>
            Altere os valores abaixo e clique em salvar. Estes dados são salvos localmente no seu navegador.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-headline">Custos Base</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="baseCostPerMeter">Custo Base por m² (BRL)</Label>
                  <Input id="baseCostPerMeter" type="number" {...form.register("baseCostPerMeter")} />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="costPerUnit.banheiro">Custo por Banheiro (BRL)</Label>
                  <Input id="costPerUnit.banheiro" type="number" {...form.register("costPerUnit.banheiro")} />
                </div>
              </div>
            </div>

            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-headline">Estrutura de Análise de Projeto (EAP %)</h3>
              <p className="text-sm text-muted-foreground">
                Percentual de custo de cada etapa sobre o custo total base. A soma não precisa ser 100%.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.keys(defaultCostFactors.eap).map((key) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={`eap.${key}`} className="capitalize">{key.replace(/_/g, ' ')}</Label>
                    <Input id={`eap.${key}`} type="number" step="0.01" {...form.register(`eap.${key as keyof CostFactors['eap']}`)} />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-headline">Multiplicadores de Qualidade</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.keys(defaultCostFactors.qualityMultiplier).map((key) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={`qualityMultiplier.${key}`} className="capitalize">{key}</Label>
                    <Input id={`qualityMultiplier.${key}`} type="number" step="0.01" {...form.register(`qualityMultiplier.${key as keyof CostFactors['qualityMultiplier']}`)} />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
                <h3 className="text-lg font-semibold font-headline">Outros Multiplicadores e Custos</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6">
                    {/* Bloco */}
                    <div className="space-y-2">
                        <Label className="font-medium">Tipo de Bloco</Label>
                        {Object.keys(defaultCostFactors.blockTypeMultiplier).map((key) => (
                            <div key={key} className="flex items-center gap-2">
                                <Label htmlFor={`blockTypeMultiplier.${key}`} className="capitalize text-sm w-32">{key.replace(/_/g, ' ')}</Label>
                                <Input id={`blockTypeMultiplier.${key}`} type="number" step="0.01" {...form.register(`blockTypeMultiplier.${key as keyof CostFactors['blockTypeMultiplier']}`)} />
                            </div>
                        ))}
                    </div>
                     {/* Paredes */}
                    <div className="space-y-2">
                        <Label className="font-medium">Acabamento de Parede</Label>
                        {Object.keys(defaultCostFactors.wallFinishMultiplier).map((key) => (
                            <div key={key} className="flex items-center gap-2">
                                <Label htmlFor={`wallFinishMultiplier.${key}`} className="capitalize text-sm w-32">{key.replace(/_/g, ' ')}</Label>
                                <Input id={`wallFinishMultiplier.${key}`} type="number" step="0.01" {...form.register(`wallFinishMultiplier.${key as keyof CostFactors['wallFinishMultiplier']}`)} />
                            </div>
                        ))}
                    </div>
                     {/* Cobertura */}
                    <div className="space-y-2">
                        <Label className="font-medium">Tipo de Cobertura</Label>
                        {Object.keys(defaultCostFactors.roofTypeMultiplier).map((key) => (
                            <div key={key} className="flex items-center gap-2">
                                <Label htmlFor={`roofTypeMultiplier.${key}`} className="capitalize text-sm w-32">{key.replace(/_/g, ' ')}</Label>
                                <Input id={`roofTypeMultiplier.${key}`} type="number" step="0.01" {...form.register(`roofTypeMultiplier.${key as keyof CostFactors['roofTypeMultiplier']}`)} />
                            </div>
                        ))}
                    </div>
                      {/* Forro */}
                    <div className="space-y-2">
                        <Label className="font-medium">Tipo de Forro</Label>
                        {Object.keys(defaultCostFactors.ceilingTypeMultiplier).map((key) => (
                             <div key={key} className="flex items-center gap-2">
                                <Label htmlFor={`ceilingTypeMultiplier.${key}`} className="capitalize text-sm w-32">{key}</Label>
                                <Input id={`ceilingTypeMultiplier.${key}`} type="number" step="0.01" {...form.register(`ceilingTypeMultiplier.${key as keyof CostFactors['ceilingTypeMultiplier']}`)} />
                            </div>
                        ))}
                    </div>
                     {/* Fundação */}
                    <div className="space-y-2">
                        <Label className="font-medium">Fundação</Label>
                        {Object.keys(defaultCostFactors.foundationMultiplier).map((key) => (
                             <div key={key} className="flex items-center gap-2">
                                <Label htmlFor={`foundationMultiplier.${key}`} className="capitalize text-sm w-32">{key.replace(/_/g, ' ')}</Label>
                                <Input id={`foundationMultiplier.${key}`} type="number" step="0.01" {...form.register(`foundationMultiplier.${key as keyof CostFactors['foundationMultiplier']}`)} />
                            </div>
                        ))}
                    </div>
                     {/* Custo por m2 */}
                     <div className="space-y-2">
                        <Label className="font-medium">Custo por m²</Label>
                        {Object.keys(defaultCostFactors.costPerSqMeter).map((key) => (
                             <div key={key} className="flex items-center gap-2">
                                <Label htmlFor={`costPerSqMeter.${key}`} className="capitalize text-sm w-32">{key.replace(/([A-Z])/g, ' $1')}</Label>
                                <Input id={`costPerSqMeter.${key}`} type="number" step="1" {...form.register(`costPerSqMeter.${key as keyof CostFactors['costPerSqMeter']}`)} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Button type="submit" size="lg" className="w-full md:w-auto bg-accent hover:bg-accent/90">
              <Save className="mr-2" />
              Salvar Configurações
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
