import { Search, MapPin, Home, DollarSign } from "lucide-react";
import { useState } from "react";
import heroImage from "@/assets/hero-building.jpg";

const HeroSection = () => {
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");

  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      <img
        src={heroImage}
        alt="Edifício moderno"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-primary/60" />

      <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-4 leading-tight">
          Encontre o imóvel dos seus sonhos
        </h1>
        <p className="text-lg text-primary-foreground/80 mb-10 font-body">
          Milhares de opções para comprar e alugar em todo o Brasil
        </p>

        <div className="bg-card rounded-xl shadow-2xl p-3 flex flex-col md:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1 bg-surface rounded-lg px-4 py-3">
            <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Localização"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent w-full outline-none text-foreground placeholder:text-muted-foreground font-body text-sm"
            />
          </div>
          <div className="flex items-center gap-2 flex-1 bg-surface rounded-lg px-4 py-3">
            <Home className="w-5 h-5 text-muted-foreground shrink-0" />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-transparent w-full outline-none text-foreground font-body text-sm appearance-none cursor-pointer"
            >
              <option value="">Tipo de Imóvel</option>
              <option value="apartamento">Apartamento</option>
              <option value="casa">Casa</option>
              <option value="cobertura">Cobertura</option>
              <option value="studio">Studio</option>
              <option value="terreno">Terreno</option>
            </select>
          </div>
          <div className="flex items-center gap-2 flex-1 bg-surface rounded-lg px-4 py-3">
            <DollarSign className="w-5 h-5 text-muted-foreground shrink-0" />
            <select
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-transparent w-full outline-none text-foreground font-body text-sm appearance-none cursor-pointer"
            >
              <option value="">Faixa de Preço</option>
              <option value="0-300000">Até R$ 300.000</option>
              <option value="300000-600000">R$ 300.000 - R$ 600.000</option>
              <option value="600000-1000000">R$ 600.000 - R$ 1.000.000</option>
              <option value="1000000+">Acima de R$ 1.000.000</option>
            </select>
          </div>
          <button className="bg-accent text-accent-foreground font-display font-semibold px-8 py-3 rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 shrink-0">
            <Search className="w-5 h-5" />
            Buscar
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
