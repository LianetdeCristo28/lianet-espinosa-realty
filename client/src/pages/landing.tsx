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
import { ArrowDown, Check, Search, TrendingDown, Clock, Activity, Calculator, EyeOff, Shield, Handshake, Compass, FileQuestion, AlertTriangle, Hourglass } from "lucide-react";
import { motion } from "framer-motion";
import ScrollExpandHero from '@/components/ui/scroll-expansion-hero';
import { CircularGallery, GalleryItem } from '@/components/ui/circular-gallery';

const floridaProperties: GalleryItem[] = [
  {
    common: 'Villa con Piscina',
    binomial: 'Orlando · desde $480K',
    photo: {
      url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&auto=format&fit=crop&q=80',
      text: 'Villa de lujo con piscina en Florida',
      pos: 'center',
      by: 'Unsplash',
    },
  },
  {
    common: 'Casa Moderna',
    binomial: 'Miami · desde $620K',
    photo: {
      url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80',
      text: 'Casa moderna en Miami',
      pos: 'center',
      by: 'Unsplash',
    },
  },
  {
    common: 'New Construction',
    binomial: 'Tampa · desde $390K',
    photo: {
      url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
      text: 'Nueva construcción en Tampa',
      pos: 'center',
      by: 'Unsplash',
    },
  },
  {
    common: 'Townhome Premium',
    binomial: 'Jacksonville · desde $310K',
    photo: {
      url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&auto=format&fit=crop&q=80',
      text: 'Townhome en Jacksonville',
      pos: 'center',
      by: 'Unsplash',
    },
  },
  {
    common: 'Penthouse Vista',
    binomial: 'Fort Lauderdale · desde $750K',
    photo: {
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=80',
      text: 'Penthouse con vista al mar',
      pos: 'center',
      by: 'Unsplash',
    },
  },
  {
    common: 'Single Family Home',
    binomial: 'Kissimmee · desde $340K',
    photo: {
      url: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&auto=format&fit=crop&q=80',
      text: 'Single family home en Kissimmee',
      pos: 'center',
      by: 'Unsplash',
    },
  },
];
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
        <ScrollExpandHero
          mediaSrc="/images/house-hero.jpg"
          bgImageSrc="/images/beach-bg.jpg"
          title="Tu Casa Florida"
          date="REALTOR® · eXp Realty · Stellar MLS"
          scrollToExpand="Desliza para explorar"
        >
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

            {/* Foto en mobile: aparece arriba del texto */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col items-center gap-3 md:hidden"
            >
              <div className="relative">
                <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-[#D2B463] shadow-xl">
                  <img
                    src="/images/lianet-hero.jpg"
                    alt="Lianet Espinosa Ojeda, REALTOR®"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 bg-[#D2B463] text-[#17140F] text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                  REALTOR®
                </span>
              </div>
              <div className="text-center">
                <p className="font-serif font-bold text-[#17140F] text-base">Lianet Espinosa Ojeda</p>
                <p className="text-[#D2B463] text-sm font-medium">REALTOR® | eXp Realty</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E5E1D8] text-[#17140F] text-sm font-medium tracking-wide">
                <Activity className="w-3.5 h-3.5 text-primary" />
                REALTOR® · eXp Realty · Stellar MLS
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-[#17140F] leading-[1.1] text-balance">
                Ayudo a familias hispanas a comprar su primera casa en Florida
              </h1>

              <p className="text-xl font-medium text-[#D2B463] leading-snug max-w-xl text-balance">
                Sin miedo, sin confusión y con datos reales.
              </p>

              <p className="text-lg text-muted-foreground/80 leading-relaxed max-w-xl text-balance">
                Si eres familia hispana y quieres comprar tu primera casa en Florida, estás en el lugar correcto. Yo te acompaño en cada paso — desde la pre-aprobación hasta la llave en tu mano.
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4">
                <Button
                  data-testid="button-por-donde-empezar"
                  onClick={() => scrollTo('compradores')}
                  className="w-full sm:w-auto bg-primary text-primary-foreground text-lg px-8 py-7 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform hover:bg-primary/90 font-medium"
                >
                  ¿Por dónde empezar?
                </Button>
                <a
                  ref={heroLinkRef}
                  data-testid="button-explorar-propiedades"
                  href={LOFTY_BASE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleHeroExplorar}
                  className="w-full sm:w-auto inline-flex items-center justify-center text-foreground border border-[#BDB2A4] text-base px-6 py-4 rounded-full hover:bg-[#E5E1D8] transition-colors font-medium cursor-pointer"
                >
                  <Search className="w-4 h-4 mr-2 opacity-70" />
                  Ver propiedades
                </a>
              </div>

            </motion.div>

            {/* Columna derecha: galería circular de propiedades */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden md:block relative"
              style={{ height: '520px' }}
            >
              <CircularGallery items={floridaProperties} radius={380} autoRotateSpeed={0.018} className="w-full h-full" />
            </motion.div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce text-[#BDB2A4]">
            <ArrowDown className="w-6 h-6" />
          </div>
        </section>
        </ScrollExpandHero>

        {/* 2. SOBRE MÍ */}
        <section id="sobre-mi" className="py-16 sm:py-24 bg-[#F8F6F2]">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative flex flex-col items-center py-16 min-w-[300px] sm:min-w-0">
                {/* Badge izquierdo — Licencia */}
                <div className="absolute left-0 top-20 bg-white rounded-2xl shadow-lg px-2 py-2 sm:px-4 sm:py-3 flex items-center gap-2 sm:gap-3 z-20 border border-[#E2D9CC]">
                  <div className="w-7 h-7 sm:w-9 sm:h-9 bg-[#F7F3EC] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A455" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[9px] sm:text-[10px] text-[#6B5E4A] font-medium uppercase tracking-wide leading-tight">Licenciada FL</p>
                    <p className="text-sm sm:text-base font-bold text-[#1C1A15] mt-0.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>REALTOR®</p>
                  </div>
                </div>

                {/* Foto circular con ring dorado */}
                <div className="relative w-52 h-52 sm:w-64 sm:h-64 lg:w-72 lg:h-72">
                  <div className="absolute -inset-1.5 rounded-full border-[3px] border-[#C9A455] z-10" />
                  <div className="w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-white">
                    <img
                      src="/images/lianet-hero.jpg"
                      alt="Lianet Espinosa Ojeda — REALTOR® eXp Realty Florida"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20 bg-[#1C1A15] text-[#F7F3EC] text-[11px] font-semibold px-5 py-2 rounded-full tracking-widest uppercase whitespace-nowrap shadow-lg">
                    REALTOR® · eXp Realty
                  </div>
                </div>

                {/* Badge derecho — MLS */}
                <div className="absolute right-0 top-20 bg-white rounded-2xl shadow-lg px-2 py-2 sm:px-4 sm:py-3 flex items-center gap-2 sm:gap-3 z-20 border border-[#E2D9CC]">
                  <div className="w-7 h-7 sm:w-9 sm:h-9 bg-[#FFF9EC] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A455" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[9px] sm:text-[10px] text-[#6B5E4A] font-medium uppercase tracking-wide leading-tight">Acceso</p>
                    <p className="text-sm sm:text-base font-bold text-[#1C1A15] mt-0.5" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Stellar MLS</p>
                  </div>
                </div>

                {/* Badge New Construction */}
                <div className="mt-10 bg-[#C9A455] text-[#1C1A15] text-[11px] font-bold px-5 py-2 rounded-full tracking-[0.1em] uppercase shadow-md">
                  ✦ New Construction Expert
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-7"
            >
              <div>
                <span className="text-primary font-bold tracking-[0.15em] uppercase text-sm mb-3 block">Sobre Mí</span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#17140F] leading-[1.1]">
                  Soy Lianet.<br />Tu aliada en el camino.
                </h2>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Llegué a Florida con la misma incertidumbre que sienten muchas familias hispanas cuando piensan en comprar una casa. Sé lo que es no entender los términos, no saber a quién creerle, y sentir que el proceso es para "otros".
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Por eso me convertí en REALTOR®. Para ser el puente que yo hubiera necesitado — alguien que habla tu idioma, entiende tu historia y te guía con datos reales, no con promesas vacías.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  "Especialista en primeros compradores hispanos",
                  "Experta en New Construction en Florida",
                  "Acceso directo a Stellar MLS y eXp Realty",
                  "Atención personalizada en español",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#D2B463]/20 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#D2B463]" />
                    </div>
                    <p className="text-[#17140F] font-medium">{item}</p>
                  </div>
                ))}
              </div>

              <div className="bg-[#17140F] rounded-2xl p-6 mt-4">
                <p className="font-serif text-[#F8F6F2] text-xl italic leading-relaxed">
                  "Mi misión es que llegues al cierre entendiendo cada número, sintiéndote segura y orgullosa de la decisión que tomaste."
                </p>
                <p className="text-[#D2B463] font-bold text-sm mt-3">— Lianet Espinosa Ojeda, REALTOR®</p>
              </div>
            </motion.div>

          </div>
        </section>

        {/* 3. COMPRADORES (engloba: pain points + staircase + soporte + CTA) */}
        <section id="compradores">
          <div className="pt-12 sm:pt-16 md:pt-24 pb-8 bg-[#F8F6F2]">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-primary font-bold tracking-[0.15em] uppercase text-sm mb-4 block">Compradores</span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#17140F] mb-6">
                  Tu Ruta Hacia la Casa Propia
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Un proceso claro, sin sorpresas, con acompañamiento experto en cada paso.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Pain Points */}
          <div className="py-12 sm:py-16 md:py-20 bg-[#E5E1D8]">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium mb-16 text-[#17140F]">
                ¿Te suena familiar?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                {[
                  { text: "Buscas información y cada fuente te dice algo distinto.", sub: "Sin una guía clara, cada decisión se siente como un riesgo.", icon: Compass },
                  { text: "El lenguaje financiero te deja fuera de la conversación.", sub: "Tasas, escrow, pre-aprobación... nadie te lo explica en palabras simples.", icon: FileQuestion },
                  { text: "Un solo error puede costarte miles de dólares.", sub: "Y sin experiencia, no sabes qué cláusulas proteger ni qué preguntar.", icon: AlertTriangle },
                  { text: "Sientes que el tiempo pasa y no avanzas.", sub: "Otros ya cerraron. Tú sigues esperando sin saber cuál es el próximo paso.", icon: Hourglass },
                ].map((pain, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 }}
                    className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-[#BDB2A4]/15 hover:-translate-y-1 hover:shadow-xl hover:border-primary/20 transition-all duration-300 ease-out group"
                    data-testid={`card-pain-${i}`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#17140F] flex items-center justify-center mb-5 group-hover:bg-primary transition-colors duration-300">
                      <pain.icon className="w-5 h-5 text-[#D2B463] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <p className="font-semibold text-[#17140F] text-lg leading-snug mb-2">{pain.text}</p>
                    <p className="text-sm text-[#6B6257] leading-relaxed">{pain.sub}</p>
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
                <span className="text-primary font-bold text-lg mt-4">Yo soy ese mapa. Yo soy Lianet.</span>
              </motion.div>
            </div>
          </div>

          {/* Staircase */}
          <div className="py-12 sm:py-16 md:py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-primary font-bold tracking-[0.15em] uppercase text-sm mb-4 block">El Método</span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#17140F] mb-6">
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
          <div className="py-12 sm:py-16 md:py-24 bg-[#F8F6F2] relative">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <div className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                  <img src="/assets/key-hand.png" alt="Mano entregando las llaves de una casa nueva" loading="lazy" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20" />
                </div>

              </div>

              <div className="space-y-8">

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#17140F]">No tienes que caminar solo.</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Cada paso está pensado para darte claridad y seguridad. Nosotros nos encargamos de traducir el idioma bancario, negociar los precios y revisar las letras pequeñas.
                </p>

                <div className="space-y-3">
                  {[
                    { text: "Asesoría financiera real, no solo 'ventas'.", icon: Calculator },
                    { text: "Acceso a propiedades que no están en portales públicos.", icon: EyeOff },
                    { text: "Negociación agresiva a tu favor.", icon: Shield },
                    { text: "Acompañamiento hasta la firma (y después).", icon: Handshake },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-[#F8F6F2] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-out"
                      data-testid={`card-benefit-${i}`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <p className="text-[#17140F] font-medium">{item.text}</p>
                    </motion.div>
                  ))}
                </div>
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

        <div className="h-px bg-gradient-to-r from-transparent via-[#D2B463]/30 to-transparent my-0" />

        {/* 4. INVERSIONISTAS */}
        <Suspense fallback={null}>
          <InversionistasSection />
        </Suspense>

        <div className="flex justify-center gap-3 py-6 bg-white">
          <span className="text-[#D2B463]/30 text-sm">◇</span>
          <span className="text-[#D2B463]/30 text-sm">◇</span>
          <span className="text-[#D2B463]/30 text-sm">◇</span>
        </div>

        {/* 5. REALTORS IA */}
        <Suspense fallback={null}>
          <RealtorsIASection onScheduleConsultancy={() => openLeadModal("general")} />
        </Suspense>

        {/* 6. BUSCAR */}
        <Suspense fallback={null}>
          <PropertySearchSection />
        </Suspense>

        {/* 7. CTA FINAL */}
        <section className="py-16 sm:py-24 md:py-32 bg-[#17140F] text-[#F8F6F2] text-center px-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#CBB29B]/10 rounded-full blur-3xl" />

          {[
            { left: "10%", delay: "0s", duration: "6s" },
            { left: "25%", delay: "1.2s", duration: "8s" },
            { left: "40%", delay: "0.5s", duration: "7s" },
            { left: "55%", delay: "2s", duration: "9s" },
            { left: "70%", delay: "0.8s", duration: "6.5s" },
            { left: "85%", delay: "1.5s", duration: "7.5s" },
            { left: "15%", delay: "3s", duration: "8.5s" },
          ].map((dot, i) => (
            <span
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[#D2B463]/20 animate-float-up"
              style={{
                left: dot.left,
                bottom: "-4px",
                animationDelay: dot.delay,
                animationDuration: dot.duration,
              }}
            />
          ))}

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
              <div className="flex flex-wrap justify-center gap-6 text-xs text-white/60">
                <span className="flex items-center gap-1.5">✓ 100% Gratis</span>
                <span className="flex items-center gap-1.5">✓ Sin compromiso</span>
                <span className="flex items-center gap-1.5">✓ 2 minutos</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer onOpenLeadModal={() => openLeadModal("general")} />

      {/* Modales */}
      <DiagnosticModal open={diagnosticOpen} onOpenChange={setDiagnosticOpen} />
      <LeadModal open={leadModalOpen} onOpenChange={setLeadModalOpen} context={(leadContext as any) || "general"} onLeadCaptured={handleLeadCaptured} />

      {/* Chatbot */}
      <Suspense fallback={null}>
        <ChatbotAna />
      </Suspense>

      {/* WhatsApp flotante */}
      <a
        href="https://wa.me/14073712374"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        data-testid="button-whatsapp"
        className="fixed bottom-40 md:bottom-24 right-6 md:right-8 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-md flex items-center justify-center hover:scale-105 transition-all duration-300 hover:bg-[#22c55e]"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Floating CTA mobile */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 2 }}
        className="fixed bottom-20 left-6 right-6 z-40 md:hidden pointer-events-none"
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
