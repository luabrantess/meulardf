import { Crown, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { useAuthSession } from "@/hooks/use-auth";
import { useLikedProperties, useProperties, useToggleLike } from "@/hooks/use-real-estate";

const Destaques = () => {
  const { session } = useAuthSession();
  const { data: properties = [] } = useProperties();
  const { data: likedProperties = [] } = useLikedProperties(session);
  const toggleLike = useToggleLike(session);

  const rankedProperties = [...properties].sort((a, b) => b.likesCount - a.likesCount);
  const leaders = rankedProperties.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-body uppercase tracking-[0.18em] text-muted-foreground">Ranking</p>
          <h1 className="mt-2 text-3xl font-display font-bold text-foreground sm:text-4xl">Página de destaques</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Os imóveis mais curtidos sobem para esta vitrine, facilitando a descoberta dos anúncios com maior interesse do público.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {leaders.map((property, index) => (
            <div key={property.id} className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1 text-xs font-display font-semibold text-primary">
                  <Crown className="h-3.5 w-3.5" /> #{index + 1}
                </span>
                <span className="text-sm text-muted-foreground">{property.likesCount} likes</span>
              </div>
              <h2 className="mt-4 text-xl font-display font-semibold text-foreground">{property.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{property.location}</p>
            </div>
          ))}
        </div>

        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-accent" /> Ordem dinâmica com base nas curtidas registradas.
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rankedProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              liked={likedProperties.includes(property.id)}
              onLike={(propertyId) => toggleLike.mutate(propertyId)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Destaques;
