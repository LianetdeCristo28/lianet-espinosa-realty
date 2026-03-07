import React, { useState, useRef, useEffect, lazy, Suspense } from "react";
import { Staircase } from "@/components/Staircase";
import { DiagnosticModal } from "@/components/DiagnosticModal";
import { LeadModal } from "@/components/LeadModal";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const VendedoresSection = lazy(() => import("@/components/VendedoresSection").then(m => ({ default: m.VendedoresSection })));
const InversionistasSection = lazy(() => import("@/components/InversionistasSection").then(m => ({ default: m.InversionistasSection })));
const RealtorsIASection = lazy(() => import("@/components/RealtorsIASection").then(m => ({ default: m.RealtorsIASection })));
const PropertySearchSection = lazy(() => import("@/components/PropertySearchSection").then(m => ({ default: m.PropertySearchSection })));
const ChatbotAna = lazy(() => import("@/components/ChatbotAna").then(m => ({ default: m.ChatbotAna })));
import { Button } from "@/components/ui/button";
import { ArrowDown, Check, Search, TrendingDown, Clock, Activity } from "lucide-react";
import { motion } from "framer-motion";

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{count.toLocaleString()}</>;
}

const LOFTY_BASE_URL = "https://lianetespinosaojeda.expportal.com/listing";

