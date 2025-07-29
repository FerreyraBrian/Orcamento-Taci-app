
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogIn, User, Lock, UserPlus } from "lucide-react";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Por favor, insira um email válido."),
  password: z.string().min(1, "A senha é obrigatória."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    // Simulação de autenticação de usuário comum
    if (data.email === "user@test.com" && data.password === "123456") {
       toast({
        title: "Login bem-sucedido!",
        description: "Redirecionando para o seu perfil.",
      });
      localStorage.setItem("isAuthenticated", "true");
      router.push("/orcamento"); // Redireciona para o orçamento após login
      return;
    }
    
    // Simulação de autenticação de admin
    if (data.email === "admin@admin" && data.password === "1234") {
      toast({
        title: "Login de Admin bem-sucedido!",
        description: "Redirecionando para o painel administrativo.",
      });
      localStorage.setItem("isAuthenticated", "true");
      router.push("/admin");
       return;
    } 
    
    toast({
        title: "Credenciais inválidas",
        description: "Por favor, verifique seu email e senha.",
        variant: "destructive",
    });
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle>Acessar Plataforma</CardTitle>
          <CardDescription>Faça login para continuar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                 <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" {...form.register("email")} placeholder="seu@email.com" className="pl-9" />
              </div>
              {form.formState.errors.email && (
                <p className="text-destructive text-sm">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
               <div className="relative">
                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" {...form.register("password")} placeholder="••••••" className="pl-9" />
              </div>
              {form.formState.errors.password && (
                <p className="text-destructive text-sm">{form.formState.errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
              <LogIn className="mr-2 h-4 w-4" />
              Entrar
            </Button>
            <div className="text-center text-sm text-muted-foreground">
                <p>Não tem uma conta?</p>
                <Button variant="link" asChild className="p-0 h-auto">
                    <Link href="/meu-perfil">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Cadastre-se agora
                    </Link>
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
