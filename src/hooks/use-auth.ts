import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getCurrentSession } from "@/lib/property-service";
import { supabase } from "@/lib/supabase";

export const useAuthSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const currentSession = await getCurrentSession();
      if (mounted) {
        setSession(currentSession);
        setLoading(false);
      }
    };

    const subscription = supabase?.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) {
        setSession(nextSession);
        setLoading(false);
      }
    });

    init();

    return () => {
      mounted = false;
      subscription?.data.subscription.unsubscribe();
    };
  }, []);

  return { session, loading };
};
