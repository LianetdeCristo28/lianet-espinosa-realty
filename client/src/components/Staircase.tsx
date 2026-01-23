import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, CreditCard, Landmark, Compass, Home, PenTool, FileText, Key, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const steps = [
  {
    id: 1,
    title: "Decisión",
    icon: Brain,
    desc: "Quiero comprar, pero no sé por dónde empezar",
    detail: "El momento de la verdad. Definimos tus metas reales y quitamos el miedo."
  },
  {
    id: 2,
    title: "Finanzas",
    icon: CreditCard,
    desc: "¿Me alcanza? ¿Qué dice mi crédito?",
    detail: "Auditoría financiera sin juicios. Entendemos tu capacidad real de compra."
  },
  {
    id: 3,
    title: "Preaprobación",
    icon: Landmark,
    desc: "Ahora sí, números reales",
    detail: "La carta que te da poder. El banco dice 'sí' y te da un presupuesto firme."
  },
  {
    id: 4,
    title: "Estrategia",
    icon: Compass,
    desc: "Qué comprar, dónde y cómo",
    detail: "No disparamos al aire. Creamos un plan de ataque para tu mercado ideal."
  },
  {
    id: 5,
    title: "Búsqueda",
    icon: Home,
    desc: "Comparar sin confundirme",
    detail: "Filtramos el ruido. Solo verás casas que cumplen con tu estrategia."
  },
  {
    id: 6,
    title: "Oferta",
    icon: PenTool,
    desc: "Ofertar con seguridad",
    detail: "Negociamos con datos, no con emociones. Conseguimos el mejor precio posible."
  },
  {
    id: 7,
    title: "Proceso",
    icon: FileText,
    desc: "Contratos, inspecciones y fechas",
    detail: "El papeleo bajo control. Coordinamos todo para que no haya sorpresas."
  },
  {
    id: 8,
    title: "Casa Comprada",
    icon: Key,
    desc: "Firmaste. Entendiste todo. Lo lograste.",
    detail: "¡Felicidades! Tienes las llaves y la tranquilidad de haberlo hecho bien.",
    highlight: true
  }
];

export const Staircase = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 md:px-6 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {steps.map((step, index) => {
          // Calculate stagger for ascending effect (left=low, right=high)
          // On mobile (cols-1), no stagger needed or simple vertical list
          // On desktop, we want index 0 to have HIGH margin-top, index 7 to have LOW margin-top
          const desktopMarginTop = `${(steps.length - 1 - index) * 2}rem`; 
          
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative p-6 rounded-xl border transition-all duration-300 cursor-pointer group flex flex-col justify-between h-full min-h-[180px]",
                step.highlight 
                  ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105" 
                  : "bg-card hover:border-primary/50 hover:shadow-md glass-card",
                activeStep === step.id ? "ring-2 ring-primary ring-offset-2" : ""
              )}
              style={{
                // Apply margin only on large screens to create the staircase effect
                // Using a CSS variable or media query inline style hack
                // @ts-ignore
                "--desktop-margin-top": desktopMarginTop
              }}
            >
              <style jsx>{`
                @media (min-width: 1024px) {
                  div[data-step="${step.id}"] {
                    margin-top: ${(steps.length - 1 - index) * 3}rem;
                  }
                }
              `}</style>

              <div data-step={step.id} className="h-full flex flex-col">
                <div className="flex items-start gap-4 mb-3">
                  <div className={cn(
                    "p-3 rounded-full shrink-0 transition-colors", 
                    step.highlight ? "bg-white/20" : "bg-secondary group-hover:bg-primary/10"
                  )}>
                    <step.icon className={cn("w-6 h-6", step.highlight ? "text-white" : "text-primary")} />
                  </div>
                  <div>
                    <h3 className={cn("font-serif font-bold text-lg leading-tight mb-1", step.highlight ? "text-white" : "text-foreground")}>
                      <span className="opacity-50 text-xs block font-sans uppercase tracking-wider mb-1">Paso {step.id}</span>
                      {step.title}
                    </h3>
                  </div>
                </div>
                
                <p className={cn("text-sm leading-snug flex-grow", step.highlight ? "text-white/90" : "text-muted-foreground")}>
                  {step.desc}
                </p>

                <AnimatePresence>
                  {activeStep === step.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className={cn("pt-4 mt-4 border-t", step.highlight ? "border-white/20" : "border-border")}>
                        <p className={cn("text-sm font-medium", step.highlight ? "text-white" : "text-foreground")}>
                          {step.detail}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Expand Indicator */}
                {!activeStep && (
                   <div className="mt-4 pt-2 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className={cn("w-4 h-4 rotate-90", step.highlight ? "text-white/70" : "text-muted-foreground")} />
                   </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Background Graphic Element for Staircase - Ascending */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block overflow-hidden z-0">
         <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-transparent to-primary/5" />
         
         {/* Dashed line following the steps roughly */}
         <svg className="absolute w-full h-full top-0 left-0 text-primary/20" preserveAspectRatio="none">
             <path d="M100,600 C300,500 700,300 1100,100" stroke="currentColor" strokeWidth="4" strokeDasharray="12 12" fill="none" />
         </svg>
      </div>
    </div>
  );
};
