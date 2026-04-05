import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = ({ onContactClick }: { onContactClick?: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: "Sobre Mí", id: "sobre-mi" },
    { label: "Compradores", id: "compradores" },
    { label: "Vendedores", id: "vendedores" },
    { label: "Inversionistas", id: "inversionistas" },
    { label: "Buscar", id: "buscar" },
  ];

  return (
    <>
    <div
      className="fixed top-0 left-0 h-[2px] bg-[#D2B463] z-[60] transition-all duration-150"
      style={{ width: `${scrollProgress}%` }}
    />
    <nav role="navigation" aria-label="Navegación principal" className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300 px-6 py-4",
      scrolled
        ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-[#BDB2A4]/10"
        : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <div className="text-base md:text-lg font-serif font-bold text-[#17140F] tracking-tight leading-tight">
          Lianet Espinosa Ojeda{" "}
          <span className="text-[#D2B463]">|</span>{" "}
          <span className="font-normal text-sm md:text-base">REALTOR® · eXp Realty</span>
        </div>
        
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
            onClick={onContactClick}
            className="bg-[#D2B463] text-[#17140F] hover:bg-[#D2B463]/90 font-bold rounded-full px-6 transition-all duration-300"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0" />
            Hablar con un Experto
          </Button>
        </div>

        <div className="lg:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 -mr-2"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú de navegación"}
          >
            {mobileOpen ? (
              <X className="w-6 h-6 text-[#17140F]" />
            ) : (
              <Menu className="w-6 h-6 text-[#17140F]" />
            )}
          </button>
        </div>

      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-1 pt-6 pb-4">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => scrollToSection(link.id)}
                  className="text-lg font-medium text-[#17140F] text-left py-3 border-b border-[#BDB2A4]/10"
                >
                  {link.label}
                </motion.button>
              ))}
              <Button 
                onClick={() => { setMobileOpen(false); onContactClick?.(); }}
                className="bg-[#D2B463] text-[#17140F] hover:bg-[#D2B463]/90 font-bold rounded-full py-6 mt-4 w-full text-lg shadow-sm"
              >
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0" />
                Hablar con un Experto
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    </>
  );
};
