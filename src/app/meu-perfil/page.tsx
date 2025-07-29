
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Building, Mail, Phone, Lock, FileText } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const registerSchema = z.object({
  accountType: z.enum(["pessoa", "empresa"], {
    required_error: "Selecione o tipo de conta.",
  }),
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: z.string().email("Por favor, insira um email válido."),
  phone: z.string().min(10, "Por favor, insira um telefone válido."),
  document: z.string().min(11, "Documento inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function MeuPerfilPage() {
  const { toast } = useToast();
  const [accountType, setAccountType] = useState("pessoa");

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      accountType: "pessoa",
      name: "",
      email: "",
      phone: "",
      document: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    console.log(data);
    toast({
      title: "Cadastro Realizado com Sucesso!",
      description: "Sua conta foi criada. Agora você pode fazer o login.",
    });
    form.reset();
  };

  const handleAccountTypeChange = (value: "pessoa" | "empresa") => {
    setAccountType(value);
    form.setValue("accountType", value);
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center">
          <UserPlus className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="mt-4">Crie sua Conta</CardTitle>
          <CardDescription>
            Junte-se à nossa comunidade para acessar orçamentos e mais.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label>Tipo de Conta</Label>
              <Controller
                name="accountType"
                control={form.control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={(value: "pessoa" | "empresa") => handleAccountTypeChange(value)}
                    defaultValue={field.value}
                    className="flex space-x-4 pt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pessoa" id="pessoa" />
                      <Label htmlFor="pessoa">Pessoa Física</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="empresa" id="empresa" />
                      <Label htmlFor="empresa">Pessoa Jurídica</Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">{accountType === 'pessoa' ? 'Nome Completo' : 'Razão Social'}</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="name" {...form.register("name")} placeholder={accountType === 'pessoa' ? 'Seu nome completo' : 'Nome da sua empresa'} className="pl-9" />
              </div>
              {form.formState.errors.name && <p className="text-destructive text-sm">{form.formState.errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="document">{accountType === 'pessoa' ? 'CPF' : 'CNPJ'}</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="document" {...form.register("document")} placeholder={accountType === 'pessoa' ? '000.000.000-00' : '00.000.000/0000-00'} className="pl-9" />
              </div>
              {form.formState.errors.document && <p className="text-destructive text-sm">{form.formState.errors.document.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" {...form.register("email")} placeholder="seu@email.com" className="pl-9" />
                </div>
                {form.formState.errors.email && <p className="text-destructive text-sm">{form.formState.errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="phone" type="tel" {...form.register("phone")} placeholder="(00) 90000-0000" className="pl-9" />
                </div>
                {form.formState.errors.phone && <p className="text-destructive text-sm">{form.formState.errors.phone.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type="password" {...form.register("password")} placeholder="••••••" className="pl-9" />
                </div>
                {form.formState.errors.password && <p className="text-destructive text-sm">{form.formState.errors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="confirmPassword" type="password" {...form.register("confirmPassword")} placeholder="••••••" className="pl-9" />
                </div>
                {form.formState.errors.confirmPassword && <p className="text-destructive text-sm">{form.formState.errors.confirmPassword.message}</p>}
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
              <UserPlus className="mr-2 h-4 w-4" />
              Criar Conta
            </Button>
            
            <p className="text-center text-sm text-muted-foreground">
                Já tem uma conta?{' '}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                    Faça login aqui.
                </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
