import { Building2, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import { useAuthSession } from "@/hooks/use-auth";
import { useLikedProperties, useProperties, useToggleLike } from "@/hooks/use-real-estate";

const Index = () => {
  const { session } = useAuthSession();
  const { data: properties = [], isLoading } = useProperties();
  const { data: likedProperties = [] } = useLikedProperties(session);
  const toggleLike = useToggleLike(session);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-body uppercase tracking-[0.18em] text-muted-foreground">Anúncios</p>
            <h2 className="mt-2 text-3xl font-display font-bold text-foreground">Todos os imóveis</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Confira todos os imóveis publicados na plataforma.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/imoveis" className="inline-flex min-h-11 items-center justify-center rounded-md border border-border px-5 text-sm font-display font-semibold text-foreground transition-colors hover:bg-surface">
              Ver todos os imóveis
            </Link>
            <Link to="/destaques" className="inline-flex min-h-11 items-center justify-center rounded-md bg-accent px-5 text-sm font-display font-semibold text-accent-foreground transition-opacity hover:opacity-90">
              Página de destaques
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-80 animate-pulse rounded-lg border border-border bg-surface" />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                liked={likedProperties.includes(property.id)}
                onLike={(propertyId) => toggleLike.mutate(propertyId)}
                showDescription={false}
              />
            ))}
          </div>
        )}
      </section>

      <section className="bg-surface py-14">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 text-center sm:grid-cols-2 lg:grid-cols-4 sm:px-6 lg:px-8">
          {[
            { value: `${properties.length}+`, label: "Anúncios ativos" },
            { value: `${properties.reduce((total, property) => total + property.likesCount, 0)}+`, label: "Curtidas registradas" },
            { value: "100%", label: "Experiência mobile" },
            { value: "24h", label: "Tempo para novo anúncio entrar no radar" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-border bg-card p-5">
              <p className="text-3xl font-display font-bold text-primary">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <footer id="contato" className="bg-primary py-12 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                <span className="text-lg font-display font-bold">MeuLAR</span>
              </div>
              <p className="max-w-sm text-sm text-primary-foreground/75">
                Portal em português com anúncio, curtidas, agendamento de visitas e visão operacional para a equipe administrativa.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-display font-semibold">Acesso rápido</h2>
              <div className="mt-4 flex flex-col gap-2 text-sm text-primary-foreground/75">
                <Link to="/imoveis" className="transition-colors hover:text-primary-foreground">Catálogo</Link>
                <Link to="/destaques" className="transition-colors hover:text-primary-foreground">Destaques</Link>
                <Link to="/anunciar" className="transition-colors hover:text-primary-foreground">Anunciar imóvel</Link>
                <Link to="/admin" className="transition-colors hover:text-primary-foreground">Admin</Link>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-display font-semibold">Contato</h2>
              <div className="mt-4 flex flex-col gap-3 text-sm text-primary-foreground/75">
                <span className="inline-flex items-center gap-2"><Phone className="h-4 w-4" /> (61) 99217-6224</span>
                <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4" /> contato@imovelbr.com</span>
                <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> Brasília, DF - Brasil</span>
              </div>
            </div>
          </div>
          <div className="mt-10 border-t border-primary-foreground/20 pt-6 text-center text-xs text-primary-foreground/55">
            © 2026 MeuLAR. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
