import { motion } from "framer-motion";
import { Search, MapPin } from "lucide-react";

export const PropertySearchSection = () => {
  return (
    <section id="buscar" className="py-24 bg-[#E5E1D8]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#17140F] mb-6">
          Explora propiedades en tiempo real
        </h2>
        <p className="text-lg text-muted-foreground mb-10">
          Conectado directamente al MLS (Multiple Listing Service) local para que no te pierdas ninguna oportunidad.
        </p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-3 rounded-full shadow-sm flex items-center gap-2 max-w-2xl mx-auto border border-[#BDB2A4]/20 transition-all duration-300 hover:shadow-md"
        >
          <div className="bg-[#F8F6F2] p-3 rounded-full text-muted-foreground ml-1 hidden sm:block">
            <MapPin className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            placeholder="Ciudad, código postal, o vecindario..." 
            className="flex-1 bg-transparent border-none outline-none text-[#17140F] px-4 text-lg w-full"
          />
          <button className="bg-primary text-primary-foreground p-4 md:px-8 rounded-full hover:bg-primary/90 transition-all duration-300 font-bold flex items-center gap-2">
            <Search className="w-5 h-5" />
            <span className="hidden sm:inline">Buscar</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};