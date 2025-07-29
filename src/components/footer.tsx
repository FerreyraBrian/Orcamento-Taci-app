import Link from "next/link";
import { Mail, Phone, Linkedin } from "lucide-react";
import { Logo, WhatsappIcon } from "@/components/icons";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto py-8 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
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
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Ana - Engenheira Civil. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
