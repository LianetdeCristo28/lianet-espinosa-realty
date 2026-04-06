import { motion } from "framer-motion";
import { Bot, Settings, Database, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const cards = [
  {
    icon: Bot,
    title: "Tu negocio trabaja aunque tú no estés",
    desc: "Sistemas inteligentes que atienden leads, envían seguimientos y mueven tu pipeline — sin que hagas nada.",
  },
  {
    icon: Settings,
    title: "Nunca pierdas un lead por falta de seguimiento",
    desc: "Cada contacto recibe respuesta automática en minutos, no días. Más leads convertidos, sin esfuerzo extra.",
  },
  {
    icon: Database,
    title: "Todos tus clientes organizados, sin Excel",
    desc: "Un sistema claro donde ves quién está listo para comprar, quién necesita seguimiento y quién ya cerró.",
  },
  {
    icon: UserCircle,
    title: "Agente Ana",
    desc: "Tu asistente IA que responde, califica y agenda citas — sin que tú hagas nada.",
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

        <a
          href="https://ai-success.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full max-w-md mx-auto mt-10 mb-8 rounded-2xl overflow-hidden border border-[#C9A455]/30 hover:border-[#C9A455] transition-all duration-300 hover:shadow-[0_0_32px_rgba(201,164,85,0.2)] hover:-translate-y-1"
        >
          <div className="bg-[rgba(201,164,85,0.08)] p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C9A455]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <p className="text-[#C9A455] text-[11px] font-semibold uppercase tracking-[0.15em]">
                  APP DESPLEGADA
                </p>
                <h3 className="text-[#F7F3EC] font-bold text-lg leading-tight">
                  Real Estate Success AI
                </h3>
              </div>
            </div>
            <p className="text-[#F7F3EC]/60 text-sm leading-relaxed">
              El Top 1% de los Realtors Nunca Duerme. Califica leads,
              maneja objeciones y agenda citas automáticamente.
            </p>
            <div className="flex items-center gap-2 text-[#C9A455] text-sm font-semibold">
              <span>Acceder a la App</span>
              <span>→</span>
            </div>
          </div>
        </a>

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
