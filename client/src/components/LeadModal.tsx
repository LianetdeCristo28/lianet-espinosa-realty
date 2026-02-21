import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2, Shield, Database, Filter, Sparkles, KeyRound, ArrowUpRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";

type LeadContext = "comprador" | "vendedor" | "inversionista" | "busqueda" | "general";

interface LeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context?: LeadContext;
}

const cities = ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale", "Otra"];
const budgets = ["$100K-200K", "$200K-300K", "$300K-400K", "$400K-500K", "$500K-750K", "$750K-1M", "$1M+"];
const bedroomOptions = ["1", "2", "3", "4", "5+"];

const contextToProfile: Record<string, string> = {
  comprador: "comprador",
  vendedor: "vendedor",
  inversionista: "inversionista",
  busqueda: "comprador",
  general: "",
};

const contextTitles: Record<string, { title: string; desc: string }> = {
  comprador: { title: "Comienza tu Proceso de Compra", desc: "Cuéntanos sobre tu búsqueda ideal." },
  vendedor: { title: "Solicita tu Análisis CMA", desc: "Recibe una evaluación gratuita del valor de tu propiedad." },
  inversionista: { title: "Evalúa tu Oportunidad", desc: "Comparte los detalles de tu interés de inversión." },
  busqueda: { title: "Accede a Propiedades Activas", desc: "Déjanos tus datos para enviarte listados personalizados." },
  general: { title: "Hablemos de tus Metas", desc: "Déjanos tus datos y nos comunicaremos contigo en menos de 24 horas." },
};

const inputClass = "w-full bg-white border border-[#BDB2A4]/20 rounded-lg p-3 outline-none focus:border-[#D2B463] transition-all duration-300 shadow-sm text-[#17140F] text-sm";

type RedirectPhase = "idle" | "loading" | "complete" | "redirecting";

interface TransitionStage {
  label: string;
  icon: React.ReactNode;
  duration: number;
}

const scaleIn = {
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] },
};

