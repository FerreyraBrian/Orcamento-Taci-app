
"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CreditCard, Loader2 } from "lucide-react";
import { useState } from "react";

const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, "Número do cartão deve ter 16 dígitos."),
  cardName: z.string().min(3, "Nome no cartão é obrigatório."),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Data deve estar no formato MM/AA."),
  cvc: z.string().regex(/^\d{3,4}$/, "CVC deve ter 3 ou 4 dígitos."),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentSuccess: () => void;
}

export function PaymentDialog({ isOpen, onOpenChange, onPaymentSuccess }: PaymentDialogProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvc: "",
    },
  });

  const onSubmit = (data: PaymentFormData) => {
    setIsProcessing(true);
    console.log("Simulating payment with data:", data);

    // Simula uma chamada de API
    setTimeout(() => {
      onPaymentSuccess();
      toast({
        title: "Pagamento Aprovado!",
        description: "Seu orçamento detalhado foi desbloqueado.",
      });
      setIsProcessing(false);
      form.reset();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pagamento do Orçamento</DialogTitle>
          <DialogDescription>
            Insira os dados do seu cartão para desbloquear o detalhamento completo. Este é um ambiente de simulação.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="cardName">Nome no Cartão</Label>
                <Input id="cardName" {...form.register("cardName")} placeholder="Nome Completo" />
                {form.formState.errors.cardName && <p className="text-destructive text-sm">{form.formState.errors.cardName.message}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="cardNumber">Número do Cartão</Label>
                <Input id="cardNumber" {...form.register("cardNumber")} placeholder="0000 0000 0000 0000" />
                {form.formState.errors.cardNumber && <p className="text-destructive text-sm">{form.formState.errors.cardNumber.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="expiryDate">Validade</Label>
                    <Input id="expiryDate" {...form.register("expiryDate")} placeholder="MM/AA" />
                    {form.formState.errors.expiryDate && <p className="text-destructive text-sm">{form.formState.errors.expiryDate.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" {...form.register("cvc")} placeholder="123" />
                    {form.formState.errors.cvc && <p className="text-destructive text-sm">{form.formState.errors.cvc.message}</p>}
                </div>
            </div>
            <DialogFooter>
                <Button type="submit" className="w-full" disabled={isProcessing}>
                    {isProcessing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <CreditCard className="mr-2 h-4 w-4" />
                    )}
                    Pagar R$ 9,99
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

    