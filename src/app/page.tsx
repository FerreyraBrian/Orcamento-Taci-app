"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HardHat, Ruler, PencilRuler, Lightbulb, ChevronRight } from "lucide-react";

export default function HomePage() {
  const services = [
    {
      icon: <HardHat className="w-10 h-10 text-primary" />,
      title: "Gerenciamento de Obras",
      description: "Coordenação completa de projetos, do planejamento à entrega, garantindo prazos e qualidade.",
    },
    {
      icon: <Ruler className="w-10 h-10 text-primary" />,
      title: "Cálculo Estrutural",
      description: "Desenvolvimento de projetos estruturais seguros e otimizados para edificações residenciais e comerciais.",
    },
    {
      icon: <PencilRuler className="w-10 h-10 text-primary" />,
      title: "Laudos e Vistorias Técnicas",
      description: "Elaboração de laudos periciais, vistorias de imóveis e consultoria técnica especializada.",
    },
    {
      icon: <Lightbulb className="w-10 h-10 text-primary" />,
      title: "Consultoria em Engenharia",
      description: "Soluções inovadoras e personalizadas para os desafios do seu projeto de construção ou reforma.",
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
  ];

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="bg-secondary/60 py-20 md:py-32">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
            Engenharia Civil com Precisão e Inovação
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Transformando ideias em realidade com soluções de engenharia seguras,
            eficientes e personalizadas para o seu projeto.
          </p>
          <Button asChild size="lg" className="mt-8 bg-accent hover:bg-accent/90">
            <Link href="/contato">
              Fale com a Engenheira
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 md:py-24">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-headline">Serviços Oferecidos</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Compromisso com a excelência em cada etapa do seu projeto.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="mx-auto bg-secondary rounded-full p-4 w-fit">
                    {service.icon}
                  </div>
                  <CardTitle className="mt-4">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 md:py-24 bg-secondary/60">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-headline">Projetos em Destaque</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Conheça alguns dos projetos que demonstram meu compromisso com a qualidade.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={600}
                  height={400}
                  data-ai-hint={project.hint}
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{project.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
