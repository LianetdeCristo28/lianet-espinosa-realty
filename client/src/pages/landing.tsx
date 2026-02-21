import React, { useState } from "react";
import { Staircase } from "@/components/Staircase";
import { DiagnosticModal } from "@/components/DiagnosticModal";
import { LeadCaptureModal } from "@/components/LeadCaptureModal";
import { Navbar } from "@/components/Navbar";
import { VendedoresSection } from "@/components/VendedoresSection";
import { InversionistasSection } from "@/components/InversionistasSection";
import { RealtorsIASection } from "@/components/RealtorsIASection";
import { PropertySearchSection } from "@/components/PropertySearchSection";
import { Footer } from "@/components/Footer";
import { ChatbotAna } from "@/components/ChatbotAna";
import { Button } from "@/components/ui/button";
import { ArrowDown, Check, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);

  const scrollToSteps = () => {
    const element = document.getElementById('compradores');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden pt-16">
      <Navbar />
      {/* 1) HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/hero-bg.png" 
            alt="Interior minimalista" 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F8F6F2] via-[#F8F6F2]/90 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8F6F2] via-transparent to-transparent z-10" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#E5E1D8] text-[#17140F] text-sm font-medium tracking-wide">
              Bienes Raíces de Alto Nivel
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-[#17140F] leading-[1.1] text-balance">
              Quieres comprar casa… <span className="text-muted-foreground italic font-normal text-4xl md:text-5xl block mt-2">pero nadie te explicó el camino.</span>
            </h1>
            
            <p className="text-lg text-muted-foreground/80 leading-relaxed max-w-xl text-balance">
              Comprar, vender o invertir no es difícil por falta de opciones. Es difícil cuando no tienes a un experto guiándote paso a paso con claridad.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={() => setDiagnosticOpen(true)}
                className="bg-primary text-primary-foreground text-lg px-8 py-7 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform hover:bg-primary/90"
              >
                👉 En qué paso estoy
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setLeadModalOpen(true)}
                className="text-foreground border-[#BDB2A4] text-lg px-8 py-7 rounded-full hover:bg-[#E5E1D8]"
              >
                Contactar a Lianet
              </Button>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4">
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-[#E5E1D8] border-2 border-[#F8F6F2]" />
                ))}
              </div>
              <p>+120 familias ayudadas este año</p>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce text-[#BDB2A4]">
          <ArrowDown className="w-6 h-6" />
        </div>
      </section>

      {/* Property Search Section */}
      <PropertySearchSection />

      {/* 2) PROBLEM SECTION */}
      <section className="py-24 bg-[#E5E1D8]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-16 text-[#17140F]">
            ¿Te suena familiar?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 text-left">
            {[
              "No sabes por dónde empezar y Google te confunde más.",
              "Te hablan en términos financieros que no entiendes.",
              "Tienes miedo de cometer un error que te cueste miles.",
              "Sientes que todos tus amigos avanzan menos tú."
            ].map((pain, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#F8F6F2] p-8 rounded-xl shadow-sm border border-[#BDB2A4]/20 hover:shadow-md transition-shadow"
              >
                <span className="text-red-400 text-xl mb-4 block">✕</span>
                <p className="text-lg font-medium text-[#17140F]">{pain}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 inline-block relative"
          >
            <p className="text-2xl md:text-3xl font-serif italic text-[#17140F]">
              “No estás fallando. Estás caminando sin un mapa.”
            </p>
            <div className="h-3 bg-primary/30 absolute bottom-1 left-0 right-0 -z-10 -rotate-1" />
          </motion.div>
        </div>
      </section>

      {/* 3) CORE SECTION (STAIRCASE) */}
      <section id="compradores" className="py-24 bg-[#F8F6F2] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">El Método</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#17140F] mb-6">
              El camino real para comprar tu casa
            </h2>
            <p className="text-xl text-muted-foreground">
              Una escalera clara. Un paso a la vez. Sin improvisar.
            </p>
          </div>

          <Staircase />
        </div>
      </section>

      {/* 4) SUPPORT SECTION */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
             <img src="/assets/key-hand.png" alt="Llaves de casa nueva" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-black/20" />
             <div className="absolute bottom-8 left-8 right-8 text-white">
               <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
                 <p className="text-lg italic font-serif">“Al fin alguien me explica el camino completo. Ya no tengo que adivinar qué hacer.”</p>
                 <p className="mt-4 text-sm font-bold">— Mariana y Carlos, compraron en 2024</p>
               </div>
             </div>
          </div>
          
          <div className="space-y-8">
            <h2 className="text-4xl font-serif font-bold text-[#17140F]">No tienes que caminar solo.</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Cada paso está pensado para darte claridad y seguridad. Nosotros nos encargamos de traducir el idioma bancario, negociar los precios y revisar las letras pequeñas.
            </p>
            
            <ul className="space-y-4">
              {[
                "Asesoría financiera real, no solo 'ventas'.",
                "Acceso a propiedades que no están en portales públicos.",
                "Negociación agresiva a tu favor.",
                "Acompañamiento hasta la firma (y después)."
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-lg text-[#17140F]">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5) FINAL CTA */}
      <section className="py-32 bg-[#17140F] text-[#F8F6F2] text-center px-6 relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#CBB29B]/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-10">
          <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
            No adivines el proceso. <br/>
            <span className="text-primary">Entiéndelo paso a paso.</span>
          </h2>
          
          <div className="flex flex-col items-center gap-6">
            <Button 
              onClick={() => setDiagnosticOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xl px-12 py-8 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-all w-full md:w-auto"
            >
              🟡 Descubre tu próximo paso
            </Button>
            <p className="text-sm text-white/40 uppercase tracking-widest">Sin compromiso • Gratis • 2 Minutos</p>
          </div>
        </div>
      </section>

      {/* NEW SECTIONS */}
      <VendedoresSection />
      <InversionistasSection />
      <RealtorsIASection />

      {/* Footer */}
      <Footer />

      {/* Diagnostic Modal */}
      <DiagnosticModal open={diagnosticOpen} onOpenChange={setDiagnosticOpen} />
      
      {/* Lead Capture Modal */}
      <LeadCaptureModal open={leadModalOpen} onOpenChange={setLeadModalOpen} />

      {/* Chatbot */}
      <ChatbotAna />

      {/* Floating CTA for Mobile */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 2 }}
        className="fixed bottom-6 left-6 right-6 z-40 md:hidden pointer-events-none"
      >
        <Button 
          onClick={() => setDiagnosticOpen(true)}
          className="w-full bg-[#17140F] text-white shadow-xl py-6 rounded-full font-bold pointer-events-auto"
        >
          ¿En qué paso estoy?
        </Button>
      </motion.div>
    </div>
  );
}
