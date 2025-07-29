"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Phone, Linkedin, Send } from "lucide-react";
import { Logo, WhatsappIcon } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Label } from "./ui/label";

const newsletterFormSchema = z.object({
  email: z.string().email("Por favor, insira um email válido."),
});

type NewsletterFormValues = z.infer<typeof newsletterFormSchema>;

export function Footer() {
  const { toast } = useToast();
  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: NewsletterFormValues) => {
    console.log("Email submetido:", data.email);
    toast({
      title: "Inscrição Recebida!",
      description: "Obrigado por se inscrever na nossa newsletter.",
    });
    form.reset();
  };


  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto py-8 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Logo className="h-8 w-8 text-primary" />
              <span className="font-bold font-headline text-xl">
                Ana-Engenheira
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Soluções de engenharia civil com precisão, inovação e segurança para o seu projeto.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold font-headline text-lg mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-center md:justify-start gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">(11) 99999-8888</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <a href="mailto:contato@engenheira.com" className="text-muted-foreground hover:text-primary transition-colors">
                  contato@engenheira.com
                </a>
              </li>
               <li className="flex items-center justify-center md:justify-start gap-3">
                <WhatsappIcon className="w-5 h-5 text-primary" />
                <a href="https://wa.me/5511999998888" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold font-headline text-lg mb-4">Redes Sociais</h3>
            <ul className="space-y-3">
               <li className="flex items-center justify-center md:justify-start gap-3">
                <Linkedin className="w-5 h-5 text-primary" />
                <a href="https://linkedin.com/in/seu-perfil" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold font-headline text-lg mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Receba as últimas novidades e artigos sobre engenharia.
            </p>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 text-left">
              <Label htmlFor="email-newsletter" className="sr-only">Email</Label>
              <Input 
                id="email-newsletter"
                type="email" 
                placeholder="Seu melhor email" 
                {...form.register("email")}
                className="bg-background"
              />
               {form.formState.errors.email && (
                  <p className="text-destructive text-xs">{form.formState.errors.email.message}</p>
                )}
              <Button type="submit" size="sm" className="w-full bg-accent hover:bg-accent/90">
                <Send className="mr-2 h-4 w-4" />
                Inscrever
              </Button>
            </form>
          </div>

        </div>
        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Ana - Engenheira Civil. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
