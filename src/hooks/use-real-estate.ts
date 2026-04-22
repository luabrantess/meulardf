import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkIsAdmin, createProperty, getAdminOverview, getLikedPropertyIds, getPropertyBySlug, listProperties, scheduleVisit, togglePropertyLike } from "@/lib/property-service";
import type { CreatePropertyInput, PropertyFilters, ScheduleVisitInput } from "@/types/real-estate";
import type { Session } from "@supabase/supabase-js";

export const useProperties = (filters: PropertyFilters = {}) =>
  useQuery({
    queryKey: ["properties", filters],
    queryFn: () => listProperties(filters),
  });

export const useProperty = (slug?: string) =>
  useQuery({
    queryKey: ["property", slug],
    queryFn: () => getPropertyBySlug(slug ?? ""),
    enabled: Boolean(slug),
  });

export const useLikedProperties = (session: Session | null) =>
  useQuery({
    queryKey: ["liked-properties", session?.user?.id ?? "guest"],
    queryFn: () => getLikedPropertyIds(session),
  });

export const useToggleLike = (session: Session | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (propertyId: string) => togglePropertyLike(propertyId, session),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["property"] });
      queryClient.invalidateQueries({ queryKey: ["liked-properties"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePropertyInput) => createProperty(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
  });
};

export const useScheduleVisit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ScheduleVisitInput) => scheduleVisit(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
  });
};

export const useAdminOverview = (enabled: boolean) =>
  useQuery({
    queryKey: ["admin-overview"],
    queryFn: getAdminOverview,
    enabled,
  });

export const useAdminAccess = (userId?: string) =>
  useQuery({
    queryKey: ["admin-access", userId],
    queryFn: () => checkIsAdmin(userId),
    enabled: Boolean(userId),
  });
