export const Footer = () => {
  return (
    <footer className="bg-[#17140F] text-white/60 py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <h3 className="text-2xl font-serif font-bold text-white">Lianet Espinosa Ojeda</h3>
          <p className="max-w-sm leading-relaxed text-sm">
            Realtor® profesional dedicada a transformar la experiencia de compra, venta e inversión inmobiliaria con claridad, estrategia y total honestidad.
          </p>
          <div className="flex gap-4 pt-2">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-[#17140F] transition-colors">
              <span className="font-serif italic font-bold text-lg">f</span>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-[#17140F] transition-colors">
              <span className="font-serif italic font-bold text-lg">in</span>
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Enlaces Rápidos</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#compradores" className="hover:text-primary transition-colors">Para Compradores</a></li>
            <li><a href="#vendedores" className="hover:text-primary transition-colors">Para Vendedores</a></li>
            <li><a href="#inversionistas" className="hover:text-primary transition-colors">Para Inversionistas</a></li>
            <li><a href="#buscar" className="hover:text-primary transition-colors">Buscar Propiedades</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Contacto</h4>
          <ul className="space-y-3 text-sm">
            <li>Llamar: (555) 123-4567</li>
            <li>Email: contacto@lianet.com</li>
            <li>Oficina principal en FL</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-white/40">
        <p>© {new Date().getFullYear()} Lianet Espinosa Ojeda. Todos los derechos reservados.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
            <p>Equal Housing Opportunity</p>
            <span>|</span>
            <p>Privacy Policy</p>
        </div>
      </div>
    </footer>
  );
};