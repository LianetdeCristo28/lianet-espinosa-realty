import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LeadModal } from "@/components/LeadModal";
import { BarChart3, DollarSign, Camera, Handshake, CheckCircle } from "lucide-react";

const steps = [
  {
    num: 1,
    icon: BarChart3,
    title: "Evaluación de Mercado",
    desc: "CMA profesional con datos reales de tu zona.",
  },
  {
    num: 2,
    icon: DollarSign,
    title: "Estrategia de Precio",
    desc: "El precio correcto atrae las ofertas correctas.",
  },
  {
    num: 3,
    icon: Camera,
    title: "Marketing Profesional",
    desc: "Fotografía, videos, redes y MLS optimizado.",
  },
  {
    num: 4,
    icon: Handshake,
    title: "Negociación Experta",
    desc: "Defensa activa de tu precio y condiciones.",
  },
  {
    num: 5,
    icon: CheckCircle,
    title: "Cierre sin Sorpresas",
    desc: "Coordinación total hasta la mesa de cierre.",
  },
];

export const VendedoresSection = () => {
  const [leadOpen, setLeadOpen] = useState(false);

  return (
    <section id="vendedores" className="py-24 bg-[#E5E1D8]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-primary font-bold tracking-[0.15em] uppercase text-sm mb-4 block">Vendedores</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#17140F] mb-6">
            Vende Estratégicamente, No Solo Rápido
          </h2>
          <p className="text-xl text-muted-foreground">
            Maximiza tu ganancia con análisis de mercado y marketing de alto nivel.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#F8F6F2] p-6 rounded-xl border border-[#BDB2A4]/20 shadow-sm hover:-translate-y-2 hover:shadow-lg hover:border-[#D2B463] transition-all duration-300 group"
                data-testid={`card-seller-step-${step.num}`}
              >
                <span className="text-[#D2B463] font-bold text-3xl block mb-3">{step.num}</span>
                <div className="w-10 h-10 rounded-lg bg-[#D2B463]/10 flex items-center justify-center mb-4 text-[#D2B463] group-hover:bg-[#D2B463]/20 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-[#17140F] mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button
            data-testid="button-solicitar-cma"
            onClick={() => setLeadOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xl px-12 py-8 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            Solicitar Análisis CMA Gratuito
          </Button>
        </motion.div>
      </div>

      <LeadModal open={leadOpen} onOpenChange={setLeadOpen} context="vendedor" />
    </section>
  );
};
