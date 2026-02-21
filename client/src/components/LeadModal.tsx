import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

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

export const LeadModal = ({ open, onOpenChange, context = "general" }: LeadModalProps) => {
  const [name, setName] = useState("");
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

  useEffect(() => {
    setProfileType(contextToProfile[context] || "");
  }, [context]);

  const mutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await apiRequest("POST", "/api/leads", data);
      return res.json();
    },
    onSuccess: () => {
      setSubmitted(true);
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

    const interestMap: Record<string, string> = {
      comprador: "Quiero comprar",
      vendedor: "Quiero vender",
      inversionista: "Busco invertir",
      realtor: "Soy Realtor",
    };

    mutation.mutate({
      name,
      email,
      phone: phone || null,
      interest: interestMap[profileType] || "Consulta general",
      source: context === "general" ? "lead_modal" : `lead_modal_${context}`,
      city: city || null,
      budget: budget || null,
      bedrooms: bedrooms || null,
      pool,
      profileType: profileType || null,
      propertyAddress: propertyAddress || null,
      message: message || null,
    });
  };

  const reset = () => {
    setName("");
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
        <div className="bg-[#17140F] p-6 text-[#F8F6F2] text-center sticky top-0 z-10">
          <DialogTitle className="text-2xl font-serif font-bold text-white">
            {info.title}
          </DialogTitle>
          <DialogDescription className="text-white/70 mt-2">
            {info.desc}
          </DialogDescription>
        </div>

        <div className="p-6 md:p-8">
          {submitted ? (
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
