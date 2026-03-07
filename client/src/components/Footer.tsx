import { Instagram, Facebook, Linkedin, MessageCircle } from "lucide-react";

const quickLinks = [
  { label: "Compradores", href: "#compradores" },
  { label: "Vendedores", href: "#vendedores" },
  { label: "Inversionistas", href: "#inversionistas" },
  { label: "Realtors IA", href: "#realtors-ia" },
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
    el.scrollIntoView({ behavior: "smooth" });
  }
};

export const Footer = () => {
  return (
    <footer id="footer" className="bg-[#17140F] text-[#F8F6F2]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          <div className="space-y-5">
            <h3 className="font-serif text-xl text-white" data-testid="text-footer-logo">
              Camino a tu Propiedad | Florida
            </h3>
            <p className="text-sm opacity-60 max-w-xs leading-relaxed">
              Tu estrategia inteligente en el mercado inmobiliario de Florida.
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
              <li>Licensed Real Estate Agent</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-6 mt-8 text-center space-y-2">
          <p className="text-xs opacity-40">
            © 2026 Lianet Espinosa Ojeda | Licensed Real Estate Agent | eXp Realty LLC
          </p>
          <p className="text-xs opacity-40">
            Este sitio es de carácter informativo. No constituye asesoría legal ni financiera.
          </p>
          <a
            href="/privacidad"
            data-testid="link-footer-privacy"
            className="inline-block text-xs text-[#D2B463]/60 hover:text-[#D2B463] transition-colors"
          >
            Política de Privacidad
          </a>
        </div>
      </div>
    </footer>
  );
};
