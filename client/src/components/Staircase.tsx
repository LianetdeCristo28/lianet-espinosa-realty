import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, CreditCard, Landmark, Compass, Home, PenTool, FileText, Key, CheckCircle2, ArrowRight, X, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

// Types
interface StepContent {
  id: number;
  title: string;
  shortDesc: string;
  icon: React.ElementType;
  checklist: string[];
  toAdvance: string[];
  isGoal?: boolean;
}

const stepsData: StepContent[] = [
  {
    id: 1,
    title: "Decisión",
    shortDesc: "Claridad total",
    icon: Brain,
    checklist: [
      "Definir presupuesto mensual ideal",
      "Listar zonas de interés reales",
      "Separar 'lo que necesito' de 'lo que quiero'",
      "Visualizar tu vida en 5 años"
    ],
    toAdvance: [
      "Tener una lista escrita de tus 3 prioridades no negociables."
    ]
  },
  {
    id: 2,
    title: "Finanzas",
    shortDesc: "Poder de compra",
    icon: CreditCard,
    checklist: [
      "Revisar tu reporte de crédito actual",
      "Calcular ahorros disponibles para enganche",
      "Juntar estados de cuenta (últimos 2 meses)",
      "Identificar deudas que podrías liquidar"
    ],
    toAdvance: [
      "Saber exactamente cuánto dinero líquido tienes disponible hoy."
    ]
  },
  {
    id: 3,
    title: "Preaprobación",
    shortDesc: "Dinero seguro",
    icon: Landmark,
    checklist: [
      "Enviar documentos al oficial de préstamo",
      "Evitar abrir nuevos créditos (tarjetas, autos)",
      "Recibir carta de pre-aprobación formal",
      "Entender tu tasa de interés y mensualidad"
    ],
    toAdvance: [
      "Tener la carta de pre-aprobación en tu email."
    ]
  },
  {
    id: 4,
    title: "Estrategia",
    shortDesc: "Plan de ataque",
    icon: Compass,
    checklist: [
      "Seleccionar a tu agente experto",
      "Analizar el mercado en tus zonas (precios reales)",
      "Definir estrategia de oferta (agresiva vs conservadora)",
      "Programar alertas de nuevas propiedades"
    ],
    toAdvance: [
      "Agente contratado y calendario de visitas listo."
    ]
  },
  {
    id: 5,
    title: "Búsqueda",
    shortDesc: "Caza de casa",
    icon: Home,
    checklist: [
      "Visitar propiedades filtradas (calidad > cantidad)",
      "Tomar notas y fotos de cada visita",
      "Evaluar reparaciones potenciales",
      "Revisar el vecindario en diferentes horarios"
    ],
    toAdvance: [
      "Encontrar esa casa que te hace decir 'es esta'."
    ]
  },
  {
    id: 6,
    title: "Oferta",
    shortDesc: "Negociación",
    icon: PenTool,
    checklist: [
      "Análisis comparativo de mercado (CMA)",
      "Escribir oferta competitiva con tu agente",
      "Decidir monto de depósito de garantía (Earnest Money)",
      "Negociar contraofertas si es necesario"
    ],
    toAdvance: [
      "Oferta aceptada y firmada por ambas partes."
    ]
  },
  {
    id: 7,
    title: "Proceso",
    shortDesc: "Bajo contrato",
    icon: FileText,
    checklist: [
      "Realizar inspección física de la casa",
      "Gestionar el avalúo (Appraisal) del banco",
      "Revisión final de préstamo (Underwriting)",
      "Negociar reparaciones basadas en inspección"
    ],
    toAdvance: [
      "Recibir el 'Clear to Close' del banco."
    ]
  },
  {
    id: 8,
    title: "Casa Comprada",
    shortDesc: "¡Meta cumplida!",
    icon: Key,
    checklist: [
      "Revisión final de la casa (Walkthrough)",
      "Firmar escrituras en notaría/título",
      "Transferir fondos de cierre",
      "¡Celebrar y recibir tus llaves!"
    ],
    toAdvance: [
      "¡Mudarte a tu nuevo hogar!"
    ],
    isGoal: true
  }
];

