import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { useAuthSession } from "@/hooks/use-auth";
import { useLikedProperties, useProperties, useToggleLike } from "@/hooks/use-real-estate";
import type { PropertyFilters, PropertyPurpose } from "@/types/real-estate";

const parsePriceRange = (priceRange: string) => {
  if (!priceRange) return {};
  if (priceRange.endsWith("+")) {
    return { minPrice: Number(priceRange.replace("+", "")) };
  }

  const [min, max] = priceRange.split("-");
  return {
    minPrice: min ? Number(min) : undefined,
    maxPrice: max ? Number(max) : undefined,
  };
};

const Catalog = () => {
  const [searchParams] = useSearchParams();
  const { session } = useAuthSession();
  const filters = useMemo<PropertyFilters>(() => {
    const priceFilters = parsePriceRange(searchParams.get("price") ?? "");

    return {
      purpose: (searchParams.get("purpose") as PropertyPurpose | null) ?? "",
      location: searchParams.get("location") ?? "",
      ...priceFilters,
    };
  }, [searchParams]);

  const { data: properties = [], isLoading } = useProperties(filters);
  const { data: likedProperties = [] } = useLikedProperties(session);
  const toggleLike = useToggleLike(session);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-body uppercase tracking-[0.18em] text-muted-foreground">Catálogo</p>
          <h1 className="mt-2 text-3xl font-display font-bold text-foreground sm:text-4xl">Todos os imóveis</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Explore compra, aluguel e lançamentos com likes persistentes, detalhe completo e navegação rápida no celular.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
          {filters.location && <span className="rounded-full bg-surface px-3 py-1">Localização: {filters.location}</span>}
          {filters.purpose && <span className="rounded-full bg-surface px-3 py-1">Finalidade: {filters.purpose}</span>}
          {(filters.minPrice || filters.maxPrice) && <span className="rounded-full bg-surface px-3 py-1">Faixa filtrada</span>}
          <Link to="/imoveis" className="rounded-full border border-border px-3 py-1 text-foreground">Limpar filtros</Link>
        </div>

        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-80 animate-pulse rounded-lg border border-border bg-surface" />
            ))}
          </div>
        ) : properties.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                liked={likedProperties.includes(property.id)}
                onLike={(propertyId) => toggleLike.mutate(propertyId)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <h2 className="text-xl font-display font-semibold text-foreground">Nenhum imóvel encontrado</h2>
            <p className="mt-2 text-sm text-muted-foreground">Tente outra combinação de filtros ou anuncie um novo imóvel.</p>
            <Link to="/anunciar" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-display font-semibold text-primary-foreground">
              Anunciar agora
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Catalog;