const RedirectTransition = ({ city, loftyUrl }: { city: string; loftyUrl: string }) => {
  const urlRef = useRef(loftyUrl);
  const [phase, setPhase] = useState<RedirectPhase>("loading");
  const [currentStage, setCurrentStage] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  console.log("RedirectTransition URL:", urlRef.current);

  const stages: TransitionStage[] = [
    { label: "Verificando tu perfil", icon: <Shield className="w-4 h-4" />, duration: 800 },
    { label: "Conectando con Stellar MLS", icon: <Database className="w-4 h-4" />, duration: 1000 },
    { label: `Filtrando propiedades en ${city || "Florida"}`, icon: <Filter className="w-4 h-4" />, duration: 1200 },
    { label: "Preparando resultados personalizados", icon: <Sparkles className="w-4 h-4" />, duration: 900 },
  ];

  useEffect(() => {
    if (phase !== "loading" || currentStage < 0) return;

    if (currentStage >= stages.length) {
      setPhase("complete");
      const t = setTimeout(() => {
        setPhase("redirecting");
      }, 1200);
      return () => clearTimeout(t);
    }

    const stage = stages[currentStage];
    let progress = 0;
    const step = 100 / (stage.duration / 30);

    progressInterval.current = setInterval(() => {
      progress += step;
      setStageProgress(Math.min(progress, 100));

      if (progress >= 100) {
        if (progressInterval.current) clearInterval(progressInterval.current);
        setCompletedStages((prev) => [...prev, currentStage]);
        setTimeout(() => {
          setCurrentStage((prev) => prev + 1);
          setStageProgress(0);
        }, 200);
      }
    }, 30);

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [phase, currentStage]);

  const totalProgress =
    phase === "complete" || phase === "redirecting"
      ? 100
      : ((completedStages.length + stageProgress / 100) / stages.length) * 100;

  if (phase === "redirecting") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
        className="text-center space-y-6 py-4"
      >
        <div className="w-16 h-16 bg-[#17140F] rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(210,180,99,0.25)]">
          <KeyRound className="w-8 h-8 text-[#D2B463]" />
        </div>

        <div>
          <h3 className="text-2xl font-serif font-bold text-[#17140F]">
            Tu búsqueda está lista
          </h3>
          <p className="text-[#BDB2A4] mt-2">
            Encontramos propiedades en {city || "Florida"} que coinciden con tus criterios
          </p>
        </div>

        <a
          href={urlRef.current}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="link-ver-propiedades"
          className="inline-flex items-center justify-center gap-3 w-full bg-[#D2B463] text-[#17140F] font-bold text-lg px-8 py-5 rounded-full hover:bg-[#D2B463]/90 hover:scale-[1.02] transition-all shadow-lg shadow-[#D2B463]/25 no-underline"
        >
          Ver Mis Propiedades
          <ArrowUpRight className="w-5 h-5" />
        </a>

        <div className="flex items-center justify-center gap-2 text-xs text-[#BDB2A4]">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          Stellar MLS · Datos verificados en tiempo real
        </div>
      </motion.div>
    );
  }

  return (
    <div className="py-2">
      <div className="text-center mb-6">
        <motion.div
          {...scaleIn}
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-all duration-500 ${
            phase === "complete"
              ? "bg-[#17140F] text-[#D2B463] shadow-[0_0_30px_rgba(210,180,99,0.25)]"
              : "bg-gradient-to-br from-[#F8F6F2] to-[#E5E1D8] text-[#17140F]"
          }`}
        >
          {phase === "complete" ? (
            <KeyRound className="w-7 h-7" />
          ) : (
            <Loader2 className="w-7 h-7 animate-spin" />
          )}
        </motion.div>

        <h3 className="text-xl font-serif font-bold text-[#17140F] mb-1">
          {phase === "complete" ? "Búsqueda personalizada lista" : "Preparando tu búsqueda"}
        </h3>
        <p className="text-sm text-[#BDB2A4]">
          {phase === "complete"
            ? `Propiedades en ${city || "Florida"}`
            : "Conectando con el mercado de Florida en tiempo real"}
        </p>
      </div>

      <div className="h-1 rounded-full bg-[#F0EDE8] mb-6 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#D2B463] to-[#CBB29B]"
          initial={{ width: "0%" }}
          animate={{ width: `${totalProgress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      <div className="space-y-1.5">
        {stages.map((stage, i) => {
          const isCompleted = completedStages.includes(i);
          const isActive = currentStage === i && phase === "loading";
          const isPending = !isCompleted && !isActive;

          return (
            <motion.div
              key={i}
              initial={isActive ? { opacity: 0, y: 12 } : false}
              animate={{ opacity: isPending && phase === "loading" ? 0.35 : 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all ${
                isActive ? "bg-[#F8F6F2]" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  isCompleted
                    ? "bg-[#17140F] text-[#D2B463]"
                    : isActive
                    ? "bg-[#E5E1D8] text-[#17140F]"
                    : "bg-[#F5F3EF] text-[#BDB2A4]"
                }`}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </motion.div>
                ) : (
                  stage.icon
                )}
              </div>

              <span
                className={`text-sm flex-1 transition-all duration-300 ${
                  isCompleted || isActive ? "text-[#17140F] font-medium" : "text-[#BDB2A4]"
                }`}
              >
                {stage.label}
              </span>

              {isActive && (
                <div className="w-12 h-[3px] rounded-full bg-[#E5E1D8] overflow-hidden">
                  <motion.div
                    className="h-full bg-[#D2B463] rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${stageProgress}%` }}
                    transition={{ duration: 0.05, ease: "linear" }}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 pt-3.5 border-t border-[#BDB2A4]/15 flex items-center justify-center gap-2">
        <div
          className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
            phase === "complete" ? "bg-green-400" : "bg-[#D2B463]"
          }`}
        />
        <span className="text-[11px] text-[#BDB2A4] tracking-wide">
          Stellar MLS · Datos verificados en tiempo real
        </span>
      </div>
    </div>
  );
};

function buildLoftyURL(filters: { city?: string; maxPrice?: string; beds?: string }): string {
  const base = "https://lianetespinosaojeda.expportal.com";

  if (!filters.city && !filters.maxPrice && !filters.beds) {
    return `${base}/listing`;
  }

  const condition: Record<string, unknown> = {};

  if (filters.city && filters.city !== "Otra") {
    condition.location = { city: [`${filters.city}, FL`] };
  }

  if (filters.maxPrice) {
    condition.price = `,${filters.maxPrice}`;
  }

  if (filters.beds) {
    condition.beds = `${filters.beds},`;
  }

  const params = new URLSearchParams({
    listingSource: "all listings",
    condition: JSON.stringify(condition),
    uiConfig: "{}",
    zoom: "13",
    page: "1",
  });

  return `${base}/listing?${params.toString()}`;
}

function parseBudgetToNumber(budget: string): string {
  const parts = budget.replace(/\$/g, "").split("-");
  const maxPart = parts.length > 1 ? parts[1] : parts[0];
  if (maxPart.includes("M") || maxPart.includes("m")) {
    return String(parseFloat(maxPart.replace(/[^0-9.]/g, "")) * 1000000);
  }
  if (maxPart.includes("K") || maxPart.includes("k")) {
    return String(parseFloat(maxPart.replace(/[^0-9.]/g, "")) * 1000);
  }
  return "";
}

export const LeadModal = ({ open, onOpenChange, context = "general" }: LeadModalProps) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [pool, setPool] = useState(false);
  const [profileType, setProfileType] = useState(contextToProfile[context] || "");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [showRedirectTransition, setShowRedirectTransition] = useState(false);
  const loftyUrlRef = useRef<string>("https://lianetespinosaojeda.expportal.com/listing");

  useEffect(() => {
    setProfileType(contextToProfile[context] || "");
  }, [context]);

  const mutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await apiRequest("POST", "/api/leads", data);
      return res.json();
    },
    onSuccess: () => {
      if (context === "busqueda" || context === "general") {
        setShowRedirectTransition(true);
      } else {
        setSubmitted(true);
      }
    },
  });

  const validateEmail = (val: string) => {
    if (!val) return "El correo es obligatorio";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Formato de correo inválido";
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) {
      setEmailError(err);
      return;
    }
    setEmailError("");

    loftyUrlRef.current = buildLoftyURL({
      city: city || undefined,
      maxPrice: budget ? parseBudgetToNumber(budget) : undefined,
      beds: bedrooms ? bedrooms.replace("+", "") : undefined,
    });
    console.log("Lofty URL guardada:", loftyUrlRef.current);

    mutation.mutate({
      fullName,
      email,
      phone: phone || null,
      source: context === "general" ? "lead_modal" : `lead_modal_${context}`,
      city: city || null,
      budget: budget || null,
      bedrooms: bedrooms || null,
      pool: pool ? "si" : "no",
      profileType: profileType || null,
      propertyAddress: propertyAddress || null,
      message: message || null,
    });
  };

  const reset = () => {
    setFullName("");
    setEmail("");
    setPhone("");
    setCity("");
    setBudget("");
    setBedrooms("");
    setPool(false);
    setProfileType(contextToProfile[context] || "");
    setPropertyAddress("");
    setMessage("");
    setSubmitted(false);
    setEmailError("");
    setShowRedirectTransition(false);
    mutation.reset();
  };

  const handleClose = (val: boolean) => {
    onOpenChange(val);
    if (!val) setTimeout(reset, 300);
  };

  const info = contextTitles[context] || contextTitles.general;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-[#F8F6F2] border border-[#BDB2A4]/20 p-0 overflow-hidden shadow-lg rounded-2xl max-h-[90vh] overflow-y-auto">
        {!showRedirectTransition && (
          <div className="bg-[#17140F] p-6 text-[#F8F6F2] text-center sticky top-0 z-10">
            <DialogTitle className="text-2xl font-serif font-bold text-white">
              {info.title}
            </DialogTitle>
            <DialogDescription className="text-white/70 mt-2">
              {info.desc}
            </DialogDescription>
          </div>
        )}

        {showRedirectTransition && (
          <DialogTitle className="sr-only">Buscando propiedades</DialogTitle>
        )}

        <div className="p-6 md:p-8">
          {showRedirectTransition ? (
            <RedirectTransition city={city} loftyUrl={loftyUrlRef.current} />
          ) : submitted ? (
            <div className="text-center space-y-4 py-6">
              <div className="w-16 h-16 bg-[#D2B463]/20 rounded-full flex items-center justify-center mx-auto text-[#D2B463]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#17140F]" data-testid="text-lead-success">¡Perfecto!</h3>
              <p className="text-[#17140F]/70">En breve un experto se pondrá en contacto contigo.</p>
              <Button
                data-testid="button-lead-close"
                onClick={() => handleClose(false)}
                className="mt-4 bg-[#D2B463] hover:bg-[#D2B463]/90 text-[#17140F] font-bold py-4 px-8 rounded-full shadow-sm transition-all duration-300"
              >
                Cerrar
              </Button>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#17140F]">Nombre completo <span className="text-red-400">*</span></label>
                <input
                  data-testid="input-lead-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputClass}
                  placeholder="Tu nombre completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#17140F]">Correo electrónico <span className="text-red-400">*</span></label>
                <input
                  data-testid="input-lead-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                  className={`${inputClass} ${emailError ? "border-red-400" : ""}`}
                  placeholder="correo@ejemplo.com"
                  required
                />
                {emailError && <p className="text-red-400 text-xs">{emailError}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#17140F]">Teléfono <span className="text-[#BDB2A4] text-xs">(opcional)</span></label>
                <input
                  data-testid="input-lead-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#17140F]">Ciudad de interés</label>
                  <select
                    data-testid="select-lead-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Seleccionar</option>
                    {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#17140F]">Presupuesto máx.</label>
                  <select
                    data-testid="select-lead-budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Seleccionar</option>
                    {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#17140F]">Habitaciones</label>
                  <select
                    data-testid="select-lead-bedrooms"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Seleccionar</option>
                    {bedroomOptions.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-[#BDB2A4]/20">
                <Label htmlFor="pool-switch" className="text-sm font-medium text-[#17140F] cursor-pointer">¿Desea piscina?</Label>
                <Switch
                  id="pool-switch"
                  data-testid="switch-lead-pool"
                  checked={pool}
                  onCheckedChange={setPool}
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-[#17140F]">Tipo de perfil</label>
                <RadioGroup
                  value={profileType}
                  onValueChange={setProfileType}
                  className="grid grid-cols-2 gap-3"
                >
                  {[
                    { value: "comprador", label: "Comprador" },
                    { value: "vendedor", label: "Vendedor" },
                    { value: "inversionista", label: "Inversionista" },
                    { value: "realtor", label: "Realtor" },
                  ].map((opt) => (
                    <div
                      key={opt.value}
                      className="flex items-center space-x-2 border border-[#BDB2A4]/20 p-3 rounded-lg hover:bg-[#E5E1D8]/50 cursor-pointer transition-colors has-[:checked]:border-[#D2B463] has-[:checked]:bg-[#D2B463]/5"
                    >
                      <RadioGroupItem value={opt.value} id={`profile-${opt.value}`} className="text-[#D2B463]" />
                      <Label htmlFor={`profile-${opt.value}`} className="flex-1 cursor-pointer font-normal text-sm">{opt.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {(profileType === "vendedor" || context === "vendedor") && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#17140F]">Dirección de la propiedad</label>
                  <input
                    data-testid="input-lead-property-address"
                    type="text"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                    className={inputClass}
                    placeholder="123 Main St, Miami, FL 33101"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#17140F]">Mensaje adicional <span className="text-[#BDB2A4] text-xs">(opcional, máx. 500 caracteres)</span></label>
                <Textarea
                  data-testid="textarea-lead-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                  className="bg-white border border-[#BDB2A4]/20 rounded-lg outline-none focus:border-[#D2B463] transition-all duration-300 shadow-sm resize-none"
                  placeholder="Cuéntanos más sobre lo que buscas..."
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground text-right">{message.length}/500</p>
              </div>

              {mutation.isError && (
                <p className="text-red-500 text-sm text-center">Hubo un error. Por favor intenta de nuevo.</p>
              )}

              <Button
                data-testid="button-lead-submit"
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-[#D2B463] hover:bg-[#D2B463]/90 text-[#17140F] font-bold py-6 rounded-full text-lg shadow-lg shadow-[#D2B463]/20 transition-all duration-300"
              >
                {mutation.isPending ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Enviando...</> : "Enviar y Continuar"}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
