import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadModal } from "@/components/LeadModal";

const cities = ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale", "Otra"];
const prices = ["$200K", "$300K", "$400K", "$500K", "$750K", "$1M+"];
const bedrooms = ["1", "2", "3", "4", "5+"];

export const PropertySearchSection = () => {
  const [city, setCity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [beds, setBeds] = useState("");
  const [leadOpen, setLeadOpen] = useState(false);

  const goToIDX = () => {
    // TODO: window.open('URL_LOFTY_IDX', '_blank');
    console.log("goToIDX: redirigir a portal IDX", { city, maxPrice, beds });
  };

  const handleSearch = () => {
    setLeadOpen(true);
  };

  const handleLeadClose = (open: boolean) => {
    if (!open) {
      goToIDX();
    }
    setLeadOpen(open);
  };

  const selectClass = "bg-white border border-[#BDB2A4]/20 rounded-lg p-4 outline-none focus:border-primary transition-all duration-300 text-[#17140F] text-sm w-full appearance-none cursor-pointer";

  return (
    <section id="buscar" className="py-24 bg-[#F8F6F2]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Buscar</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#17140F] mb-6">
            Propiedades Activas en Florida
          </h2>
          <p className="text-xl text-muted-foreground">
            Accede a listados actualizados con datos reales del mercado.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#BDB2A4]/20"
        >
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#17140F]">Ciudad</label>
              <select
                data-testid="select-search-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={selectClass}
              >
                <option value="">Seleccionar ciudad</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#17140F]">Precio máximo</label>
              <select
                data-testid="select-search-price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className={selectClass}
              >
                <option value="">Seleccionar precio</option>
                {prices.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#17140F]">Habitaciones</label>
              <select
                data-testid="select-search-beds"
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                className={selectClass}
              >
                <option value="">Seleccionar</option>
                {bedrooms.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <Button
            data-testid="button-buscar-propiedades"
            onClick={handleSearch}
            className="w-full bg-[#D2B463] text-[#17140F] hover:bg-[#D2B463]/90 text-lg py-6 rounded-full font-bold shadow-lg hover:scale-[1.02] transition-all"
          >
            <Search className="w-5 h-5 mr-2" />
            Buscar Propiedades Activas
          </Button>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground italic mt-6">
          Conectado a base de datos MLS activa
        </p>
      </div>

      <LeadModal open={leadOpen} onOpenChange={handleLeadClose} context="busqueda" />
    </section>
  );
};
