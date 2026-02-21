import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface LeadCaptureModalProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  context?: string;
}

export const LeadCaptureModal = ({ open, onOpenChange, context }: LeadCaptureModalProps) => {
  const defaultInterest = context === "comprador" ? "Quiero comprar" : context === "vendedor" ? "Quiero vender" : context === "inversionista" ? "Busco invertir" : "Quiero comprar";
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState(defaultInterest);
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: { name: string; phone: string; email: string; interest: string; source: string }) => {
      const res = await apiRequest("POST", "/api/leads", data);
      return res.json();
    },
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, phone, email, interest, source: "contact_form" });
  };

  const handleClose = (val: boolean) => {
    onOpenChange(val);
    if (!val) {
      setTimeout(() => {
        setName("");
        setPhone("");
        setEmail("");
        setInterest(defaultInterest);
        setSubmitted(false);
        mutation.reset();
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-[#F8F6F2] border border-[#BDB2A4]/20 p-0 overflow-hidden shadow-lg rounded-2xl">
        <div className="bg-[#17140F] p-6 text-[#F8F6F2] text-center">
            <DialogTitle className="text-2xl font-serif font-bold text-white">Hablemos de tus metas</DialogTitle>
            <DialogDescription className="text-white/70 mt-2">
              Déjanos tus datos y nos comunicaremos contigo en menos de 24 horas.
            </DialogDescription>
        </div>
        <div className="p-8">
          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-primary">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold text-[#17140F]">¡Recibimos tu solicitud!</h3>
              <p className="text-[#17140F]/70">Nos comunicaremos contigo en menos de 24 horas.</p>
              <Button onClick={() => handleClose(false)} className="mt-4 bg-primary hover:bg-primary/90 text-[#17140F] font-bold py-4 rounded-full shadow-sm transition-all duration-300">
                Cerrar
              </Button>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#17140F]">Nombre completo</label>
                <input data-testid="input-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white border border-[#BDB2A4]/20 rounded-lg p-3 outline-none focus:border-primary transition-all duration-300 shadow-sm" placeholder="Tu nombre" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#17140F]">Teléfono</label>
                <input data-testid="input-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-white border border-[#BDB2A4]/20 rounded-lg p-3 outline-none focus:border-primary transition-all duration-300 shadow-sm" placeholder="+1 (555) 000-0000" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#17140F]">Correo electrónico</label>
                <input data-testid="input-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white border border-[#BDB2A4]/20 rounded-lg p-3 outline-none focus:border-primary transition-all duration-300 shadow-sm" placeholder="correo@ejemplo.com" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#17140F]">¿En qué te podemos ayudar?</label>
                <select data-testid="select-interest" value={interest} onChange={(e) => setInterest(e.target.value)} className="w-full bg-white border border-[#BDB2A4]/20 rounded-lg p-3 outline-none focus:border-primary transition-all duration-300 shadow-sm text-[#17140F]">
                  <option>Quiero comprar</option>
                  <option>Quiero vender</option>
                  <option>Busco invertir</option>
                  <option>Otra consulta</option>
                </select>
              </div>
              {mutation.isError && (
                <p className="text-red-500 text-sm text-center">Hubo un error. Por favor intenta de nuevo.</p>
              )}
              <Button data-testid="button-submit-lead" type="submit" disabled={mutation.isPending} className="w-full bg-primary hover:bg-primary/90 text-[#17140F] font-bold py-6 mt-4 rounded-full text-lg shadow-sm transition-all duration-300">
                {mutation.isPending ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Enviando...</> : "Enviar Solicitud"}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
