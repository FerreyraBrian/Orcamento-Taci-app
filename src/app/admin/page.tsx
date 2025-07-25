"use client";

import { useEffect } from "react";
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
import { defaultCostFactors } from "@/lib/budget";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save } from "lucide-react";
import type { CostFactors } from "@/types";

const costFactorsSchema = z.object({
  baseCostPerSqm: z.coerce.number().positive(),
  qualityMultiplier: z.object({
    standard: z.coerce.number().positive(),
    premium: z.coerce.number().positive(),
    luxury: z.coerce.number().positive(),
  }),
  projectTypeMultiplier: z.object({
    residential: z.coerce.number().positive(),
    commercial: z.coerce.number().positive(),
    industrial: z.coerce.number().positive(),
  }),
});

export default function AdminPage() {
  const { toast } = useToast();

  const form = useForm<CostFactors>({
    resolver: zodResolver(costFactorsSchema),
    defaultValues: defaultCostFactors,
  });

  useEffect(() => {
    try {
      const savedFactors = localStorage.getItem("costFactors");
      if (savedFactors) {
        const parsedFactors = JSON.parse(savedFactors);
        const result = costFactorsSchema.safeParse(parsedFactors);
        if (result.success) {
          form.reset(result.data);
        }
      }
    } catch (error) {
      console.error("Failed to load or parse cost factors from localStorage", error);
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
              <h3 className="text-lg font-semibold font-headline">Base Cost</h3>
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
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-headline">Quality Multipliers</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.keys(defaultCostFactors.qualityMultiplier).map((key) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={`qualityMultiplier.${key}`} className="capitalize">{key}</Label>
                    <Controller
                      name={`qualityMultiplier.${key as keyof CostFactors['qualityMultiplier']}`}
                      control={control}
                      render={({ field }) => (
                         <Input id={`qualityMultiplier.${key}`} type="number" step="0.1" {...field} />
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-headline">Project Type Multipliers</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.keys(defaultCostFactors.projectTypeMultiplier).map((key) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={`projectTypeMultiplier.${key}`} className="capitalize">{key}</Label>
                    <Controller
                      name={`projectTypeMultiplier.${key as keyof CostFactors['projectTypeMultiplier']}`}
                      control={control}
                      render={({ field }) => (
                         <Input id={`projectTypeMultiplier.${key}`} type="number" step="0.1" {...field} />
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
