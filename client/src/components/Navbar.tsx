import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: "Compradores", id: "compradores" },
    { label: "Vendedores", id: "vendedores" },
    { label: "Inversionistas", id: "inversionistas" },
    { label: "Realtors IA", id: "realtors-ia" },
    { label: "Buscar", id: "buscar" },
  ];

  return (
    <nav className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300 bg-[#F8F6F2]/95 backdrop-blur-md px-6 py-4",
      scrolled ? "shadow-md" : ""
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <div className="text-xl md:text-2xl font-serif font-bold text-[#17140F] tracking-tight">
          Camino a tu Propiedad | <span className="font-normal italic">Florida</span>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex gap-6">
            {navLinks.map((link) => (
              <button 
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-sm font-medium text-[#17140F]/80 hover:text-primary transition-colors duration-300"
              >
                {link.label}
              </button>
            ))}
          </div>
          
          <Button 
            className="bg-[#D2B463] text-[#17140F] hover:bg-[#D2B463]/90 font-bold rounded-full px-6 transition-all duration-300"
          >
            Hablar con un Experto
          </Button>
        </div>

        {/* Mobile Toggle (Sheet) */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 -mr-2">
                <Menu className="w-6 h-6 text-[#17140F]" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#F8F6F2] border-l-[#BDB2A4]/20 pt-16 flex flex-col gap-6">
              <SheetTitle className="sr-only">Menú de Navegación</SheetTitle>
              <SheetDescription className="sr-only">Opciones de navegación del sitio</SheetDescription>
              {navLinks.map((link) => (
                <button 
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-xl font-medium text-[#17140F] text-left border-b border-[#BDB2A4]/10 pb-4"
                >
                  {link.label}
                </button>
              ))}
              <Button 
                className="bg-[#D2B463] text-[#17140F] hover:bg-[#D2B463]/90 font-bold rounded-full py-6 mt-4 w-full text-lg shadow-sm"
              >
                Hablar con un Experto
              </Button>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </nav>
  );
};