"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { defaultCostFactors as defaultFactors } from "@/lib/budget";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save } from "lucide-react";
import type { CostFactors } from "@/types";

const costFactorsSchema = z.object({
  baseCostPerSqm: z.coerce.number().positive(),
  finishQualityMultiplier: z.object({
    economy: z.coerce.number().positive(),
    medium: z.coerce.number().positive(),
    high: z.coerce.number().positive(),
  }),
  wallTypeMultiplier: z.object({
      masonry: z.coerce.number().positive(),
      structural: z.coerce.number().positive(),
      drywall: z.coerce.number().positive(),
  }),
  wallFinishMultiplier: z.object({
      paint: z.coerce.number().positive(),
      cladding: z.coerce.number().positive(),
      plaster: z.coerce.number().positive(),
      skimCoat: z.coerce.number().positive(),
  }),
  frameCostPerSqm: z.coerce.number().positive(),
  costPerBathroom: z.coerce.number().positive(),
  floorCostPerSqm: z.coerce.number().positive(),
  ceilingCostPerSqm: z.object({
      pvc: z.coerce.number().positive(),
      gypsum: z.coerce.number().positive(),
  }),
  roofTypeMultiplier: z.object({
      ceramic: z.coerce.number().positive(),
      metal: z.coerce.number().positive(),
      slab: z.coerce.number().positive(),
  }),
  foundationMultiplier: z.object({
      standard: z.coerce.number().positive(),
      continuousHelix: z.coerce.number().positive(),
  }),
});

export default function AdminPage() {
  const { toast } = useToast();
  const [defaultCostFactors, setDefaultCostFactors] = useState<CostFactors | null>(null);

  const form = useForm<CostFactors>({
    resolver: zodResolver(costFactorsSchema),
    defaultValues: defaultFactors,
  });

  useEffect(() => {
    try {
      const savedFactors = localStorage.getItem("costFactors");
      let factorsToLoad = defaultFactors;
      if (savedFactors) {
        const parsedFactors = JSON.parse(savedFactors);
        const result = costFactorsSchema.safeParse(parsedFactors);
        if (result.success) {
          factorsToLoad = result.data
        }
      }
      form.reset(factorsToLoad);
      setDefaultCostFactors(factorsToLoad);
    } catch (error) {
      console.error("Failed to load or parse cost factors from localStorage", error);
      setDefaultCostFactors(defaultFactors);
    }
  }, [form]);

  const onSubmit = (data: CostFactors) => {
    try {
      localStorage.setItem("costFactors", JSON.stringify(data));
      toast({
        title: "Success!",
        description: "Cost factors have been saved successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save cost factors.",
      });
      console.error(error);
    }
  };
  
  const { control, handleSubmit } = form;

  if (!defaultCostFactors) {
    return (
      <div className="container mx-auto p-4 md:p-8 flex justify-center">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-8">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-32 ml-auto" />
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8 flex justify-center">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary"/>
            Admin Cost Controls
          </CardTitle>
          <CardDescription>
            Customize the multipliers and base costs for budget calculations.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-headline">Base Costs</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="baseCostPerSqm">Base Cost per m² ($)</Label>
                    <Controller
                      name="baseCostPerSqm"
                      control={control}
                      render={({ field }) => (
                        <Input id="baseCostPerSqm" type="number" step="10" {...field} />
                      )}
                    />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="frameCostPerSqm">Frame Cost per m² ($)</Label>
                    <Controller
                      name="frameCostPerSqm"
                      control={control}
                      render={({ field }) => (
                        <Input id="frameCostPerSqm" type="number" step="10" {...field} />
                      )}
                    />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="costPerBathroom">Cost Per Bathroom ($)</Label>
                    <Controller
                      name="costPerBathroom"
                      control={control}
                      render={({ field }) => (
                        <Input id="costPerBathroom" type="number" step="100" {...field} />
                      )}
                    />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="floorCostPerSqm">Floor Cost per m² ($)</Label>
                    <Controller
                      name="floorCostPerSqm"
                      control={control}
                      render={({ field }) => (
                        <Input id="floorCostPerSqm" type="number" step="5" {...field} />
                      )}
                    />
                  </div>
               </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-headline">Finish Quality Multipliers</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.keys(defaultCostFactors.finishQualityMultiplier).map((key) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={`finishQualityMultiplier.${key}`} className="capitalize">{key}</Label>
                    <Controller
                      name={`finishQualityMultiplier.${key as keyof CostFactors['finishQualityMultiplier']}`}
                      control={control}
                      render={({ field }) => (
                         <Input id={`finishQualityMultiplier.${key}`} type="number" step="0.1" {...field} />
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-headline">Wall Type Multipliers</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.keys(defaultCostFactors.wallTypeMultiplier).map((key) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={`wallTypeMultiplier.${key}`} className="capitalize">{key}</Label>
                    <Controller
                      name={`wallTypeMultiplier.${key as keyof CostFactors['wallTypeMultiplier']}`}
                      control={control}
                      render={({ field }) => (
                         <Input id={`wallTypeMultiplier.${key}`} type="number" step="0.1" {...field} />
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-headline">Wall Finish Multipliers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(defaultCostFactors.wallFinishMultiplier).map((key) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={`wallFinishMultiplier.${key}`} className="capitalize">{key === 'skimCoat' ? "Skim Coat" : key}</Label>
                    <Controller
                      name={`wallFinishMultiplier.${key as keyof CostFactors['wallFinishMultiplier']}`}
                      control={control}
                      render={({ field }) => (
                         <Input id={`wallFinishMultiplier.${key}`} type="number" step="0.1" {...field} />
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-headline">Ceiling Cost per m²</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(defaultCostFactors.ceilingCostPerSqm).map((key) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={`ceilingCostPerSqm.${key}`} className="capitalize">{key}</Label>
                    <Controller
                      name={`ceilingCostPerSqm.${key as keyof CostFactors['ceilingCostPerSqm']}`}
                      control={control}
                      render={({ field }) => (
                         <Input id={`ceilingCostPerSqm.${key}`} type="number" step="5" {...field} />
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-headline">Roof Type Multipliers</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.keys(defaultCostFactors.roofTypeMultiplier).map((key) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={`roofTypeMultiplier.${key}`} className="capitalize">{key}</Label>
                    <Controller
                      name={`roofTypeMultiplier.${key as keyof CostFactors['roofTypeMultiplier']}`}
                      control={control}
                      render={({ field }) => (
                         <Input id={`roofTypeMultiplier.${key}`} type="number" step="0.1" {...field} />
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-headline">Foundation Multipliers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(defaultCostFactors.foundationMultiplier).map((key) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={`foundationMultiplier.${key}`} className="capitalize">{key === 'continuousHelix' ? 'Continuous Helix' : key}</Label>
                    <Controller
                      name={`foundationMultiplier.${key as keyof CostFactors['foundationMultiplier']}`}
                      control={control}
                      render={({ field }) => (
                         <Input id={`foundationMultiplier.${key}`} type="number" step="0.1" {...field} />
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>

          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full md:w-auto ml-auto bg-accent hover:bg-accent/90">
              <Save className="mr-2 h-4 w-4"/>
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
