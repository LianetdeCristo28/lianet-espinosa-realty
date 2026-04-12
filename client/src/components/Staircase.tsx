import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, CreditCard, Landmark, Compass, Home, PenTool, FileText, Key, CheckCircle2, ArrowRight, X, Star, Sparkles, MessageSquare } from "lucide-react";
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
  whatToDo: string[];
  toAdvance: string[];
  realtorValue: string;
  gptAgentId: string; // Placeholder for future linking
  isGoal?: boolean;
}

const stepsData: StepContent[] = [
  {
    id: 1,
    title: "Decisión",
    shortDesc: "Claridad y metas",
    icon: Brain,
    whatToDo: [
      "Reflexionas sobre tus motivos reales: ¿buscas espacio, independencia o inversión?",
      "Distingues entre lo que es indispensable para tu vida diaria y lo que sería un extra agradable.",
      "Conversas con tu familia para alinear prioridades y evitar conflictos futuros.",
      "Analizas tu presupuesto mensual personal para definir con qué cifra te sientes cómodo."
    ],
    toAdvance: [
      "Tener una lista escrita de tus 3 prioridades no negociables."
    ],
    realtorValue: "Lianet te ayuda a traducir tus deseos personales en un plan de búsqueda realista, filtrando lo que el mercado actual ofrece.",
    gptAgentId: "decision-gpt"
  },
  {
    id: 2,
    title: "Finanzas",
    shortDesc: "Salud financiera",
    icon: CreditCard,
    whatToDo: [
      "Revisas tus ahorros disponibles para el pago inicial y los gastos de cierre.",
      "Verificas tu propio historial de crédito para detectar posibles errores.",
      "Reúnes tus documentos financieros personales (recibos de nómina, estados de cuenta).",
      "Evitas hacer compras grandes o solicitar nuevos créditos durante esta etapa."
    ],
    toAdvance: [
      "Conocer exactamente cuánto capital líquido tienes disponible hoy."
    ],
    realtorValue: "Lianet te conecta con prestamistas de confianza y te orienta sobre los costos ocultos que debes considerar más allá del precio de venta.",
    gptAgentId: "finanzas-gpt"
  },
  {
    id: 3,
    title: "Preaprobación",
    shortDesc: "Presupuesto real",
    icon: Landmark,
    whatToDo: [
      "Entregas tu documentación financiera al prestamista para su evaluación.",
      "Revisas las diferentes opciones de préstamo que te presentan.",
      "Comprendes cuál sería tu pago mensual total estimado (incluyendo impuestos y seguros).",
      "Obtienes la carta oficial que confirma cuánto dinero te puede prestar el banco."
    ],
    toAdvance: [
      "Tener la carta de pre-aprobación oficial en tu correo electrónico."
    ],
    realtorValue: "Lianet se asegura de que tu carta de pre-aprobación sea sólida y competitiva, lo cual es vital para que los vendedores tomen en serio tu oferta.",
    gptAgentId: "preaprobacion-gpt"
  },
  {
    id: 4,
    title: "Estrategia",
    shortDesc: "Plan de mercado",
    icon: Compass,
    whatToDo: [
      "Decides las zonas específicas donde te gustaría vivir (basado en escuelas, trabajo, familia).",
      "Defines el tipo de propiedad que se ajusta a tu estilo de vida (casa, apartamento, etc.).",
      "Estableces tu calendario ideal: ¿para qué fecha necesitas estar mudado?",
      "Te preparas mentalmente para tomar decisiones rápidas si el mercado lo requiere."
    ],
    toAdvance: [
      "Tener claras las zonas objetivo y el rango de fechas para la mudanza."
    ],
    realtorValue: "Lianet analiza los datos del mercado local para diseñar la estrategia de búsqueda más efectiva según tus tiempos y presupuesto.",
    gptAgentId: "estrategia-gpt"
  },
  {
    id: 5,
    title: "Búsqueda",
    shortDesc: "Visitas inteligentes",
    icon: Home,
    whatToDo: [
      "Asistes a las visitas programadas de las propiedades que cumplen tus criterios.",
      "Observas detalles importantes más allá de la estética (ruidos, luz natural, espacios).",
      "Tomas notas y compartes tu opinión honesta sobre cada casa visitada.",
      "Evalúas cómo te sientes en el vecindario en diferentes momentos del día."
    ],
    toAdvance: [
      "Identificar la casa que cumple con tus requisitos no negociables."
    ],
    realtorValue: "Lianet filtra el inventario para ahorrarte tiempo y te señala detalles críticos de las propiedades que un ojo inexperto podría pasar por alto.",
    gptAgentId: "busqueda-gpt"
  },
  {
    id: 6,
    title: "Oferta",
    shortDesc: "Hacerlo oficial",
    icon: PenTool,
    whatToDo: [
      "Revisas el análisis de precio y la estrategia de oferta que te presenta tu agente.",
      "Autorizas el precio y las condiciones (fechas, contingencias) que se incluirán.",
      "Firmas la propuesta formal para enviarla al vendedor.",
      "Te mantienes disponible para responder si hay una contraoferta del vendedor."
    ],
    toAdvance: [
      "Tener el contrato de compraventa aceptado y firmado por ambas partes."
    ],
    realtorValue: "Lianet redacta y presenta tu oferta de manera profesional, y negocia firmemente los términos y el precio para proteger tus intereses.",
    gptAgentId: "oferta-gpt"
  },
  {
    id: 7,
    title: "Proceso",
    shortDesc: "Cierre seguro",
    icon: FileText,
    whatToDo: [
      "Facilitas el acceso para la inspección y revisas el reporte de resultados.",
      "Esperas la confirmación del valor de la propiedad por parte del banco (avalúo).",
      "Mantienes tus finanzas estables (sin nuevos créditos) hasta el día final.",
      "Revisas y firmas los documentos de cierre y la divulgación final de costos."
    ],
    toAdvance: [
      "Recibir la confirmación final del banco (Clear to Close) y la fecha de firma."
    ],
    realtorValue: "Lianet coordina a todos los involucrados (inspectores, casa de títulos, banco) para asegurar que se cumplan los plazos contractuales sin estrés.",
    gptAgentId: "cierre-gpt"
  },
  {
    id: 8,
    title: "Casa Comprada",
    shortDesc: "¡Meta cumplida!",
    icon: Key,
    whatToDo: [
      "Realizas el recorrido final para verificar que la casa está en las condiciones acordadas.",
      "Firmas las escrituras ante notario o compañía de títulos.",
      "Realizas la transferencia final de los fondos necesarios.",
      "Recibes las llaves y tomas posesión de tu nuevo hogar."
    ],
    toAdvance: [
      "¡Mudarte y comenzar tu nueva vida en tu casa propia!"
    ],
    realtorValue: "Lianet te acompaña hasta el último momento y sigue siendo tu recurso de confianza para cualquier necesidad futura relacionada con tu hogar.",
    gptAgentId: "meta-gpt",
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
      <div className="flex-1 relative min-h-[500px] flex items-end justify-center md:justify-start overflow-hidden pb-12">
        
        {/* Background Guide Line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 hidden md:block" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M10,90 L90,10" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" fill="none" className="text-primary"/>
        </svg>

        {/* Mobile hint */}
        <p className="md:hidden text-center text-xs text-muted-foreground mb-2 italic">Toca cada paso para ver los detalles</p>

        {/* The Staircase Container */}
        <div className="w-full h-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 md:grid-rows-8 gap-3 md:gap-0 relative z-10">
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
                                ? "shadow-md ring-2 ring-primary ring-offset-2 scale-105 -translate-y-2" 
                                : "hover:-translate-y-1 hover:shadow-sm hover:border-primary/50",
                            // 3D Side Effect (Pseudo-element logic simpler with shadow for now)
                            "shadow-[2px_2px_0px_0px_rgba(189,178,164,0.2)]"
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
                <img src="/assets/goal-house.png" alt="Ilustración de tu futura casa en Florida" loading="lazy" className="w-full h-full object-contain drop-shadow-2xl" />
                
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
                className="w-full md:w-[350px] lg:w-[400px] bg-white rounded-2xl shadow-lg border border-[#BDB2A4]/20 overflow-hidden sticky top-24 h-fit z-40"
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
                           Qué haces aquí:
                        </h4>
                        <ul className="space-y-3">
                            {step.whatToDo.map((item, i) => (
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

                    {/* Realtor Value Prop */}
                    <div className="bg-[#E5E1D8]/50 p-4 rounded-xl border border-[#BDB2A4]/30 flex gap-3">
                        <div className="shrink-0 bg-[#17140F] text-white w-8 h-8 rounded-full flex items-center justify-center font-serif font-bold">L</div>
                        <div>
                            <p className="text-xs font-bold uppercase text-[#17140F]/60 mb-1">Tu Realtor: Lianet Espinosa Ojeda</p>
                            <p className="text-sm text-[#17140F] italic leading-relaxed">"{step.realtorValue}"</p>
                        </div>
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
            <div className="p-6 pt-4 border-t bg-white mt-auto space-y-3">
                <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-[#17140F] font-bold text-md py-6 shadow-sm group justify-between rounded-full transition-all duration-300"
                >
                    <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 fill-current" />
                        Profundizar este paso con Agentes de IA
                    </span>
                    <ArrowRight className="w-4 h-4 opacity-70" />
                </Button>

                <Button 
                    variant="outline"
                    className="w-full border border-[#BDB2A4]/20 text-[#17140F] hover:bg-[#E5E1D8] text-sm py-5 rounded-lg transition-all duration-300"
                >
                   <MessageSquare className="w-4 h-4 mr-2" />
                   Hablar con mi Realtor – Lianet Espinosa Ojeda
                </Button>
            </div>
        </div>
    );
}
