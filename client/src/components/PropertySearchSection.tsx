import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowUpRight, MapPin, DollarSign, BedDouble } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadModal } from "@/components/LeadModal";
import { trackEvent } from "@/lib/analytics";
import { LOFTY_LISTING_BASE } from "@shared/constants";

const cities = ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale", "Kissimmee", "Daytona Beach", "Naples"];
const prices = [
  { label: "$200K", value: "200000" },
  { label: "$300K", value: "300000" },
  { label: "$400K", value: "400000" },
  { label: "$500K", value: "500000" },
  { label: "$750K", value: "750000" },
  { label: "$1M+", value: "1000000" },
];
const bedrooms = ["1", "2", "3", "4", "5+"];
const popularCities = ["Miami", "Orlando", "Tampa", "Kissimmee", "Fort Lauderdale"];

export const PropertySearchSection = () => {
  const [city, setCity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [beds, setBeds] = useState("");
  const [leadOpen, setLeadOpen] = useState(false);

  const handleSearch = () => {
    trackEvent("property_search_initiated", { city: city || "any", max_price: maxPrice || "any", beds: beds || "any" });
    setLeadOpen(true);
  };

  const selectClass = "bg-[#F8F6F2] border border-[#BDB2A4]/20 rounded-lg p-4 pl-11 outline-none focus:border-b-2 focus:border-b-primary transition-all duration-300 text-[#17140F] text-sm w-full appearance-none cursor-pointer";

  return (
    <section id="buscar" className="py-12 sm:py-16 md:py-24 bg-[#F8F6F2]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-bold tracking-[0.15em] uppercase text-sm mb-4 block">Buscar</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#17140F] mb-6">
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
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#17140F]">Ciudad</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BDB2A4] pointer-events-none" />
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
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#17140F]">Precio máximo</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BDB2A4] pointer-events-none" />
                <select
                  data-testid="select-search-price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Seleccionar precio</option>
                  {prices.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#17140F]">Habitaciones</label>
              <div className="relative">
                <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BDB2A4] pointer-events-none" />
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
          </div>

          <button
            data-testid="button-buscar-propiedades"
            onClick={handleSearch}
            className="relative w-full bg-[#D2B463] text-[#17140F] hover:bg-[#D2B463]/90 text-lg py-4 rounded-full font-bold shadow-lg hover:scale-[1.02] transition-all overflow-hidden flex items-center justify-center gap-2"
          >
            <span className="absolute inset-0 shimmer-effect" />
            <Search className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Buscar Propiedades Activas</span>
          </button>

          <div className="flex flex-wrap items-center gap-2 mt-5">
            <span className="text-xs text-muted-foreground mr-1">Populares:</span>
            {popularCities.map((c) => (
              <button
                key={c}
                onClick={() => setCity(c)}
                data-testid={`chip-city-${c.toLowerCase().replace(/\s+/g, "-")}`}
                className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${city === c ? "bg-primary text-[#17140F] font-medium" : "bg-[#E5E1D8] text-[#17140F] hover:bg-primary hover:text-[#17140F]"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="flex flex-col items-center mt-6 gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" aria-hidden="true" />
            <span className="text-green-600 text-xs font-bold">EN VIVO</span>
            <span className="text-muted-foreground text-xs">· Stellar MLS · Datos actualizados</span>
          </div>
          <a
            href={LOFTY_LISTING_BASE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline hover:text-[#D2B463] transition-colors"
          >
            O explora todas las propiedades directamente
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
          {/* Disclaimer requerido por Stellar MLS / IDX */}
          <p className="text-center text-[11px] text-muted-foreground/60 max-w-xl mt-2">
            Listados cortesía de Stellar MLS. La información se considera confiable pero no garantizada.
            © {new Date().getFullYear()} Stellar MLS. Todos los derechos reservados.
          </p>
        </div>
      </div>

      <LeadModal
        open={leadOpen}
        onOpenChange={setLeadOpen}
        context="busqueda"
        searchFilters={{
          city: city || undefined,
          maxPrice: maxPrice || undefined,
          beds: beds ? beds.replace("+", "") : undefined,
        }}
      />
    </section>
  );
};
