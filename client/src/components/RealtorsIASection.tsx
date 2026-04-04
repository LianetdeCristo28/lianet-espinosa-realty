import { motion } from "framer-motion";
import { Bot, Settings, Database, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const cards = [
  {
    icon: Bot,
    title: "Automatización con IA",
    desc: "Flujos inteligentes que trabajan 24/7 por ti.",
  },
  {
    icon: Settings,
    title: "Implementación n8n",
    desc: "Workflows personalizados sin código complejo.",
  },
  {
    icon: Database,
    title: "CRM con Supabase",
    desc: "Base de datos real, tus leads bajo control total.",
  },
  {
    icon: UserCircle,
    title: "Agente Ana",
    desc: "Tu asistente IA que responde, califica y agenda por ti.",
  },
];

interface RealtorsIASectionProps {
  onScheduleConsultancy?: () => void;
}

export const RealtorsIASection = ({ onScheduleConsultancy }: RealtorsIASectionProps) => {

  return (
    <section id="realtors-ia" className="py-12 sm:py-16 md:py-24 bg-[#17140F] text-[#F8F6F2]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-primary font-bold tracking-[0.15em] uppercase text-sm mb-4 block">Realtors IA</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#F8F6F2] mb-6">
            Realtors: Trabaja con IA, Escala sin Límites
          </h2>
          <p className="text-xl text-[#F8F6F2]/60">
            Automatiza tu negocio, elimina tareas repetitivas y enfócate en cerrar más.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-2xl border border-white/10 hover:ring-2 hover:ring-[#D2B463] transition-all duration-300"
                data-testid={`card-realtor-ia-${i + 1}`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#D2B463]/10 flex items-center justify-center text-[#D2B463] mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-[#F8F6F2] text-lg mb-2">{card.title}</h3>
                <p className="text-sm text-[#F8F6F2]/60 leading-relaxed">{card.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <Button
            data-testid="button-agendar-consultoria"
            onClick={onScheduleConsultancy ?? undefined}
            disabled={!onScheduleConsultancy}
            className="bg-[#D2B463] text-[#17140F] hover:bg-[#D2B463]/90 text-xl px-12 py-8 rounded-full shadow-lg hover:scale-105 transition-all disabled:opacity-50"
          >
            Agendar Consultoría de IA
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
