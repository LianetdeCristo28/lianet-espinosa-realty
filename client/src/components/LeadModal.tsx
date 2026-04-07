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
import { trackEvent } from "@/lib/analytics";
import { motion } from "framer-motion";

type LeadContext = "comprador" | "vendedor" | "inversionista" | "busqueda" | "general";

export interface SearchFilters {
  city?: string;
  maxPrice?: string;
  beds?: string;
}

interface LeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context?: LeadContext;
  onLeadCaptured?: () => void;
  searchFilters?: SearchFilters;
}

import { LOFTY_PORTAL_BASE, LOFTY_LISTING_BASE } from "@shared/constants";

const cities = ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale", "Kissimmee", "Daytona Beach", "Naples", "Otra"];
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
  busqueda: { title: "Accede a Propiedades Activas", desc: "Déjanos tus datos para ver listados personalizados." },
  general: { title: "Hablemos de tus Metas", desc: "Déjanos tus datos y nos comunicaremos contigo en menos de 24 horas." },
};

const inputClass = "w-full bg-white border border-[#BDB2A4]/20 rounded-lg p-3 outline-none focus:border-[#D2B463] transition-all duration-300 shadow-sm text-[#17140F] text-sm";

// ─── URL Builder ─────────────────────────────────────────────
function buildLoftyURL(filters: SearchFilters): string {
  if (!filters.city && !filters.maxPrice && !filters.beds) {
    return LOFTY_LISTING_BASE;
  }

  const condition: Record<string, unknown> = {};

  if (filters.city && filters.city !== "Otra") {
    condition.location = { city: [`${filters.city}, FL`] };
  }
  if (filters.maxPrice) {
    const num = parsePriceToNumber(filters.maxPrice);
    if (num) condition.price = `,${num}`;
  }
  if (filters.beds) {
    condition.beds = `${filters.beds.replace("+", "")},`;
  }

  if (Object.keys(condition).length === 0) {
    return LOFTY_LISTING_BASE;
  }

  const params = new URLSearchParams({
    listingSource: "all listings",
    condition: JSON.stringify(condition),
    uiConfig: "{}",
    zoom: "13",
    page: "1",
  });

  return `${LOFTY_LISTING_BASE}?${params.toString()}`;
}

function parsePriceToNumber(val: string): string {
  if (/^\d+$/.test(val)) return val;
  const parts = val.replace(/\$/g, "").split("-");
  const maxPart = parts.length > 1 ? parts[1] : parts[0];
  if (/[Mm]/.test(maxPart)) return String(parseFloat(maxPart.replace(/[^0-9.]/g, "")) * 1000000);
  if (/[Kk]/.test(maxPart)) return String(parseFloat(maxPart.replace(/[^0-9.]/g, "")) * 1000);
  return val.replace(/[^0-9]/g, "") || "";
}

// ─── Redirect Transition ─────────────────────────────────────
type RedirectPhase = "loading" | "complete";