export default function LandingPage() {
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadContext, setLeadContext] = useState<string | undefined>();
  const [leadCaptured, setLeadCaptured] = useState(false);
  const heroLinkRef = useRef<HTMLAnchorElement>(null);

  const handleLeadCaptured = () => {
    setLeadCaptured(true);
    console.log("[Hero] Lead captured — future clicks go directly to:", LOFTY_BASE_URL);
  };

  const openLeadModal = (context?: string) => {
    setLeadContext(context);
    setLeadModalOpen(true);
  };

  const handleHeroExplorar = (e: React.MouseEvent) => {
    if (!leadCaptured) {
      e.preventDefault();
      console.log("[Hero] Lead not captured yet — opening LeadModal");
      openLeadModal("busqueda");
    } else {
      console.log("[Hero] Redirecting to:", LOFTY_BASE_URL);
    }
  };

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Navbar onContactClick={() => openLeadModal("general")} />
      <main className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden pt-16">

        {/* 1. HERO */}
        <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="/assets/hero-bg.png"
              alt="Vista de un interior moderno y luminoso en Florida"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#F8F6F2] via-[#F8F6F2]/90 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#F8F6F2] via-transparent to-transparent z-10" />
          </div>

          <svg className="absolute inset-0 z-[5] w-full h-full opacity-[0.04] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="geo-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M30 0 L60 30 L30 60 L0 30Z" fill="none" stroke="#17140F" strokeWidth="0.5" />
                <circle cx="30" cy="30" r="2" fill="#17140F" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#geo-pattern)" />
          </svg>

          <div className="relative z-20 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E5E1D8] text-[#17140F] text-sm font-medium tracking-wide">
                <Activity className="w-3.5 h-3.5 text-primary" />
                Conectado a Stellar MLS · Datos en tiempo real
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-[#17140F] leading-[1.1] text-balance">
                Tu Estrategia Inteligente para el Mercado Inmobiliario de Florida
              </h1>

              <p className="text-lg text-muted-foreground/80 leading-relaxed max-w-xl text-balance">
                Compradores, vendedores e inversionistas que toman decisiones con datos, no con suerte.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  ref={heroLinkRef}
                  data-testid="button-explorar-propiedades"
                  href={LOFTY_BASE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleHeroExplorar}
                  className="inline-flex items-center justify-center bg-primary text-primary-foreground text-lg px-8 py-7 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform hover:bg-primary/90 font-medium cursor-pointer"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Explorar Propiedades
                </a>
                <Button
                  data-testid="button-por-donde-empezar"
                  variant="outline"
                  onClick={() => scrollTo('compradores')}
                  className="text-foreground border-[#BDB2A4] text-lg px-8 py-7 rounded-full hover:bg-[#E5E1D8]"
                >
                  ¿Por dónde empezar?
                </Button>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4">
                <div className="flex -space-x-3">
                  {[
                    { initial: "L", bg: "#D2B463" },
                    { initial: "M", bg: "#17140F" },
                    { initial: "C", bg: "#8B7355" },
                    { initial: "J", bg: "#BDB2A4" },
                  ].map((person, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full border-[3px] border-white flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: person.bg }}
                      data-testid={`avatar-social-proof-${i}`}
                    >
                      {person.initial}
                    </div>
                  ))}
                </div>
                <p>+120 familias encontraron su hogar este año</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden md:block relative"
            >
              <div className="relative w-full max-w-md mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-7"
                  data-testid="card-floating-stats"
                >
                  <div className="space-y-4">
                    <div>
                      <p className="text-4xl font-serif font-bold text-[#17140F]">
                        <AnimatedCounter target={1247} />
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">propiedades activas en Florida</p>
                    </div>
                    <div className="h-px bg-[#BDB2A4]/20" />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Precio promedio</p>
                        <p className="text-lg font-bold text-[#17140F]">$385,000</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Actualizado hace 2 min
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="absolute -bottom-12 -left-8 bg-white/80 backdrop-blur-lg border border-white/30 rounded-xl shadow-2xl p-4 -rotate-2 w-56"
                  data-testid="card-savings"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                      <TrendingDown className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Ahorro promedio negociado</p>
                      <p className="text-sm font-bold text-[#17140F]">$12,400</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                  className="absolute -bottom-8 -right-6 bg-white/80 backdrop-blur-lg border border-white/30 rounded-xl shadow-2xl p-4 rotate-3 w-56"
                  data-testid="card-closing-time"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tiempo promedio de cierre</p>
                      <p className="text-sm font-bold text-[#17140F]">32 días</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce text-[#BDB2A4]">
            <ArrowDown className="w-6 h-6" />
          </div>
        </section>

        {/* 2. COMPRADORES (engloba: pain points + staircase + soporte + CTA) */}
        <section id="compradores">
          <div className="pt-24 pb-8 bg-[#F8F6F2]">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Compradores</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#17140F] mb-6">
                  Tu Ruta Hacia la Casa Propia
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Un proceso claro, sin sorpresas, con acompañamiento experto en cada paso.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Pain Points */}
          <div className="py-20 bg-[#E5E1D8]">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-serif font-medium mb-16 text-[#17140F]">
                ¿Te suena familiar?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                {[
                  { text: "No sabes por dónde empezar y Google te confunde más.", emoji: "🤯", gradient: "from-red-50/50 to-white", span: "md:row-span-2" },
                  { text: "Te hablan en términos financieros que no entiendes.", emoji: "😵‍💫", gradient: "from-orange-50/50 to-white", span: "" },
                  { text: "Tienes miedo de cometer un error que te cueste miles.", emoji: "😰", gradient: "from-amber-50/50 to-white", span: "" },
                  { text: "Sientes que todos tus amigos avanzan menos tú.", emoji: "😔", gradient: "from-rose-50/50 to-white", span: "md:col-span-2" },
                ].map((pain, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 }}
                    className={`bg-gradient-to-br ${pain.gradient} p-8 rounded-xl shadow-sm border border-[#BDB2A4]/20 hover:shadow-lg transition-all duration-300 group ${pain.span} ${i === 0 ? "flex flex-col justify-center" : ""}`}
                    data-testid={`card-pain-${i}`}
                  >
                    <span className="text-4xl mb-4 block group-hover:animate-pulse">{pain.emoji}</span>
                    <p className={`font-medium text-[#17140F] ${i === 0 ? "text-xl md:text-2xl" : "text-lg"}`}>{pain.text}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-16 inline-flex flex-col items-center"
              >
                <div className="relative inline-block">
                  <p className="text-2xl md:text-3xl font-serif italic text-[#17140F]">
                    "No estás fallando. Estás caminando sin un mapa."
                  </p>
                  <motion.div
                    initial={{ width: "0%" }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="h-4 bg-primary/40 absolute bottom-1 left-0 -z-10 -rotate-1"
                  />
                </div>
                <span className="text-primary font-bold text-lg mt-4">Nosotros somos ese mapa.</span>
              </motion.div>
            </div>
          </div>

          {/* Staircase */}
          <div className="py-24 bg-[#F8F6F2] relative overflow-hidden">
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
          </div>

          {/* Support / Acompañamiento */}
          <div className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <img src="/assets/key-hand.png" alt="Mano entregando las llaves de una casa nueva" loading="lazy" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
                    <p className="text-lg italic font-serif">"Al fin alguien me explica el camino completo. Ya no tengo que adivinar qué hacer."</p>
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
          </div>

          {/* Compradores CTA */}
          <div className="py-16 bg-[#F8F6F2]">
            <div className="max-w-3xl mx-auto px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Button
                  data-testid="button-comenzar-proceso"
                  onClick={() => openLeadModal("comprador")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-xl px-12 py-8 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                >
                  Comenzar Mi Proceso
                </Button>
                <p className="text-sm text-muted-foreground mt-4">Sin compromiso · Respuesta en menos de 24 horas</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 3. VENDEDORES */}
        <Suspense fallback={null}>
          <VendedoresSection />
        </Suspense>

        {/* 4. INVERSIONISTAS */}
        <Suspense fallback={null}>
          <InversionistasSection />
        </Suspense>

        {/* 5. REALTORS IA */}
        <Suspense fallback={null}>
          <RealtorsIASection />
        </Suspense>

        {/* 6. BUSCAR */}
        <Suspense fallback={null}>
          <PropertySearchSection />
        </Suspense>

        {/* 7. CTA FINAL */}
        <section className="py-32 bg-[#17140F] text-[#F8F6F2] text-center px-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#CBB29B]/10 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-10">
            <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
              No adivines el proceso. <br/>
              <span className="text-primary">Entiéndelo paso a paso.</span>
            </h2>

            <div className="flex flex-col items-center gap-6">
              <Button
                data-testid="button-descubre-paso"
                onClick={() => setDiagnosticOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xl px-12 py-8 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-all w-full md:w-auto"
              >
                Descubre tu próximo paso
              </Button>
              <p className="text-sm text-white/40 uppercase tracking-widest">Sin compromiso · Gratis · 2 Minutos</p>
            </div>
          </div>
        </section>

      </main>

      <Footer />

      {/* Modales */}
      <DiagnosticModal open={diagnosticOpen} onOpenChange={setDiagnosticOpen} />
      <LeadModal open={leadModalOpen} onOpenChange={setLeadModalOpen} context={(leadContext as any) || "general"} onLeadCaptured={handleLeadCaptured} />

      {/* Chatbot */}
      <Suspense fallback={null}>
        <ChatbotAna />
      </Suspense>

      {/* Floating CTA mobile */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 2 }}
        className="fixed bottom-6 left-6 right-6 z-40 md:hidden pointer-events-none"
      >
        <Button
          data-testid="button-mobile-cta"
          onClick={() => setDiagnosticOpen(true)}
          className="w-full bg-[#17140F] text-white shadow-xl py-6 rounded-full font-bold pointer-events-auto"
        >
          ¿En qué paso estoy?
        </Button>
      </motion.div>
    </>
  );
}
