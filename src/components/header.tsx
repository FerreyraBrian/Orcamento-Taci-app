
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons";
import { Home, Mail, Calculator, Menu, UserPlus, Shield } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const navItems = [
    { href: "/", label: "Início", icon: Home },
    { href: "/orcamento", label: "Orçamento", icon: Calculator },
    { href: "/contato", label: "Contato", icon: Mail },
  ];

  const LogoAndTitle = () => (
     <Link href="/" className="flex items-center gap-3">
        <Logo className="h-10 w-10 text-primary" />
        <div className="flex flex-col">
            <span className="font-bold font-headline text-lg leading-tight">
                Taciana Mendes
            </span>
            <span className="text-sm text-muted-foreground leading-tight">
                Engenheira Civil
            </span>
        </div>
    </Link>
  )

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {navItems.map((item) => {
        const isActive = (pathname.startsWith(item.href) && item.href !== "/") || pathname === item.href;
        const button = (
          <Button
            key={item.href}
            variant={isActive ? "secondary" : "ghost"}
            asChild
            className={cn(isMobile && "w-full justify-start text-base")}
            size={isMobile ? "lg" : "default"}
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-5 w-5" />
              {item.label}
            </Link>
          </Button>
        );

        return isMobile ? (
          <SheetClose key={item.href} asChild>{button}</SheetClose>
        ) : (
          button
        );
      })}
    </>
  );

  if (isMobile) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4">
            <LogoAndTitle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[340px]">
                <div className="flex flex-col h-full">
                    <div className="border-b pb-4 mb-4">
                        <LogoAndTitle />
                    </div>
                    <nav className="flex flex-col gap-2 flex-grow">
                        <NavLinks isMobile />
                    </nav>
                     <div className="border-t pt-4 space-y-2">
                        <SheetClose asChild>
                            <Button asChild className="w-full justify-start text-base" size="lg" variant="ghost">
                                <Link href={'/admin'}>
                                    <Shield className="mr-2 h-5 w-5" />
                                    Admin
                                </Link>
                            </Button>
                        </SheetClose>
                        <SheetClose asChild>
                            <Button asChild className="w-full justify-start text-base" size="lg">
                                <Link href={'/meu-perfil'}>
                                    <UserPlus className="mr-2 h-5 w-5" />
                                    Cadastrar
                                </Link>
                            </Button>
                        </SheetClose>
                     </div>
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-8">
            <LogoAndTitle />
        </div>
        <nav className="flex-grow flex items-center gap-1">
          <NavLinks />
        </nav>
         <div className="flex items-center gap-2">
            <Button
                variant={"ghost"}
                asChild
            >
                <Link href={'/admin'}>
                <Shield className="mr-2 h-4 w-4" />
                Admin
                </Link>
            </Button>
            <Button asChild>
                <Link href={'/meu-perfil'}>
                <UserPlus className="mr-2 h-4 w-4" />
                Cadastrar
                </Link>
            </Button>
         </div>
      </div>
    </header>
  );
}
