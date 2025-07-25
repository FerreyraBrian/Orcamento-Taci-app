"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  Ruler,
  Gem,
  Layers,
  FileDown,
  Calculator,
  PaintBucket,
  Square,
  DoorOpen,
  Bath,
  Home,
  Wind,
  Droplet,
  Percent,
} from "lucide-react";
import type { EapItem, BudgetInputs, CostFactors } from "@/types";
import { calculateBudget, defaultCostFactors } from "@/lib/budget";

const formSchema = z.object({
  area: z.coerce.number().min(10, "Área deve ser al menos 10 m²"),
  wallType: z.enum(['masonry', 'structural', 'drywall']),
  finishQuality: z.enum(['economy', 'medium', 'high']),
  wallFinish: z.enum(['paint', 'cladding', 'plaster', 'skim-coat']),
  frameArea: z.coerce.number().min(0),
  bathrooms: z.coerce.number().min(0),
  floorArea: z.coerce.number().min(0),
  ceilingArea: z.coerce.number().min(0),
  ceilingType: z.enum(['pvc', 'gypsum']),
  roofType: z.enum(['ceramic', 'metal', 'slab']),
  roofArea: z.coerce.number().min(0),
  foundationType: z.enum(['standard', 'continuous-helix']),
  wastePercentage: z.coerce.number().min(0).max(100),
});

