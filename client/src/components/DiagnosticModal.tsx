import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface DiagnosticModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const questions = [
  {
    id: "stage",
    title: "¿En qué punto te sientes ahora mismo?",
    options: [
      { value: "exploring", label: "Solo estoy mirando, sin prisa" },
      { value: "finance", label: "Quiero comprar pero no sé si me alcanza" },
      { value: "searching", label: "Ya tengo el dinero, estoy buscando casa" },
      { value: "stuck", label: "He visto muchas pero ninguna me convence" }
    ]
  },
  {
    id: "budget",
    title: "¿Ya has hablado con un banco?",
    options: [
      { value: "no", label: "No, aún no" },
      { value: "yes_informal", label: "Sí, pero nada por escrito" },
      { value: "yes_approved", label: "Sí, tengo mi carta de pre-aprobación" }
    ]
  },
  {
    id: "timeline",
    title: "¿Cuándo te gustaría mudarte?",
    options: [
      { value: "asap", label: "Lo antes posible (1-3 meses)" },
      { value: "soon", label: "Este año (3-6 meses)" },
      { value: "future", label: "Estoy planificando para el futuro (+6 meses)" }
    ]
  }
];

export const DiagnosticModal = ({ open, onOpenChange }: DiagnosticModalProps) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [questions[step].id]: value });
  };

  const nextStep = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowResult(true);
    }
  };

  const getResult = () => {
    // Simple heuristic logic
    if (answers.stage === "exploring") return { step: 1, title: "Paso 1: Decisión", msg: "Estás en el inicio. Lo más importante ahora es definir qué quieres realmente." };
    if (answers.budget === "no" || answers.stage === "finance") return { step: 2, title: "Paso 2: Finanzas", msg: "Antes de enamorarte de una casa, necesitamos ver números reales." };
    if (answers.budget === "yes_approved" && answers.stage === "searching") return { step: 5, title: "Paso 5: Búsqueda", msg: "¡Estás listo para la acción! Necesitas una estrategia de búsqueda inteligente." };
    return { step: 4, title: "Paso 4: Estrategia", msg: "Tienes la intención, ahora necesitas el plan para no perder tiempo." };
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setShowResult(false);
  };

  const result = showResult ? getResult() : null;

  return (
    <Dialog open={open} onOpenChange={(val) => { onOpenChange(val); if(!val) setTimeout(reset, 300); }}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-[#F8F6F2]">
        <div className="bg-[#17140F] p-6 text-center">
           <h2 className="text-white font-serif text-xl">Diagnóstico Rápido</h2>
           <p className="text-white/60 text-sm mt-1">Descubre tu lugar en el mapa</p>
        </div>
        
        <div className="p-6">
          {!showResult ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">{questions[step].title}</h3>
                <RadioGroup onValueChange={handleAnswer} value={answers[questions[step].id]}>
                  {questions[step].options.map((opt) => (
                    <div key={opt.value} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors has-[:checked]:border-primary has-[:checked]:bg-secondary">
                      <RadioGroupItem value={opt.value} id={opt.value} className="text-primary" />
                      <Label htmlFor={opt.value} className="flex-1 cursor-pointer font-normal">{opt.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex justify-between items-center pt-4">
                <span className="text-xs text-muted-foreground">Paso {step + 1} de {questions.length}</span>
                <Button 
                  onClick={nextStep} 
                  disabled={!answers[questions[step].id]}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {step === questions.length - 1 ? "Ver Resultado" : "Siguiente"} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          ) : (
             <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 py-4"
            >
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-primary">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              
              <div>
                <h3 className="text-2xl font-serif font-bold text-foreground">{result?.title}</h3>
                <p className="text-muted-foreground mt-2 px-4">{result?.msg}</p>
              </div>

              <div className="bg-secondary/50 p-4 rounded-lg mx-4 text-left">
                <p className="text-sm font-semibold mb-2">Tu siguiente paso recomendado:</p>
                <p className="text-sm opacity-90">Agendar una llamada de claridad de 15 minutos para trazar tu {result?.title.toLowerCase()}.</p>
              </div>

              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6 shadow-lg shadow-primary/20">
                Hablar con un Experto
              </Button>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
