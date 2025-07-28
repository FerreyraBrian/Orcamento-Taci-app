"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons";
import { Home, Mail, Calculator, Settings } from "lucide-react";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Início", icon: Home },
    { href: "/orcamento", label: "Orçamento", icon: Calculator },
    { href: "/contato", label: "Contato", icon: Mail },
    { href: "/admin", label: "Admin", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-8">
          <Logo className="h-8 w-8 text-primary" />
          <span className="font-bold font-headline text-xl">
            Ana-Engenheira
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