const RedirectTransition = ({ city, loftyUrl }: { city: string; loftyUrl: string }) => {
  const [phase, setPhase] = useState<RedirectPhase>("loading");
  const [currentStage, setCurrentStage] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const stages = [
    { label: "Verificando tu perfil", icon: <Shield className="w-4 h-4" />, duration: 800 },
    { label: "Conectando con Stellar MLS", icon: <Database className="w-4 h-4" />, duration: 1000 },
    { label: `Filtrando propiedades en ${city || "Florida"}`, icon: <Filter className="w-4 h-4" />, duration: 1200 },
    { label: "Preparando resultados personalizados", icon: <Sparkles className="w-4 h-4" />, duration: 900 },
  ];

  useEffect(() => {
    if (phase !== "loading") return;
    if (currentStage >= stages.length) { setPhase("complete"); return; }

    const stage = stages[currentStage];
    let progress = 0;
    const step = 100 / (stage.duration / 30);

    progressInterval.current = setInterval(() => {
      progress += step;
      setStageProgress(Math.min(progress, 100));
      if (progress >= 100) {
        if (progressInterval.current) clearInterval(progressInterval.current);
        setCompletedStages((prev) => [...prev, currentStage]);
        setTimeout(() => { setCurrentStage((prev) => prev + 1); setStageProgress(0); }, 200);
      }
    }, 30);

    return () => { if (progressInterval.current) clearInterval(progressInterval.current); };
  }, [phase, currentStage]);

  const totalProgress = phase === "complete" ? 100 : ((completedStages.length + stageProgress / 100) / stages.length) * 100;

  if (phase === "complete") {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="text-center space-y-6 py-4">
        <div className="w-16 h-16 bg-[#17140F] rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(210,180,99,0.25)]">
          <KeyRound className="w-8 h-8 text-[#D2B463]" />
        </div>
        <div>
          <h3 className="text-2xl font-serif font-bold text-[#17140F]">Tu búsqueda está lista</h3>
          <p className="text-[#BDB2A4] mt-2">Propiedades disponibles en {city || "Florida"}</p>
        </div>
        <a href={loftyUrl} target="_blank" rel="noopener noreferrer" data-testid="link-ver-propiedades"
          className="inline-flex items-center justify-center gap-3 w-full bg-[#D2B463] text-[#17140F] font-bold text-lg px-8 py-5 rounded-full hover:bg-[#D2B463]/90 hover:scale-[1.02] transition-all shadow-lg shadow-[#D2B463]/25 no-underline">
          Ver Mis Propiedades <ArrowUpRight className="w-5 h-5" />
        </a>
        <p className="text-xs text-[#BDB2A4]">Se abrirá tu portal de propiedades en una nueva pestaña</p>
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
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-gradient-to-br from-[#F8F6F2] to-[#E5E1D8] text-[#17140F]">
          <Loader2 className="w-7 h-7 animate-spin" />
        </motion.div>
        <h3 className="text-xl font-serif font-bold text-[#17140F] mb-1">Preparando tu búsqueda</h3>
        <p className="text-sm text-[#BDB2A4]">Conectando con el mercado de Florida en tiempo real</p>
      </div>
      <div className="h-1 rounded-full bg-[#F0EDE8] mb-6 overflow-hidden">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-[#D2B463] to-[#CBB29B]" initial={{ width: "0%" }} animate={{ width: `${totalProgress}%` }} transition={{ duration: 0.3 }} />
      </div>
      <div className="space-y-1.5">
        {stages.map((stage, i) => {
          const isCompleted = completedStages.includes(i);
          const isActive = currentStage === i && phase === "loading";
          const isPending = !isCompleted && !isActive;
          return (
            <motion.div key={i} initial={isActive ? { opacity: 0, y: 12 } : false} animate={{ opacity: isPending ? 0.35 : 1, y: 0 }} transition={{ duration: 0.4 }}
              className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all ${isActive ? "bg-[#F8F6F2]" : ""}`}>
              <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isCompleted ? "bg-[#17140F] text-[#D2B463]" : isActive ? "bg-[#E5E1D8] text-[#17140F]" : "bg-[#F5F3EF] text-[#BDB2A4]"}`}>
                {isCompleted ? <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15 }}><CheckCircle2 className="w-4 h-4" /></motion.div> : stage.icon}
              </div>
              <span className={`text-sm flex-1 transition-all duration-300 ${isCompleted || isActive ? "text-[#17140F] font-medium" : "text-[#BDB2A4]"}`}>{stage.label}</span>
              {isActive && (
                <div className="w-12 h-[3px] rounded-full bg-[#E5E1D8] overflow-hidden">
                  <motion.div className="h-full bg-[#D2B463] rounded-full" initial={{ width: "0%" }} animate={{ width: `${stageProgress}%` }} transition={{ duration: 0.05 }} />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
      <div className="mt-6 pt-3.5 border-t border-[#BDB2A4]/15 flex items-center justify-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#D2B463]" />
        <span className="text-[11px] text-[#BDB2A4] tracking-wide">Stellar MLS · Datos verificados en tiempo real</span>
      </div>
    </div>
  );
};

// ─── Main Modal ──────────────────────────────────────────────
export const LeadModal = ({ open, onOpenChange, context = "general", onLeadCaptured, searchFilters }: LeadModalProps) => {
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
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [showRedirectTransition, setShowRedirectTransition] = useState(false);
  const loftyUrlRef = useRef<string>(LOFTY_LISTING_BASE);

  useEffect(() => {
    if (open && searchFilters) {
      if (searchFilters.city) setCity(searchFilters.city);
      if (searchFilters.beds) setBedrooms(searchFilters.beds);
      loftyUrlRef.current = buildLoftyURL(searchFilters);
    }
  }, [open, searchFilters]);

  useEffect(() => { setProfileType(contextToProfile[context] || ""); }, [context]);

  const mutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await apiRequest("POST", "/api/leads", data);
      return res.json();
    },
    onSuccess: () => {
      trackEvent("lead_submitted", { source: context || "direct" });
      onLeadCaptured?.();
      if (context === "busqueda") {
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
    if (err) { setEmailError(err); return; }
    setEmailError("");

    const finalFilters: SearchFilters = {
      city: searchFilters?.city || city || undefined,
      maxPrice: searchFilters?.maxPrice || (budget ? parsePriceToNumber(budget) : undefined),
      beds: searchFilters?.beds || (bedrooms ? bedrooms.replace("+", "") : undefined),
    };

    loftyUrlRef.current = buildLoftyURL(finalFilters);

    mutation.mutate({
      fullName,
      email,
      phone: phone || null,
      source: context === "busqueda" ? "busqueda-idx" : context === "general" ? "lead_modal" : `lead_modal_${context}`,
      city: finalFilters.city || null,
      budget: budget || (searchFilters?.maxPrice ? `$${Number(searchFilters.maxPrice).toLocaleString()}` : null),
      bedrooms: finalFilters.beds || null,
      pool: pool ? "si" : "no",
      profileType: profileType || null,
      propertyAddress: propertyAddress || null,
      message: context === "busqueda"
        ? `Búsqueda IDX: ${finalFilters.city || "Florida"}, Max $${finalFilters.maxPrice ? Number(finalFilters.maxPrice).toLocaleString() : "Sin límite"}, ${finalFilters.beds || "Cualquier"}+ hab`
        : message || null,
      consentedAt: new Date().toISOString(),
    });
  };

  const reset = () => {
    setFullName(""); setEmail(""); setPhone(""); setCity(""); setBudget(""); setBedrooms("");
    setPool(false); setProfileType(contextToProfile[context] || ""); setPropertyAddress("");
    setMessage(""); setSubmitted(false); setEmailError(""); setAcceptedPrivacy(false); setShowRedirectTransition(false);
    loftyUrlRef.current = LOFTY_LISTING_BASE;
    mutation.reset();
  };

  const handleClose = (val: boolean) => { onOpenChange(val); if (!val) setTimeout(reset, 300); };

  const info = contextTitles[context] || contextTitles.general;
  const isSearch = context === "busqueda";
  const displayCity = searchFilters?.city || city;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-[#F8F6F2] border border-[#BDB2A4]/20 p-0 overflow-hidden shadow-lg rounded-2xl max-h-[90vh] overflow-y-auto">
        {!showRedirectTransition && (
          <div className="bg-[#17140F] p-6 text-[#F8F6F2] text-center sticky top-0 z-10">
            <DialogTitle className="text-2xl font-serif font-bold text-white">{info.title}</DialogTitle>
            <DialogDescription className="text-white/70 mt-2">{info.desc}</DialogDescription>
          </div>
        )}
        {showRedirectTransition && <DialogTitle className="sr-only">Buscando propiedades</DialogTitle>}

        <div className="p-6 md:p-8">
          {showRedirectTransition ? (
            <RedirectTransition city={displayCity || ""} loftyUrl={loftyUrlRef.current} />
          ) : submitted ? (
            <div className="text-center space-y-4 py-6">
              <div className="w-16 h-16 bg-[#D2B463]/20 rounded-full flex items-center justify-center mx-auto text-[#D2B463]"><CheckCircle2 className="w-8 h-8" /></div>
              <h3 className="text-xl font-serif font-bold text-[#17140F]">¡Perfecto!</h3>
              <p className="text-[#17140F]/70">En breve un experto se pondrá en contacto contigo.</p>
              <Button onClick={() => handleClose(false)} className="mt-4 bg-[#D2B463] hover:bg-[#D2B463]/90 text-[#17140F] font-bold py-4 px-8 rounded-full">Cerrar</Button>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              {isSearch && searchFilters && (searchFilters.city || searchFilters.maxPrice || searchFilters.beds) && (
                <div className="bg-[#17140F]/5 border border-[#BDB2A4]/20 rounded-xl p-4 text-sm text-[#17140F]">
                  <p className="font-medium mb-1">Tu búsqueda:</p>
                  <p className="text-muted-foreground">
                    {searchFilters.city || "Florida"}
                    {searchFilters.maxPrice && ` · Hasta $${Number(searchFilters.maxPrice).toLocaleString()}`}
                    {searchFilters.beds && ` · ${searchFilters.beds}+ habitaciones`}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#17140F]">Nombre completo <span className="text-red-400">*</span></label>
                <input data-testid="input-lead-name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} placeholder="Tu nombre completo" required maxLength={100} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#17140F]">Correo electrónico <span className="text-red-400">*</span></label>
                <input data-testid="input-lead-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setEmailError(""); }} className={`${inputClass} ${emailError ? "border-red-400" : ""}`} placeholder="correo@ejemplo.com" required maxLength={254} />
                {emailError && <p className="text-red-400 text-xs">{emailError}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#17140F]">Teléfono <span className="text-[#BDB2A4] text-xs">(opcional)</span></label>
                <input data-testid="input-lead-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="+1 (555) 000-0000" maxLength={20} />
              </div>

              {!isSearch && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#17140F]">Ciudad</label>
                      <select data-testid="select-lead-city" value={city} onChange={(e) => setCity(e.target.value)} className={inputClass}>
                        <option value="">Seleccionar</option>
                        {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#17140F]">Presupuesto</label>
                      <select data-testid="select-lead-budget" value={budget} onChange={(e) => setBudget(e.target.value)} className={inputClass}>
                        <option value="">Seleccionar</option>
                        {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#17140F]">Habitaciones</label>
                      <select data-testid="select-lead-bedrooms" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className={inputClass}>
                        <option value="">Seleccionar</option>
                        {bedroomOptions.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-[#BDB2A4]/20">
                    <Label htmlFor="pool-switch" className="text-sm font-medium text-[#17140F] cursor-pointer">¿Desea piscina?</Label>
                    <Switch id="pool-switch" checked={pool} onCheckedChange={setPool} />
                  </div>
                </>
              )}

              <div className="space-y-3">
                <label className="text-sm font-medium text-[#17140F]">Tipo de perfil</label>
                <RadioGroup value={profileType} onValueChange={setProfileType} className="grid grid-cols-2 gap-3">
                  {[{ value: "comprador", label: "Comprador" }, { value: "vendedor", label: "Vendedor" }, { value: "inversionista", label: "Inversionista" }, { value: "realtor", label: "Realtor" }].map((opt) => (
                    <div key={opt.value} className="flex items-center space-x-2 border border-[#BDB2A4]/20 p-3 rounded-lg hover:bg-[#E5E1D8]/50 cursor-pointer transition-colors has-[:checked]:border-[#D2B463] has-[:checked]:bg-[#D2B463]/5">
                      <RadioGroupItem value={opt.value} id={`profile-${opt.value}`} className="text-[#D2B463]" />
                      <Label htmlFor={`profile-${opt.value}`} className="flex-1 cursor-pointer font-normal text-sm">{opt.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {(profileType === "vendedor" || context === "vendedor") && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#17140F]">Dirección de la propiedad</label>
                  <input type="text" value={propertyAddress} onChange={(e) => setPropertyAddress(e.target.value)} className={inputClass} placeholder="123 Main St, Miami, FL 33101" maxLength={200} />
                </div>
              )}

              {!isSearch && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#17140F]">Mensaje <span className="text-[#BDB2A4] text-xs">(opcional)</span></label>
                  <Textarea value={message} onChange={(e) => setMessage(e.target.value.slice(0, 500))} className="bg-white border border-[#BDB2A4]/20 rounded-lg outline-none focus:border-[#D2B463] shadow-sm resize-none" placeholder="Cuéntanos más..." rows={3} maxLength={500} />
                </div>
              )}

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  data-testid="checkbox-lead-privacy"
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

              {mutation.isError && <p className="text-red-500 text-sm text-center">Hubo un error. Intenta de nuevo.</p>}

              <Button type="submit" disabled={mutation.isPending || !acceptedPrivacy} className="w-full bg-[#D2B463] hover:bg-[#D2B463]/90 text-[#17140F] font-bold py-6 rounded-full text-lg shadow-lg shadow-[#D2B463]/20 disabled:opacity-50 disabled:cursor-not-allowed">
                {mutation.isPending ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Enviando...</> : isSearch ? "Ver Propiedades" : "Enviar y Continuar"}
              </Button>
              {isSearch && <p className="text-center text-xs text-muted-foreground">Al continuar, accederás a los listados del portal</p>}
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
