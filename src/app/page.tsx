
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { HardHat, Ruler, Calculator, Lightbulb, ChevronRight } from "lucide-react";

export default function HomePage() {
  const services = [
    {
      icon: <Lightbulb className="w-10 h-10 text-primary transition-transform duration-300 group-hover:scale-110" />,
      title: "Consultoria de Engenharia",
      description: "Soluções estratégicas para pessoas físicas e empresas otimizarem seus projetos de construção e reforma.",
    },
    {
      icon: <Calculator className="w-10 h-10 text-primary transition-transform duration-300 group-hover:rotate-12" />,
      title: "Orçamento Detalhado de Obras",
      description: "Estimativas de custo precisas e transparentes para planejar seu investimento com segurança. Experimente nossa calculadora!",
    },
    {
      icon: <HardHat className="w-10 h-10 text-primary transition-transform duration-300 group-hover:rotate-12" />,
      title: "Gerenciamento e Laudos",
      description: "Coordenação de obras e elaboração de laudos técnicos para garantir a qualidade e a conformidade do seu projeto.",
    },
    {
      icon: <Ruler className="w-10 h-10 text-primary transition-transform duration-300 group-hover:scale-110" />,
      title: "Projetos Estruturais",
      description: "Desenvolvimento de projetos estruturais seguros e otimizados para diversos tipos de edificações.",
    },
  ];

  const projects = [
    {
      image: "https://placehold.co/600x400.png",
      hint: "modern house",
      title: "Residência Contemporânea",
      description: "Projeto estrutural e acompanhamento de obra de residência de alto padrão.",
    },
    {
      image: "https://placehold.co/600x400.png",
      hint: "building facade",
      title: "Edifício Comercial",
      description: "Laudo de reforma e consultoria para modernização de fachada comercial.",
    },
    {
      image: "https://placehold.co/600x400.png",
      hint: "interior renovation",
      title: "Reforma de Interiores",
      description: "Gerenciamento completo de reforma de apartamento, incluindo reforço estrutural.",
    },
    {
      image: "https://placehold.co/600x400.png",
      hint: "structural analysis",
      title: "Análise Estrutural",
      description: "Cálculo e verificação de estrutura metálica para galpão industrial.",
    },
    {
      image: "https://placehold.co/600x400.png",
      hint: "apartment building",
      title: "Prédio Residencial",
      description: "Projeto completo de edifício residencial multifamiliar em alvenaria estrutural.",
    },
  ];

  return (
    <div className="flex-1 animate-fade-in">
      {/* Hero Section */}
      <section className="bg-secondary/60 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-pop-in opacity-0">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/orcamento">
                <Calculator className="mr-2" />
                Calcular Orçamento
                </Link>
            </Button>
            <Button asChild size="lg" variant="outline" >
                <Link href="/contato">
                Solicitar Consultoria
                <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center shadow-lg hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 group">
                <CardHeader>
                  <div className="mx-auto bg-secondary rounded-full p-4 w-fit">
                    {service.icon}
                  </div>
                  <CardTitle className="mt-4">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 md:py-24 bg-secondary/60">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-headline">Projetos em Destaque</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Conheça alguns dos projetos que demonstram meu compromisso com a qualidade.
            </p>
          </div>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto"
          >
            <CarouselContent>
              {projects.map((project, index) => (
                <CarouselItem key={index} className="sm:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col group hover:-translate-y-2">
                       <Image
                        src={project.image}
                        alt={project.title}
                        width={600}
                        height={400}
                        data-ai-hint={project.hint}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <CardHeader>
                        <CardTitle>{project.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-muted-foreground">{project.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>
    </div>
  );
}
