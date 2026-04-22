import type { Property } from "@/types/real-estate";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";
import detail1 from "@/assets/property-detail-1.jpg";
import detail2 from "@/assets/property-detail-2.jpg";
import detail3 from "@/assets/property-detail-3.jpg";
import detail4 from "@/assets/property-detail-4.jpg";
import detail5 from "@/assets/property-detail-5.jpg";

const detailGallery = [detail1, detail2, detail3, detail4, detail5];

export const defaultGallery = detailGallery;

export const mockProperties: Property[] = [
  {
    id: "prop-1",
    slug: "apartamento-de-luxo-com-vista-panoramica",
    title: "Apartamento de Luxo com Vista Panorâmica",
    location: "Jardins, São Paulo - SP",
    price: 1850000,
    bedrooms: 3,
    bathrooms: 2,
    areaTotal: 142,
    parkingSpots: 2,
    description:
      "Apartamento elegante com varanda gourmet, acabamentos sofisticados e acesso rápido às melhores opções de gastronomia, lazer e serviços da capital.",
    amenities: ["Varanda gourmet", "Academia", "Portaria 24h", "Piscina", "Pet place", "Coworking"],
    brokerName: "Rafael Costa",
    brokerPhone: "11999998888",
    coverImage: property1,
    gallery: [property1, ...detailGallery],
    purpose: "venda",
    featured: true,
    likesCount: 34,
    published: true,
    createdAt: "2026-04-01T10:00:00.000Z",
  },
  {
    id: "prop-2",
    slug: "casa-classica-com-jardim-amplo",
    title: "Casa Clássica com Jardim Amplo",
    location: "Higienópolis, São Paulo - SP",
    price: 2300000,
    bedrooms: 4,
    bathrooms: 3,
    areaTotal: 280,
    parkingSpots: 3,
    description:
      "Casa espaçosa com jardim arborizado, salas integradas e ambientes generosos para quem busca conforto e privacidade em região nobre.",
    amenities: ["Jardim amplo", "Churrasqueira", "Escritório", "Depósito", "Suíte master"],
    brokerName: "Mariana Lopes",
    brokerPhone: "11988887777",
    coverImage: property2,
    gallery: [property2, detail2, detail3, detail4, detail5, detail1],
    purpose: "venda",
    featured: false,
    likesCount: 19,
    published: true,
    createdAt: "2026-04-04T15:30:00.000Z",
  },
  {
    id: "prop-3",
    slug: "cobertura-duplex-com-terraco",
    title: "Cobertura Duplex com Terraço",
    location: "Leblon, Rio de Janeiro - RJ",
    price: 4500000,
    bedrooms: 4,
    bathrooms: 4,
    areaTotal: 320,
    parkingSpots: 3,
    description:
      "Cobertura com terraço privativo, vista aberta, lazer exclusivo e interiores planejados para receber com sofisticação.",
    amenities: ["Piscina privativa", "Terraço", "Home office", "Adega", "Segurança 24h", "Automação"],
    brokerName: "Renata Campos",
    brokerPhone: "21977776666",
    coverImage: property3,
    gallery: [property3, ...detailGallery],
    purpose: "lancamento",
    featured: true,
    likesCount: 52,
    published: true,
    createdAt: "2026-04-08T09:15:00.000Z",
  },
  {
    id: "prop-4",
    slug: "studio-moderno-e-aconchegante",
    title: "Studio Moderno e Aconchegante",
    location: "Vila Madalena, São Paulo - SP",
    price: 480000,
    bedrooms: 1,
    bathrooms: 1,
    areaTotal: 38,
    parkingSpots: 1,
    description:
      "Studio funcional com marcenaria sob medida, varanda, serviços pay-per-use e localização estratégica perto do metrô.",
    amenities: ["Lavanderia compartilhada", "Portaria remota", "Bicicletário", "Varanda", "Academia"],
    brokerName: "Paulo Nogueira",
    brokerPhone: "11966665555",
    coverImage: property4,
    gallery: [property4, detail4, detail1, detail2, detail3, detail5],
    purpose: "aluguel",
    featured: false,
    likesCount: 11,
    published: true,
    createdAt: "2026-04-11T13:20:00.000Z",
  },
  {
    id: "prop-5",
    slug: "casa-contemporanea-com-piscina",
    title: "Casa Contemporânea com Piscina",
    location: "Alphaville, Barueri - SP",
    price: 3200000,
    bedrooms: 5,
    bathrooms: 4,
    areaTotal: 450,
    parkingSpots: 4,
    description:
      "Projeto contemporâneo com integração total entre áreas internas e externas, piscina, gourmet completo e suíte térrea.",
    amenities: ["Piscina", "Espaço gourmet", "Jardim", "Sala íntima", "Closet", "Condomínio fechado"],
    brokerName: "Fernanda Sales",
    brokerPhone: "11955554444",
    coverImage: property5,
    gallery: [property5, detail5, detail4, detail3, detail2, detail1],
    purpose: "venda",
    featured: true,
    likesCount: 47,
    published: true,
    createdAt: "2026-04-14T11:10:00.000Z",
  },
  {
    id: "prop-6",
    slug: "apartamento-gourmet-alto-padrao",
    title: "Apartamento Gourmet Alto Padrão",
    location: "Itaim Bibi, São Paulo - SP",
    price: 1650000,
    bedrooms: 3,
    bathrooms: 3,
    areaTotal: 165,
    parkingSpots: 2,
    description:
      "Apartamento refinado com cozinha aberta, varanda gourmet e planta perfeita para famílias que valorizam conveniência e estilo.",
    amenities: ["Varanda gourmet", "Hall privativo", "Academia", "Brinquedoteca", "Portaria 24h"],
    brokerName: "Ricardo Menezes",
    brokerPhone: "11944443333",
    coverImage: property6,
    gallery: [property6, detail3, detail1, detail5, detail2, detail4],
    purpose: "venda",
    featured: false,
    likesCount: 26,
    published: true,
    createdAt: "2026-04-17T16:45:00.000Z",
  },
];