export const Staircase = () => {
  const [activeStepId, setActiveStepId] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const activeStepData = stepsData.find(s => s.id === activeStepId);

  const handleStepClick = (id: number) => {
    setActiveStepId(id);
  };

  const handleNextStep = () => {
    if (activeStepId && activeStepId < stepsData.length) {
      setActiveStepId(activeStepId + 1);
    } else {
      setActiveStepId(null); // Close if at end
    }
  };

  return (
    <div className="w-full relative py-12 px-4 md:px-8 max-w-7xl mx-auto min-h-[600px] flex flex-col md:flex-row gap-8">
      
      {/* LEFT: Staircase Visual */}
      <div className="flex-1 relative min-h-[500px] flex items-end justify-center md:justify-start overflow-visible pb-12">
        
        {/* Background Guide Line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 hidden md:block" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M10,90 L90,10" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" fill="none" className="text-primary"/>
        </svg>

        {/* The Staircase Container */}
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-8 md:grid-rows-8 gap-4 md:gap-0 relative z-10">
            {stepsData.map((step, index) => {
                // Determine grid position for literal staircase on desktop
                // Col 1 = Row 8, Col 2 = Row 7 ... Col 8 = Row 1
                const colStart = index + 1;
                const rowStart = stepsData.length - index;

                return (
                    <motion.div
                        key={step.id}
                        layoutId={`step-${step.id}`}
                        className={cn(
                            "relative group cursor-pointer transition-all duration-300 md:absolute md:w-[140%]", // Make width wider on desktop to overlap slightly or fill
                            // Mobile: Stacked cards
                            "w-full",
                            activeStepId === step.id ? "z-30" : "z-10 hover:z-20"
                        )}
                        style={{
                            // Responsive Styles
                            ...(window.innerWidth >= 768 ? {
                                gridColumn: colStart,
                                gridRow: rowStart,
                                left: `${(index * 12)}%`, // Manual offset for staircase overlap
                                bottom: `${(index * 12)}%`,
                                position: 'absolute',
                                width: '180px',
                                height: '140px'
                            } : {})
                        }}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleStepClick(step.id)}
                    >
                        {/* 3D Block Visual */}
                        <div className={cn(
                            "h-full w-full rounded-xl p-4 flex flex-col justify-between transition-all duration-300 shadow-md",
                            // Colors
                            step.isGoal ? "bg-primary text-primary-foreground border-primary" : "bg-[#F8F6F2] text-foreground border border-[#BDB2A4]/40",
                            // Hover & Active States
                            activeStepId === step.id 
                                ? "shadow-xl ring-2 ring-primary ring-offset-2 scale-105 -translate-y-2" 
                                : "hover:-translate-y-1 hover:shadow-lg hover:border-primary/50",
                            // 3D Side Effect (Pseudo-element logic simpler with shadow for now)
                            "shadow-[4px_4px_0px_0px_rgba(189,178,164,0.3)]"
                        )}>
                            <div className="flex justify-between items-start">
                                <span className={cn(
                                    "text-xs font-bold px-2 py-0.5 rounded-full",
                                    step.isGoal ? "bg-white/20 text-white" : "bg-[#E5E1D8] text-muted-foreground"
                                )}>
                                    {step.id}
                                </span>
                                {step.isGoal && <Star className="w-4 h-4 text-white fill-white animate-pulse" />}
                            </div>
                            
                            <div className="mt-2 text-center md:text-left">
                                <step.icon className={cn(
                                    "w-8 h-8 mx-auto md:mx-0 mb-2 transition-transform duration-300 group-hover:scale-110", 
                                    step.isGoal ? "text-white" : "text-primary"
                                )} />
                                <h3 className={cn("font-serif font-bold text-sm md:text-base leading-tight", step.isGoal ? "text-white" : "text-[#17140F]")}>
                                    {step.title}
                                </h3>
                                <p className={cn("text-xs mt-1 leading-none hidden md:block", step.isGoal ? "text-white/80" : "text-muted-foreground")}>
                                    {step.shortDesc}
                                </p>
                            </div>
                        </div>
                        
                        {/* Connector Line to next step (Desktop only) */}
                        {!step.isGoal && (
                            <div className="hidden md:block absolute -right-4 top-1/2 w-8 h-[2px] bg-[#BDB2A4]/30 -rotate-45 z-0" />
                        )}
                    </motion.div>
                );
            })}

            {/* THE GOAL HOUSE VISUAL - Top Right */}
            <motion.div 
                className="hidden md:block absolute top-[-60px] right-[-40px] z-20 w-48 h-48 pointer-events-none"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
            >
                <img src="/assets/goal-house.png" alt="Casa Comprada" className="w-full h-full object-contain drop-shadow-2xl" />
                
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-primary/20 blur-3xl -z-10 rounded-full animate-pulse" />
            </motion.div>
        </div>
      </div>

      {/* RIGHT: Detail Panel (Desktop) / Mobile Drawer handled separately */}
      <AnimatePresence mode="wait">
        {activeStepData && !isMobile && (
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full md:w-[350px] lg:w-[400px] bg-white rounded-2xl shadow-2xl border border-border overflow-hidden sticky top-24 h-fit z-40"
            >
               <StepDetailContent step={activeStepData} onNext={handleNextStep} onClose={() => setActiveStepId(null)} />
            </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE DRAWER */}
      <Sheet open={!!activeStepId && isMobile} onOpenChange={(open) => !open && setActiveStepId(null)}>
        <SheetContent side="bottom" className="rounded-t-3xl h-[85vh] p-0 bg-[#F8F6F2]">
            {activeStepData && (
                 <StepDetailContent step={activeStepData} onNext={handleNextStep} onClose={() => setActiveStepId(null)} isMobile={true} />
            )}
        </SheetContent>
      </Sheet>

    </div>
  );
};

