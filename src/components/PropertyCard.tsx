import { Bed, Bath, Maximize, Heart, Star } from "lucide-react";
import { useState } from "react";

interface PropertyCardProps {
  image: string;
  title: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  featured?: boolean;
}

const PropertyCard = ({
  image,
  title,
  location,
  price,
  bedrooms,
  bathrooms,
  area,
  featured = false,
}: PropertyCardProps) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
      <div className="relative overflow-hidden h-56">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {featured && (
          <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-display font-semibold px-3 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3" /> Destaque
          </span>
        )}
        <span className="absolute bottom-3 right-3 bg-primary text-primary-foreground font-display font-bold text-lg px-4 py-1.5 rounded-lg">
          {price}
        </span>
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-3 right-3 w-9 h-9 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-colors"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${liked ? "fill-accent text-accent" : "text-muted-foreground"}`}
          />
        </button>
      </div>

      <div className="p-5">
        <h3 className="font-display font-semibold text-foreground text-lg mb-1 line-clamp-1">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4">{location}</p>

        <div className="flex items-center gap-5 text-muted-foreground text-sm border-t border-border pt-4">
          <span className="flex items-center gap-1.5">
            <Bed className="w-4 h-4" /> {bedrooms} Quartos
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="w-4 h-4" /> {bathrooms} Banheiros
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize className="w-4 h-4" /> {area} m²
          </span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
