"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { WhatsappIcon } from "@/components/icons";

const contactFormSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: z.string().email("Por favor, insira um email válido."),
  message: z.string().min(10, "A mensagem deve ter pelo menos 10 caracteres."),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContatoPage() {
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    console.log(data);
    toast({
      title: "Mensagem Enviada!",
      description: "Obrigado por entrar em contato. Retornarei em breve.",
    });
    form.reset();
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold font-headline text-primary">Entre em Contato</h1>
            <p className="text-muted-foreground mt-2">
              Estou à disposição para discutir seu próximo projeto. Preencha o formulário ou utilize um dos canais abaixo.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Mail className="w-6 h-6 text-accent" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <a href="mailto:taciana.mendescarvalho@gmail.com" className="text-muted-foreground hover:text-primary">
                  taciana.mendescarvalho@gmail.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="w-6 h-6 text-accent" />
              <div>
                <h3 className="font-semibold">Telefone</h3>
                <p className="text-muted-foreground">(11) 99999-8888</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
                <WhatsappIcon className="w-6 h-6 text-accent" />
                <div>
                    <h3 className="font-semibold">WhatsApp</h3>
                    <a href="https://wa.me/5511999998888" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                        (11) 99999-8888
                    </a>
                </div>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="w-6 h-6 text-accent" />
              <div>
                <h3 className="font-semibold">Localização</h3>
                <p className="text-muted-foreground">Lages, SC - Atendimento Remoto e Presencial</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Envie sua mensagem</CardTitle>
            <CardDescription>Responderei o mais rápido possível.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-destructive text-sm">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...form.register("email")} />
                {form.formState.errors.email && (
                  <p className="text-destructive text-sm">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Sua Mensagem</Label>
                <Textarea id="message" {...form.register("message")} rows={5} />
                {form.formState.errors.message && (
                  <p className="text-destructive text-sm">{form.formState.errors.message.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                <Send className="mr-2 h-4 w-4" />
                Enviar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