// Extracted Content Component for reuse in Sheet & Desktop Panel
const StepDetailContent = ({ step, onNext, onClose, isMobile = false }: { step: StepContent, onNext: () => void, onClose: () => void, isMobile?: boolean }) => {
    return (
        <div className="flex flex-col h-full bg-[#F8F6F2]">
            {/* Header */}
            <div className={cn("p-6 pb-4 relative overflow-hidden", step.isGoal ? "bg-primary text-primary-foreground" : "bg-[#E5E1D8]")}>
                 {/* Close Button */}
                 <Button variant="ghost" size="icon" className="absolute top-4 right-4 z-10 hover:bg-black/5" onClick={onClose}>
                    <X className="w-5 h-5" />
                 </Button>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                         <div className={cn("p-2 rounded-lg", step.isGoal ? "bg-white/20" : "bg-white/50")}>
                             <step.icon className={cn("w-6 h-6", step.isGoal ? "text-white" : "text-primary")} />
                         </div>
                         <span className={cn("text-xs font-bold uppercase tracking-wider opacity-70", step.isGoal ? "text-white" : "text-[#17140F]")}>
                            Paso {step.id} de {stepsData.length}
                         </span>
                    </div>
                    <h2 className={cn("text-2xl font-serif font-bold", step.isGoal ? "text-white" : "text-[#17140F]")}>
                        {step.title}
                    </h2>
                    <p className={cn("text-sm mt-1", step.isGoal ? "text-white/90" : "text-muted-foreground")}>
                        {step.shortDesc}
                    </p>
                </div>
            </div>

            {/* Scrollable Content */}
            <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
                           <CheckCircle2 className="w-4 h-4 text-primary" />
                           Tu Lista de Misión
                        </h4>
                        <ul className="space-y-3">
                            {step.checklist.map((item, i) => (
                                <motion.li 
                                    key={i} 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-start gap-3 text-sm text-[#17140F] bg-white p-3 rounded-lg border border-border/50 shadow-sm"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                    <span className="leading-relaxed">{item}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-[#D2B463]/10 p-4 rounded-xl border border-[#D2B463]/20">
                        <h4 className="text-sm font-bold text-[#17140F] mb-2">
                            🚀 Para pasar al siguiente nivel:
                        </h4>
                        {step.toAdvance.map((item, i) => (
                            <p key={i} className="text-sm text-[#17140F]/80 leading-relaxed italic">
                                "{item}"
                            </p>
                        ))}
                    </div>
                </div>
            </ScrollArea>

            {/* Footer Actions */}
            <div className="p-6 pt-4 border-t bg-white mt-auto">
                <Button 
                    onClick={onNext}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 shadow-lg shadow-primary/20 group"
                >
                    {step.isGoal ? "¡Celebrar!" : "Siguiente Paso"} 
                    {!step.isGoal && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
                </Button>
            </div>
        </div>
    );
}
