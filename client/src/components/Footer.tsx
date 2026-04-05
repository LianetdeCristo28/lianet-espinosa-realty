import { Instagram, Facebook, Linkedin, MessageCircle } from "lucide-react";

const quickLinks = [
  { label: "Sobre Mí", href: "#sobre-mi" },
  { label: "Compradores", href: "#compradores" },
  { label: "Vendedores", href: "#vendedores" },
  { label: "Inversionistas", href: "#inversionistas" },
  { label: "Buscar Propiedades", href: "#buscar" },
];

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: MessageCircle, href: "#", label: "WhatsApp" },
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
            <div className="flex gap-3 pt-1">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  data-testid={`link-social-${s.label.toLowerCase()}`}
                  className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D2B463] hover:text-[#17140F] transition-colors"
                >
                  <s.icon className="w-4 h-4" />
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
              <li>REALTOR® · Licencia de Florida</li>
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
            © 2026 Lianet Espinosa Ojeda | REALTOR® | Licensed Real Estate Agent in Florida | eXp Realty LLC
          </p>
          <p className="text-xs opacity-40">
            Este sitio es de carácter informativo. No constituye asesoría legal ni financiera.
          </p>
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
