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
} from "lucide-react";
import type { EapItem, BudgetInputs, CostFactors } from "@/types";
import { calculateBudget, defaultCostFactors } from "@/lib/budget";

const formSchema = z.object({
  projectType: z.enum(["residential", "commercial", "industrial"]),
  area: z.coerce.number().min(10, "Area must be at least 10 m²"),
  quality: z.enum(["standard", "premium", "luxury"]),
  floors: z.coerce.number().min(1, "Must have at least 1 floor"),
});

export default function BudgetBuilderPage() {
  const [eap, setEap] = useState<EapItem[]>([]);
  const [total, setTotal] = useState(0);
  const [costFactors, setCostFactors] = useState<CostFactors>(defaultCostFactors);

  useEffect(() => {
    try {
      const storedFactors = localStorage.getItem("costFactors");
      if (storedFactors) {
        setCostFactors(JSON.parse(storedFactors));
      }
    } catch (error) {
      console.error("Failed to parse cost factors from localStorage", error);
    }
  }, []);

  const form = useForm<BudgetInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectType: "residential",
      area: 100,
      quality: "standard",
      floors: 1,
    },
  });

  const { watch, control, formState: { errors } } = form;

  const watchedInputs = watch();

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
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
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
                Project Details
              </CardTitle>
              <CardDescription>
                Input your project specs for a real-time budget estimate.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="projectType" className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> Project Type
                  </Label>
                  <Controller
                    name="projectType"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id="projectType">
                          <SelectValue placeholder="Select type..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residential">Residential</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="industrial">Industrial</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area" className="flex items-center gap-2">
                    <Ruler className="w-4 h-4" /> Total Area (m²)
                  </Label>
                  <Controller
                    name="area"
                    control={control}
                    render={({ field }) => (
                      <Input id="area" type="number" placeholder="e.g., 150" {...field} />
                    )}
                  />
                  {errors.area && <p className="text-destructive text-sm">{errors.area.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quality" className="flex items-center gap-2">
                    <Gem className="w-4 h-4" /> Quality Standard
                  </Label>
                   <Controller
                    name="quality"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger id="quality">
                          <SelectValue placeholder="Select quality..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="luxury">Luxury</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="floors" className="flex items-center gap-2">
                    <Layers className="w-4 h-4" /> Number of Floors
                  </Label>
                  <Controller
                    name="floors"
                    control={control}
                    render={({ field }) => (
                      <Input id="floors" type="number" placeholder="e.g., 2" {...field} />
                    )}
                  />
                  {errors.floors && <p className="text-destructive text-sm">{errors.floors.message}</p>}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                Estimated Budget Breakdown
              </CardTitle>
              <CardDescription>
                This is a preliminary estimate based on the provided data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 overflow-auto border rounded-md">
                <Table>
                  <TableHeader className="sticky top-0 bg-secondary">
                    <TableRow>
                      <TableHead className="font-semibold">Item</TableHead>
                      <TableHead className="text-right font-semibold">Quantity</TableHead>
                      <TableHead className="text-right font-semibold">Unit Price</TableHead>
                      <TableHead className="text-right font-semibold">Total Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eap.length > 0 ? eap.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">{item.quantity.toFixed(2)} {item.unit}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(item.totalPrice)}</TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground h-48">
                          Enter valid project details to see the budget breakdown.
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
                    Export CSV
                  </Button>
                  <div className="text-right">
                    <p className="text-muted-foreground">Total Estimated Budget</p>
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
