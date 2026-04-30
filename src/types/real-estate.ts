export type PropertyPurpose = "venda" | "aluguel" | "lancamento";
export type VisitStatus = "novo" | "contato_pendente" | "contatado" | "concluido";


export interface Property {
  id: string;
  slug: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  areaTotal: number;
  parkingSpots: number;
  description: string;
  amenities: string[];
  brokerName: string;
  brokerPhone: string;
  coverImage: string;
  gallery: string[];
  purpose: PropertyPurpose;
  featured: boolean;
  likesCount: number;
  published: boolean;
  createdAt: string;
  mapEmbedUrl?: string;
}

export interface PropertyFilters {
  purpose?: PropertyPurpose | "";
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  featuredOnly?: boolean;
}

export interface ScheduleVisitInput {
  propertyId: string;
  visitorName: string;
  visitorPhone: string;
  preferredDate: string;
  message?: string;
}

export interface ScheduledVisit extends ScheduleVisitInput {
  id: string;
  propertyTitle: string;
  brokerName: string;
  brokerPhone: string;
  createdAt: string;
  status: VisitStatus;
}

export interface CreatePropertyInput {
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  areaTotal: number;
  description: string;
  location: string;
  amenities: string[];
  brokerName: string;
  brokerPhone: string;
  purpose: PropertyPurpose;
  parkingSpots?: number;
  photos?: File[];
}

export interface AdminOverview {
  properties: Property[];
  visits: ScheduledVisit[];
  totalLikes: number;
  totalVisits: number;
}
