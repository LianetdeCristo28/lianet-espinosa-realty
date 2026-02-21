import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const RealtorsIASection = () => {
  return (
    <section id="realtors-ia" className="py-24 bg-gradient-to-b from-[#F8F6F2] to-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white border border-[#BDB2A4]/20 rounded-3xl p-12 md:p-16 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
          
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-8 border border-[#BDB2A4]/20">
            <Sparkles className="w-8 h-8" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#17140F] mb-6">
            Conoce a tus Agentes de IA
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed text-balance">
            La experiencia de Lianet potenciada por inteligencia artificial. Obtén respuestas detalladas sobre tu paso actual en el proceso de compra, análisis rápido de mercado o simulación de escenarios 24/7.
          </p>
          
          <Button className="bg-[#17140F] text-white hover:bg-[#17140F]/90 text-lg px-8 py-6 rounded-full shadow-sm transition-all duration-300">
            Probar Asistente Virtual
          </Button>
        </motion.div>
      </div>
    </section>
  );
};