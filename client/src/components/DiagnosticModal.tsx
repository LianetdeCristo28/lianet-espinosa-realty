import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

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
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

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
    if (answers.stage === "exploring") return { step: 1, title: "Paso 1: Decisión", msg: "Estás en el inicio. Lo más importante ahora es definir qué quieres realmente." };
    if (answers.budget === "no" || answers.stage === "finance") return { step: 2, title: "Paso 2: Finanzas", msg: "Antes de enamorarte de una casa, necesitamos ver números reales." };
    if (answers.budget === "yes_approved" && answers.stage === "searching") return { step: 5, title: "Paso 5: Búsqueda", msg: "¡Estás listo para la acción! Necesitas una estrategia de búsqueda inteligente." };
    return { step: 4, title: "Paso 4: Estrategia", msg: "Tienes la intención, ahora necesitas el plan para no perder tiempo." };
  };

  const mutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await apiRequest("POST", "/api/leads", data);
      return res.json();
    },
    onSuccess: () => {
      setContactSubmitted(true);
    },
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = getResult();
    mutation.mutate({
      fullName: name,
      phone,
      email,
      source: "diagnostic",
      profileType: "comprador",
      message: `Diagnóstico: ${result.title} (Paso ${result.step})`,
      consentedAt: new Date().toISOString(),
    });
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setShowResult(false);
    setShowContactForm(false);
    setContactSubmitted(false);
    setName("");
    setPhone("");
    setEmail("");
    setAcceptedPrivacy(false);
    mutation.reset();
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
                  data-testid="button-diagnostic-next"
                  onClick={nextStep} 
                  disabled={!answers[questions[step].id]}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {step === questions.length - 1 ? "Ver Resultado" : "Siguiente"} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          ) : showContactForm ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              {contactSubmitted ? (
                <div className="text-center space-y-4 py-4">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-primary">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#17140F]">¡Listo!</h3>
                  <p className="text-[#17140F]/70">Te contactaremos pronto con un plan personalizado para tu {result?.title.toLowerCase()}.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <p className="text-sm text-[#17140F]/70 text-center">Déjanos tus datos para recibir orientación personalizada sobre tu <strong>{result?.title}</strong>.</p>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#17140F]">Nombre</label>
                    <input data-testid="input-diagnostic-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white border border-[#BDB2A4]/20 rounded-lg p-3 outline-none focus:border-primary transition-all duration-300 shadow-sm" placeholder="Tu nombre" required maxLength={100} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#17140F]">Teléfono</label>
                    <input data-testid="input-diagnostic-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-white border border-[#BDB2A4]/20 rounded-lg p-3 outline-none focus:border-primary transition-all duration-300 shadow-sm" placeholder="+1 (555) 000-0000" required maxLength={20} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#17140F]">Correo electrónico</label>
                    <input data-testid="input-diagnostic-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white border border-[#BDB2A4]/20 rounded-lg p-3 outline-none focus:border-primary transition-all duration-300 shadow-sm" placeholder="correo@ejemplo.com" required maxLength={254} />
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      data-testid="checkbox-diagnostic-privacy"
                      type="checkbox"
                      checked={acceptedPrivacy}
                      onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-[#BDB2A4]/40 text-[#D2B463] focus:ring-[#D2B463] accent-[#D2B463] cursor-pointer"
                    />
                    <span className="text-xs text-[#17140F]/60 leading-relaxed">
                      He leído y acepto la{" "}
                      <a href="/privacidad" target="_blank" rel="noopener noreferrer" className="text-[#D2B463] underline hover:text-[#D2B463]/80">
                        política de privacidad
                      </a>
                      . Autorizo el uso de mis datos para fines de contacto inmobiliario.
                    </span>
                  </label>
                  {mutation.isError && (
                    <p className="text-red-500 text-sm text-center">Hubo un error. Por favor intenta de nuevo.</p>
                  )}
                  <Button data-testid="button-diagnostic-submit" type="submit" disabled={mutation.isPending || !acceptedPrivacy} className="w-full bg-primary hover:bg-primary/90 text-[#17140F] font-bold py-5 rounded-full text-lg shadow-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    {mutation.isPending ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Enviando...</> : "Recibir mi plan"}
                  </Button>
                </form>
              )}
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

              <Button
                data-testid="button-diagnostic-cta"
                onClick={() => setShowContactForm(true)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6 shadow-lg shadow-primary/20"
              >
                Hablar con un Experto
              </Button>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
