import type { Session } from "@supabase/supabase-js";
import { defaultGallery, mockProperties } from "@/lib/mock-properties";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type {
  AdminOverview,
  CreatePropertyInput,
  Property,
  PropertyFilters,
  ScheduledVisit,
  ScheduleVisitInput,
} from "@/types/real-estate";

const STORAGE_KEYS = {
  properties: "imovelbr-properties",
  visits: "imovelbr-visits",
  likes: "imovelbr-liked-properties",
  visitorId: "imovelbr-visitor-id",
};

const purposeLabels = {
  venda: "Venda",
  aluguel: "Aluguel",
  lancamento: "Lançamento",
} as const;

const normalizePhone = (phone: string) => phone.replace(/\D/g, "");
const PROPERTY_PHOTOS_BUCKET = "property-photos";
const normalizeSearchText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const getVisitorId = () => {
  if (typeof window === "undefined") return "";
  const existingVisitorId = window.localStorage.getItem(STORAGE_KEYS.visitorId);
  if (existingVisitorId) return existingVisitorId;

  const nextVisitorId = crypto.randomUUID();
  window.localStorage.setItem(STORAGE_KEYS.visitorId, nextVisitorId);
  return nextVisitorId;
};

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const ensureLocalSeed = () => {
  if (typeof window === "undefined") return;
  if (!window.localStorage.getItem(STORAGE_KEYS.properties)) {
    window.localStorage.setItem(STORAGE_KEYS.properties, JSON.stringify(mockProperties));
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.visits)) {
    window.localStorage.setItem(STORAGE_KEYS.visits, JSON.stringify([]));
  }
  if (!window.localStorage.getItem(STORAGE_KEYS.likes)) {
    window.localStorage.setItem(STORAGE_KEYS.likes, JSON.stringify([]));
  }
};

const readLocal = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  ensureLocalSeed();
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeLocal = (key: string, value: unknown) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const mapRowToProperty = (row: Record<string, unknown>): Property => ({
  id: String(row.id),
  slug: String(row.slug),
  title: String(row.title),
  location: String(row.location),
  price: Number(row.price),
  bedrooms: Number(row.bedrooms),
  bathrooms: Number(row.bathrooms),
  areaTotal: Number(row.area_total),
  parkingSpots: Number(row.parking_spots ?? 1),
  description: String(row.description),
  amenities: Array.isArray(row.amenities) ? (row.amenities as string[]) : [],
  brokerName: String(row.broker_name),
  brokerPhone: String(row.broker_phone),
  coverImage: String(row.cover_image),
  gallery: Array.isArray(row.gallery) ? (row.gallery as string[]) : [String(row.cover_image)],
  purpose: (row.purpose as Property["purpose"]) ?? "venda",
  featured: Boolean(row.featured),
  likesCount: Number(row.likes_count ?? 0),
  published: Boolean(row.published ?? true),
  createdAt: String(row.created_at ?? new Date().toISOString()),
  mapEmbedUrl: row.map_embed_url ? String(row.map_embed_url) : undefined,
});

