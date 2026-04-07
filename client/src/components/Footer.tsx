import { Instagram, Facebook, Linkedin, MessageCircle, Youtube } from "lucide-react";

// Ícono TikTok — no incluido en lucide-react
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
  </svg>
);

const quickLinks = [
  { label: "Sobre Mí", href: "#sobre-mi" },
  { label: "Compradores", href: "#compradores" },
  { label: "Vendedores", href: "#vendedores" },
  { label: "Inversionistas", href: "#inversionistas" },
  { label: "Buscar Propiedades", href: "#buscar" },
];

const socialLinks = [
  {
    icon: Instagram,
    href: "https://www.instagram.com/ojedalianetespinosa/",
    label: "Perfil de Instagram de Lianet Espinosa",
    testId: "instagram",
  },
  {
    icon: Facebook,
    href: "https://www.facebook.com/profile.php?id=61558643009760",
    label: "Perfil de Facebook de Lianet Espinosa",
    testId: "facebook",
  },
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/lianet-espinosa-ojeda-34a97434b/",
    label: "Perfil de LinkedIn de Lianet Espinosa",
    testId: "linkedin",
  },
  {
    icon: TikTokIcon,
    href: "https://www.tiktok.com/@lianetespinosaojeda",
    label: "Perfil de TikTok de Lianet Espinosa",
    testId: "tiktok",
  },
  {
    icon: Youtube,
    href: "https://www.youtube.com/@LianetEspinosaOjeda",
    label: "Canal de YouTube de Lianet Espinosa",
    testId: "youtube",
  },
  {
    icon: MessageCircle,
    href: "https://wa.me/14073712374",
    label: "Contactar a Lianet por WhatsApp",
    testId: "whatsapp",
  },
];

const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault();
  const id = href.replace("#", "");
  const el = document.getElementById(id);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  }
};

interface FooterProps {
  onOpenLeadModal?: () => void;
}

export const Footer = ({ onOpenLeadModal }: FooterProps) => {
  return (
    <footer id="footer" className="bg-gradient-to-b from-[#17140F] to-[#0D0B08] text-[#F8F6F2]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          <div className="space-y-5">
            <div data-testid="text-footer-logo">
              <h3 className="font-serif text-xl text-white">
                Lianet Espinosa Ojeda
              </h3>
              <p className="text-[#D2B463] text-sm font-medium mt-0.5">REALTOR® · eXp Realty · Florida</p>
            </div>
            <p className="text-sm opacity-60 max-w-xs leading-relaxed">
              Ayudando a familias hispanas a comprar su primera casa en Florida — sin miedo, sin confusión y con datos reales.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {socialLinks.map((s) => (
                <a
                  key={s.testId}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`link-social-${s.testId}`}
                  className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D2B463] hover:text-[#17140F] transition-colors"
                >
                  <s.icon className="w-4 h-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-xs">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleSmoothScroll(e, link.href)}
                    data-testid={`link-footer-${link.href.replace("#", "")}`}
                    className="text-sm opacity-60 hover:opacity-100 hover:text-[#D2B463] transition-all"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-xs">
              Contacto
            </h4>
            <ul className="space-y-3 text-sm opacity-60">
              <li>
                <a
                  href="mailto:liarealtor7@gmail.com"
                  data-testid="link-footer-email"
                  className="hover:opacity-100 hover:text-[#D2B463] transition-all"
                >
                  liarealtor7@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+14073712374"
                  data-testid="link-footer-phone"
                  className="hover:opacity-100 hover:text-[#D2B463] transition-all"
                >
                  (407) 371-2374
                </a>
              </li>
              <li>REALTOR® · Lic. FL #SL3606490</li>
              <li>Brokerage: eXp Realty LLC</li>
            </ul>
            {onOpenLeadModal && (
              <button
                onClick={onOpenLeadModal}
                data-testid="link-footer-cta"
                className="mt-5 text-[#D2B463] hover:text-[#D2B463]/80 font-medium text-sm transition-colors"
              >
                ¿Tienes preguntas? Escríbenos →
              </button>
            )}
          </div>

        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-10 mb-6 text-white/30 text-xs">
          <span>eXp Realty LLC</span>
          <span>Stellar MLS</span>
          <span>Florida Association of Realtors (FAR)</span>
          <span>Florida REALTORS®</span>
        </div>

        <div className="border-t border-white/10 pt-6 text-center space-y-2">
          <p className="text-xs opacity-40">
            © 2026 Lianet Espinosa Ojeda | REALTOR® | Lic. FL #SL3606490 | eXp Realty LLC
          </p>
          <p className="text-xs opacity-40">
            Este sitio es de carácter informativo. No constituye asesoría legal ni financiera.
          </p>

          {/* Equal Housing Opportunity — requerido por Fair Housing Act */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <svg
              aria-hidden="true"
              focusable="false"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="opacity-50"
            >
              <path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z" fill="white" />
              <path d="M9 21V15H15V21" stroke="white" strokeWidth="1.5" fill="none" />
              <path d="M12 8C12.55 8 13 8.45 13 9C13 9.55 12.55 10 12 10C11.45 10 11 9.55 11 9C11 8.45 11.45 8 12 8Z" fill="#D2B463" />
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="white" strokeWidth="1" fill="none" />
            </svg>
            <span className="text-xs opacity-50">Equal Housing Opportunity</span>
          </div>

          <a
            href="/privacidad"
            data-testid="link-footer-privacy"
            className="inline-block text-xs text-[#D2B463]/60 underline hover:text-[#D2B463] transition-colors"
          >
            Política de Privacidad
          </a>
        </div>
      </div>
    </footer>
  );
};
