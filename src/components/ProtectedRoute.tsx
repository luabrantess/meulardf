import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2, ShieldAlert } from "lucide-react";
import { useAuthSession } from "@/hooks/use-auth";
import { useAdminAccess } from "@/hooks/use-real-estate";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const { session, loading } = useAuthSession();
  const { data: isAdmin, isLoading } = useAdminAccess(session?.user?.id);

  if (loading || (session && isLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Verificando acesso administrativo...
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin?next=${encodeURIComponent(location.pathname)}" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md rounded-lg border border-border bg-card p-6 text-center shadow-sm">
          <ShieldAlert className="mx-auto mb-4 h-10 w-10 text-accent" />
          <h1 className="text-xl font-display font-semibold text-foreground">Acesso restrito</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sua conta está autenticada, mas ainda não possui permissão de administrador.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