const mapPropertyToInsert = (property: CreatePropertyInput & { slug: string; coverImage: string; gallery: string[] }) => ({
  slug: property.slug,
  title: property.title,
  price: property.price,
  bedrooms: property.bedrooms,
  bathrooms: property.bathrooms,
  area_total: property.areaTotal,
  parking_spots: property.parkingSpots ?? 1,
  description: property.description,
  location: property.location,
  amenities: property.amenities,
  broker_name: property.brokerName,
  broker_phone: normalizePhone(property.brokerPhone),
  cover_image: property.coverImage,
  gallery: property.gallery,
  purpose: property.purpose,
  featured: false,
  published: true,
  likes_count: 0,
  map_embed_url: `https://www.google.com/maps?q=${encodeURIComponent(property.location)}&output=embed`,
});

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const uploadPropertyPhotos = async (files: File[], slug: string) => {
  if (!files.length) return [];

  if (isSupabaseConfigured && supabase) {
    const uploadedUrls = await Promise.all(
      files.map(async (file, index) => {
        const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${slug}/${Date.now()}-${index}.${extension}`;
        const { error } = await supabase.storage.from(PROPERTY_PHOTOS_BUCKET).upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });

        if (error) throw error;

        const { data } = supabase.storage.from(PROPERTY_PHOTOS_BUCKET).getPublicUrl(path);
        return data.publicUrl;
      }),
    );

    return uploadedUrls;
  }

  return Promise.all(files.map(fileToDataUrl));
};

const applyFilters = (properties: Property[], filters: PropertyFilters = {}) =>
  properties.filter((property) => {
    if (!property.published) return false;
    if (filters.featuredOnly && !property.featured) return false;
    if (filters.purpose && property.purpose !== filters.purpose) return false;
    if (filters.location && !normalizeSearchText(property.location).includes(normalizeSearchText(filters.location))) return false;
    if (typeof filters.minPrice === "number" && Number.isFinite(filters.minPrice) && property.price < filters.minPrice) return false;
    if (typeof filters.maxPrice === "number" && Number.isFinite(filters.maxPrice) && property.price > filters.maxPrice) return false;
    return true;
  });

export const formatPriceBRL = (price: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(price);

export const formatPhoneBR = (phone: string) => {
  const normalized = normalizePhone(phone);
  if (normalized.length === 11) {
    return normalized.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  if (normalized.length === 10) {
    return normalized.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }
  return phone;
};

export const getPurposeLabel = (purpose: Property["purpose"]) => purposeLabels[purpose];

export const listProperties = async (filters: PropertyFilters = {}): Promise<Property[]> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return applyFilters((data ?? []).map(mapRowToProperty), filters);
  }

  const localProperties = readLocal<Property[]>(STORAGE_KEYS.properties, mockProperties);
  return applyFilters(localProperties, filters).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
};

export const getPropertyBySlug = async (slug: string): Promise<Property | null> => {
  const properties = await listProperties();
  return properties.find((property) => property.slug === slug) ?? null;
};

export const getLikedPropertyIds = async (session: Session | null): Promise<string[]> => {
  if (isSupabaseConfigured && supabase) {
    const query = supabase.from("property_likes").select("property_id");
    const { data, error } = session?.user?.id
      ? await query.eq("user_id", session.user.id)
      : await query.eq("visitor_id", getVisitorId());

    if (error) throw error;
    return (data ?? []).map((item) => String(item.property_id));
  }

  return readLocal<string[]>(STORAGE_KEYS.likes, []);
};

export const togglePropertyLike = async (propertyId: string, session: Session | null) => {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.rpc("toggle_property_like", {
      _property_id: propertyId,
      _user_id: session?.user?.id ?? null,
      _visitor_id: session?.user?.id ? null : getVisitorId(),
    });
    if (error) throw error;
    return;
  }

  const likedIds = readLocal<string[]>(STORAGE_KEYS.likes, []);
  const properties = readLocal<Property[]>(STORAGE_KEYS.properties, mockProperties);
  const hasLiked = likedIds.includes(propertyId);
  const nextLikes = hasLiked ? likedIds.filter((id) => id !== propertyId) : [...likedIds, propertyId];
  const nextProperties = properties.map((property) =>
    property.id === propertyId
      ? { ...property, likesCount: Math.max(0, property.likesCount + (hasLiked ? -1 : 1)) }
      : property,
  );

  writeLocal(STORAGE_KEYS.likes, nextLikes);
  writeLocal(STORAGE_KEYS.properties, nextProperties);
};

export const createProperty = async (input: CreatePropertyInput): Promise<Property> => {
  const slugBase = slugify(input.title);
  const fallbackImage = mockProperties[(Date.now() + input.title.length) % mockProperties.length]?.coverImage ?? defaultGallery[0];
  const slug = `${slugBase}-${Date.now().toString().slice(-5)}`;
  const uploadedPhotos = await uploadPropertyPhotos(input.photos ?? [], slug);
  const gallery = uploadedPhotos.length ? uploadedPhotos : [fallbackImage, ...defaultGallery];
  const payload = {
    ...input,
    slug,
    coverImage: gallery[0],
    gallery,
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("properties").insert(mapPropertyToInsert(payload)).select("*").single();
    if (error) throw error;
    return mapRowToProperty(data);
  }

  const nextProperty: Property = {
    id: crypto.randomUUID(),
    slug: payload.slug,
    title: payload.title,
    location: payload.location,
    price: payload.price,
    bedrooms: payload.bedrooms,
    bathrooms: payload.bathrooms,
    areaTotal: payload.areaTotal,
    parkingSpots: payload.parkingSpots ?? 1,
    description: payload.description,
    amenities: payload.amenities,
    brokerName: payload.brokerName,
    brokerPhone: normalizePhone(payload.brokerPhone),
    coverImage: payload.coverImage,
    gallery: payload.gallery,
    purpose: payload.purpose,
    featured: false,
    likesCount: 0,
    published: true,
    createdAt: new Date().toISOString(),
    mapEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(payload.location)}&output=embed`,
  };

  const properties = readLocal<Property[]>(STORAGE_KEYS.properties, mockProperties);
  writeLocal(STORAGE_KEYS.properties, [nextProperty, ...properties]);
  return nextProperty;
};

export const scheduleVisit = async (input: ScheduleVisitInput) => {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("scheduled_visits").insert({
      property_id: input.propertyId,
      visitor_name: input.visitorName,
      visitor_phone: normalizePhone(input.visitorPhone),
      preferred_date: input.preferredDate,
      message: input.message ?? "",
      status: "novo",
    });
    if (error) throw error;
    return;
  }

  const properties = readLocal<Property[]>(STORAGE_KEYS.properties, mockProperties);
  const property = properties.find((item) => item.id === input.propertyId);
  if (!property) throw new Error("Imóvel não encontrado para agendamento.");

  const visits = readLocal<ScheduledVisit[]>(STORAGE_KEYS.visits, []);
  const nextVisit: ScheduledVisit = {
    id: crypto.randomUUID(),
    propertyId: input.propertyId,
    propertyTitle: property.title,
    brokerName: property.brokerName,
    brokerPhone: property.brokerPhone,
    visitorName: input.visitorName,
    visitorPhone: normalizePhone(input.visitorPhone),
    preferredDate: input.preferredDate,
    message: input.message ?? "",
    createdAt: new Date().toISOString(),
    status: "novo",
  };
  writeLocal(STORAGE_KEYS.visits, [nextVisit, ...visits]);
};

export const getAdminOverview = async (): Promise<AdminOverview> => {
  if (isSupabaseConfigured && supabase) {
    const [{ data: properties, error: propertiesError }, { data: visits, error: visitsError }] = await Promise.all([
      supabase.from("properties").select("*").order("created_at", { ascending: false }),
      supabase
        .from("scheduled_visits")
        .select("id, property_id, visitor_name, visitor_phone, preferred_date, message, created_at, status")
        .order("created_at", { ascending: false }),
    ]);

    if (propertiesError) throw propertiesError;
    if (visitsError) throw visitsError;

    const mappedProperties = (properties ?? []).map(mapRowToProperty);
    const propertiesById = new Map(mappedProperties.map((property) => [property.id, property]));
    const mappedVisits: ScheduledVisit[] = (visits ?? []).map((visit: any) => {
      const visitProperty = propertiesById.get(String(visit.property_id));

      return {
        id: String(visit.id),
        propertyId: String(visit.property_id),
        propertyTitle: visitProperty?.title ?? "Imóvel",
        brokerName: visitProperty?.brokerName ?? "Corretor",
        brokerPhone: visitProperty?.brokerPhone ?? "",
        visitorName: String(visit.visitor_name),
        visitorPhone: String(visit.visitor_phone),
        preferredDate: String(visit.preferred_date),
        message: String(visit.message ?? ""),
        createdAt: String(visit.created_at),
        status: visit.status as ScheduledVisit["status"],
      };
    });

    return {
      properties: mappedProperties,
      visits: mappedVisits,
      totalLikes: mappedProperties.reduce((total, property) => total + property.likesCount, 0),
      totalVisits: mappedVisits.length,
    };
  }

  const properties = readLocal<Property[]>(STORAGE_KEYS.properties, mockProperties);
  const visits = readLocal<ScheduledVisit[]>(STORAGE_KEYS.visits, []);
  return {
    properties,
    visits,
    totalLikes: properties.reduce((total, property) => total + property.likesCount, 0),
    totalVisits: visits.length,
  };
};

export const signInAdmin = async (email: string, password: string) => {
  if (!supabase) {
    throw new Error("Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para ativar o login seguro do admin.");
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
};

export const signOutAdmin = async () => {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentSession = async () => {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

export const checkIsAdmin = async (userId: string | undefined) => {
  if (!supabase || !userId) return false;
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error) throw error;
  return Boolean(data);
};