export default function BudgetBuilderPage() {
  const [eap, setEap] = useState<EapItem[]>([]);
  const [total, setTotal] = useState(0);
  const [costFactors, setCostFactors] = useState<CostFactors>(defaultCostFactors);

  useEffect(() => {
    try {
      // For this app, we are not using localStorage for cost factors anymore.
      // We will rely on the defaultCostFactors from the budget library.
      // This can be changed later to fetch from a backend or admin page.
      setCostFactors(defaultCostFactors);
    } catch (error) {
      console.error("Failed to set default cost factors", error);
    }
  }, []);

  const form = useForm<BudgetInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      area: 100,
      wallType: 'masonry',
      finishQuality: 'medium',
      wallFinish: 'paint',
      frameArea: 15,
      bathrooms: 2,
      floorArea: 100,
      ceilingArea: 100,
      ceilingType: 'pvc',
      roofType: 'ceramic',
      roofArea: 110,
      foundationType: 'standard',
      wastePercentage: 5,
    },
  });

  const { watch, control, formState: { errors } } = form;

  useEffect(() => {
    const subscription = watch((values) => {
      const parsed = formSchema.safeParse(values);
      if (parsed.success) {
        const { eap: newEap, total: newTotal } = calculateBudget(
          parsed.data,
          costFactors
        );
        setEap(newEap);
        setTotal(newTotal);
      } else {
        setEap([]);
        setTotal(0);
      }
    });

    // Initial calculation
    const parsed = formSchema.safeParse(form.getValues());
    if (parsed.success) {
        const { eap: newEap, total: newTotal } = calculateBudget(
          parsed.data,
          costFactors
        );
        setEap(newEap);
        setTotal(newTotal);
    }

    return () => subscription.unsubscribe();
  }, [watch, costFactors, form]);

  const totalBudget = useMemo(
    () => eap.reduce((sum, item) => sum + item.totalPrice, 0),
    [eap]
  );
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleExport = () => {
    const headers = ["Item", "Unit", "Quantity", "Unit Price", "Total Price"];
    const rows = eap.map((item) => [
      item.name,
      item.unit,
      item.quantity,
      formatCurrency(item.unitPrice),
      formatCurrency(item.totalPrice),
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(e => e.join(",")).join("\n");
    
    csvContent += `\n\nTotal,,,"${formatCurrency(totalBudget)}"`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "budget_estimate.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <Calculator className="w-6 h-6 text-primary" />
                Detalhes do Projeto
              </CardTitle>
              <CardDescription>
                Ingrese las especificaciones de su proyecto para una estimación del presupuesto en tiempo real.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                {/* Area */}
                <div className="space-y-2">
                  <Label htmlFor="area" className="flex items-center gap-2"><Ruler className="w-4 h-4" /> Área Total (m²)</Label>
                  <Controller name="area" control={control} render={({ field }) => <Input id="area" type="number" {...field} />} />
                  {errors.area && <p className="text-destructive text-sm">{errors.area.message}</p>}
                </div>

                {/* Wall Type */}
                <div className="space-y-2">
                  <Label htmlFor="wallType" className="flex items-center gap-2"><Layers className="w-4 h-4" /> Tipo de Bloque</Label>
                  <Controller name="wallType" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="wallType"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masonry">Alvenaria Comum</SelectItem>
                        <SelectItem value="structural">Bloque Estructural</SelectItem>
                        <SelectItem value="drywall">Gesso Acartonado</SelectItem>
                      </SelectContent>
                    </Select>
                  )} />
                </div>
                
                {/* Finish Quality */}
                <div className="space-y-2">
                  <Label htmlFor="finishQuality" className="flex items-center gap-2"><Gem className="w-4 h-4" /> Calidad de Acabado</Label>
                  <Controller name="finishQuality" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="finishQuality"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="economy">Econômico</SelectItem>
                        <SelectItem value="medium">Médio</SelectItem>
                        <SelectItem value="high">Alto</SelectItem>
                      </SelectContent>
                    </Select>
                  )} />
                </div>

                {/* Wall Finish */}
                <div className="space-y-2">
                  <Label htmlFor="wallFinish" className="flex items-center gap-2"><PaintBucket className="w-4 h-4" /> Acabado de Paredes</Label>
                  <Controller name="wallFinish" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="wallFinish"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paint">Pintura</SelectItem>
                        <SelectItem value="cladding">Chapisco</SelectItem>
                        <SelectItem value="plaster">Embozo</SelectItem>
                        <SelectItem value="skim-coat">Reboco</SelectItem>
                      </SelectContent>
                    </Select>
                  )} />
                </div>

                {/* Frame Area */}
                <div className="space-y-2">
                  <Label htmlFor="frameArea" className="flex items-center gap-2"><DoorOpen className="w-4 h-4" /> Área de Esquadrias (m²)</Label>
                  <Controller name="frameArea" control={control} render={({ field }) => <Input id="frameArea" type="number" {...field} />} />
                </div>

                {/* Bathrooms */}
                <div className="space-y-2">
                  <Label htmlFor="bathrooms" className="flex items-center gap-2"><Bath className="w-4 h-4" /> Quantidade de Banheiros</Label>
                  <Controller name="bathrooms" control={control} render={({ field }) => <Input id="bathrooms" type="number" {...field} />} />
                </div>

                {/* Floor Area */}
                 <div className="space-y-2">
                  <Label htmlFor="floorArea" className="flex items-center gap-2"><Square className="w-4 h-4" /> Metragem de Piso (m²)</Label>
                  <Controller name="floorArea" control={control} render={({ field }) => <Input id="floorArea" type="number" {...field} />} />
                </div>
                
                {/* Ceiling */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ceilingArea" className="flex items-center gap-2"><Home className="w-4 h-4" /> Área de Forro (m²)</Label>
                    <Controller name="ceilingArea" control={control} render={({ field }) => <Input id="ceilingArea" type="number" {...field} />} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ceilingType" className="flex items-center gap-2"><Wind className="w-4 h-4" /> Tipo de Forro</Label>
                    <Controller name="ceilingType" control={control} render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id="ceilingType"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pvc">PVC</SelectItem>
                          <SelectItem value="gypsum">Gesso</SelectItem>
                        </SelectContent>
                      </Select>
                    )} />
                  </div>
                </div>

                 {/* Roofing */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="roofArea" className="flex items-center gap-2"><Home className="w-4 h-4" /> Área de Cobertura (m²)</Label>
                        <Controller name="roofArea" control={control} render={({ field }) => <Input id="roofArea" type="number" {...field} />} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="roofType" className="flex items-center gap-2"><Building2 className="w-4 h-4" /> Tipo de Cobertura</Label>
                         <Controller name="roofType" control={control} render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger id="roofType"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ceramic">Cerâmica</SelectItem>
                                    <SelectItem value="metal">Metálica</SelectItem>
                                    <SelectItem value="slab">Laje</SelectItem>
                                </SelectContent>
                            </Select>
                        )} />
                    </div>
                </div>

                {/* Foundation */}
                <div className="space-y-2">
                  <Label htmlFor="foundationType" className="flex items-center gap-2"><Droplet className="w-4 h-4" /> Tipo de Fundação</Label>
                  <Controller name="foundationType" control={control} render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id="foundationType"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Padrão</SelectItem>
                          <SelectItem value="continuous-helix">Hélice Contínua</SelectItem>
                        </SelectContent>
                      </Select>
                    )} />
                </div>
                
                {/* Waste */}
                <div className="space-y-2">
                  <Label htmlFor="wastePercentage" className="flex items-center gap-2"><Percent className="w-4 h-4" /> Percentual de Desperdício (%)</Label>
                  <Controller name="wastePercentage" control={control} render={({ field }) => <Input id="wastePercentage" type="number" {...field} />} />
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                Desglose del Presupuesto Estimado
              </CardTitle>
              <CardDescription>
                Esta es una estimación preliminar basada en los datos proporcionados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[40rem] overflow-auto border rounded-md">
                <Table>
                  <TableHeader className="sticky top-0 bg-secondary">
                    <TableRow>
                      <TableHead className="font-semibold">Ítem</TableHead>
                      <TableHead className="text-right font-semibold">Precio Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eap.length > 0 ? eap.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(item.totalPrice)}</TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground h-48">
                          Ingrese detalles válidos del proyecto para ver el desglose del presupuesto.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-end space-y-4">
              <Separator />
              <div className="flex justify-between items-center w-full mt-4">
                  <Button onClick={handleExport} variant="outline" disabled={eap.length === 0}>
                    <FileDown className="mr-2 h-4 w-4" />
                    Exportar CSV
                  </Button>
                  <div className="text-right">
                    <p className="text-muted-foreground">Presupuesto Total Estimado</p>
                    <p className="text-2xl font-bold font-headline text-primary">
                      {formatCurrency(totalBudget)}
                    </p>
                  </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
