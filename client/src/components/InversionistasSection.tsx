import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LeadModal } from "@/components/LeadModal";
import { TrendingUp, Banknote, Building, Home, Hammer } from "lucide-react";

const metrics = [
  {
    icon: TrendingUp,
    title: "ROI",
    desc: "Retorno real ajustado a costos y mercado.",
  },
  {
    icon: Banknote,
    title: "Cash Flow",
    desc: "Flujo positivo desde el primer mes.",
  },
  {
    icon: Building,
    title: "Appreciation",
    desc: "Valorización proyectada por zona y tendencias.",
  },
  {
    icon: Home,
    title: "Rental Strategy",
    desc: "Long-term y short-term (Airbnb) evaluados.",
  },
  {
    icon: Hammer,
    title: "Flip Strategy",
    desc: "Identifica, renueva y vende con margen calculado.",
  },
];

export const InversionistasSection = () => {
  const [leadOpen, setLeadOpen] = useState(false);

  return (
    <section id="inversionistas" className="py-24 bg-[#F8F6F2]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Inversionistas</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#17140F] mb-6">
            Inversión Inmobiliaria con Visión Estratégica
          </h2>
          <p className="text-xl text-muted-foreground">
            Florida sigue siendo uno de los mercados más dinámicos de EE.UU. Invierte con datos.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            {metrics.map((metric, i) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white p-5 rounded-xl border border-[#BDB2A4]/20 hover:shadow-md transition-all duration-300"
                  data-testid={`card-investor-metric-${i + 1}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-[#D2B463]/10 flex items-center justify-center text-[#D2B463] shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif font-bold text-[#17140F] text-lg">{metric.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-12">{metric.desc}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#17140F] text-white rounded-2xl p-10 flex flex-col justify-between min-h-[480px]"
          >
            <div className="space-y-6">
              <p className="font-serif text-2xl leading-relaxed text-balance">
                "El mercado premia a quienes actúan con información, no con impulso."
              </p>
              <p className="text-white/60 leading-relaxed">
                Analizamos cada oportunidad con datos de mercado actualizados, proyecciones de rentabilidad y evaluación de riesgo para que tu capital trabaje de forma inteligente.
              </p>
            </div>

            <Button
              data-testid="button-evaluar-inversion"
              onClick={() => setLeadOpen(true)}
              className="bg-[#D2B463] text-[#17140F] hover:bg-[#D2B463]/90 text-lg px-8 py-7 rounded-full font-bold shadow-lg hover:scale-105 transition-all mt-8 w-full"
            >
              Evaluar Mi Oportunidad de Inversión
            </Button>
          </motion.div>
        </div>
      </div>

      <LeadModal open={leadOpen} onOpenChange={setLeadOpen} context="inversionista" />
    </section>
  );
};
