import { Search, MapPin, Home, DollarSign } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-building.jpg";
import { useProperties } from "@/hooks/use-real-estate";

const PRICE_INTERVAL = 200000;

const formatPriceShort = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);

const HeroSection = () => {
  const navigate = useNavigate();
  const { data: properties = [] } = useProperties();
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const priceOptions = useMemo(() => {
    const maxPrice = Math.max(...properties.map((property) => property.price), PRICE_INTERVAL);
    const roundedMaxPrice = Math.ceil(maxPrice / PRICE_INTERVAL) * PRICE_INTERVAL;

    return Array.from({ length: roundedMaxPrice / PRICE_INTERVAL }, (_, index) => {
      const min = index * PRICE_INTERVAL;
      const max = min + PRICE_INTERVAL;
      return {
        value: `${min}-${max}`,
        label: min === 0 ? `Até ${formatPriceShort(max)}` : `${formatPriceShort(min)} a ${formatPriceShort(max)}`,
      };
    });
  }, [properties]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (type) params.set("purpose", type);
    if (price) params.set("price", price);
    navigate(`/imoveis?${params.toString()}`);
  };

  return (
    <section className="relative flex min-h-[72svh] items-center overflow-hidden">
      <img src={heroImage} alt="Fachada de edifício residencial contemporâneo" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-primary/70" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-end px-4 pb-12 pt-24 sm:px-6 lg:px-8 lg:pb-16">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-body uppercase tracking-[0.18em] text-primary-foreground/75">Portal imobiliário com operação real</p>
          <h1 className="max-w-2xl text-4xl font-display font-bold leading-tight text-primary-foreground md:text-5xl lg:text-6xl">
            Imóveis para comprar, alugar e anunciar sem sair do celular.
          </h1>
          <p className="mt-4 max-w-xl text-base font-body text-primary-foreground/80 sm:text-lg">
            Busque bairros, compare valores, curta favoritos e entre em contato com rapidez em uma experiência pensada para mobile.
          </p>
        </div>

        <div className="mt-8 grid gap-3 rounded-lg border border-primary-foreground/15 bg-card/95 p-3 shadow-sm backdrop-blur md:grid-cols-[1.2fr_1fr_1fr_auto]">
          <label className="flex items-center gap-2 rounded-md bg-surface px-4 py-3">
            <MapPin className="h-5 w-5 shrink-0 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cidade ou bairro"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </label>
          <label className="flex items-center gap-2 rounded-md bg-surface px-4 py-3">
            <Home className="h-5 w-5 shrink-0 text-muted-foreground" />
            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="w-full cursor-pointer bg-transparent text-sm text-foreground outline-none"
            >
              <option value="">Finalidade</option>
              <option value="venda">Comprar</option>
              <option value="aluguel">Alugar</option>
              <option value="lancamento">Lançamentos</option>
            </select>
          </label>
          <label className="flex items-center gap-2 rounded-md bg-surface px-4 py-3">
            <DollarSign className="h-5 w-5 shrink-0 text-muted-foreground" />
            <select
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="w-full cursor-pointer bg-transparent text-sm text-foreground outline-none"
            >
              <option value="">Faixa de valor</option>
              {priceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={handleSearch}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-accent px-6 text-sm font-display font-semibold text-accent-foreground transition-opacity hover:opacity-90"
          >
            <Search className="h-4 w-4" />
            Buscar
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
