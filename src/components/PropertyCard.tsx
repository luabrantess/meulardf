import { Bath, Bed, Heart, MapPin, Maximize, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatPriceBRL, getPurposeLabel } from "@/lib/property-service";
import type { Property } from "@/types/real-estate";

interface PropertyCardProps {
  property: Property;
  liked?: boolean;
  onLike?: (propertyId: string) => void;
}

const PropertyCard = ({ property, liked = false, onLike }: PropertyCardProps) => {
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate(`/imovel/${property.slug}`)}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={property.coverImage}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-foreground/60 to-transparent p-4">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-card/90 px-3 py-1 text-xs font-display font-semibold text-foreground backdrop-blur">
              {getPurposeLabel(property.purpose)}
            </span>
            {property.featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-display font-semibold text-accent-foreground">
                <Star className="h-3 w-3" /> Destaque
              </span>
            )}
          </div>
          <button
            type="button"
            aria-label={liked ? "Remover curtida" : "Curtir imóvel"}
            onClick={(event) => {
              event.stopPropagation();
              onLike?.(property.id);
            }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/90 text-muted-foreground backdrop-blur transition-colors hover:text-accent"
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-current text-accent" : ""}`} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="line-clamp-2 text-lg font-display font-semibold text-foreground">{property.title}</h3>
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" /> {property.location}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-display font-bold text-primary">{formatPriceBRL(property.price)}</p>
            <p className="text-xs text-muted-foreground">{property.likesCount} likes</p>
          </div>
        </div>

        <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">{property.description}</p>

        <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4 text-xs text-muted-foreground sm:text-sm">
          <span className="inline-flex items-center gap-1.5">
            <Bed className="h-4 w-4 text-primary" /> {property.bedrooms} quartos
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Bath className="h-4 w-4 text-primary" /> {property.bathrooms} banheiros
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Maximize className="h-4 w-4 text-primary" /> {property.areaTotal} m²
          </span>
        </div>
      </div>
    </article>
  );
};

export default PropertyCard;
