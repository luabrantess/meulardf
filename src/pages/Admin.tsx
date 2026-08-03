import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, CalendarClock, Heart, Loader2, LogOut, Pencil, Phone, ShieldCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuthSession } from "@/hooks/use-auth";
import { useAdminAccess, useAdminOverview, useDeleteProperty, useUpdatePropertyPromotion } from "@/hooks/use-real-estate";
import { formatPhoneBR, formatPriceBRL, signInAdmin, signOutAdmin } from "@/lib/property-service";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { Property } from "@/types/real-estate";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido."),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres."),
});

const Admin = () => {
  const { session, loading } = useAuthSession();
  const { data: isAdmin, isLoading: checkingAdmin, error: adminAccessError } = useAdminAccess(session?.user?.id);
  const { data: overview, isLoading: loadingOverview, error: overviewError } = useAdminOverview(Boolean(session && isAdmin));
  const updatePromotion = useUpdatePropertyPromotion();
  const deleteProperty = useDeleteProperty();
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [promotionPrice, setPromotionPrice] = useState("");
  const [featured, setFeatured] = useState(false);
  const [sold, setSold] = useState(false);
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleLogin = form.handleSubmit(async (values) => {
    try {
      await signInAdmin(values.email, values.password);
      toast.success("Login efetuado.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível entrar.");
    }
  });

  const openPromotionEditor = (property: Property) => {
    setEditingProperty(property);
    setPromotionPrice(String(property.price));
    setFeatured(property.featured);
    setSold(property.sold);
  };

  const savePromotion = async () => {
    if (!editingProperty) return;
    const price = Number(promotionPrice.replace(/\D/g, ""));
    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Informe um preço promocional válido.");
      return;
    }
    try {
      await updatePromotion.mutateAsync({ propertyId: editingProperty.id, price, featured, sold });
      toast.success("Promoção atualizada.");
      setEditingProperty(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível atualizar a promoção.");
    }
  };

  const handleDelete = async (property: Property) => {
    if (!window.confirm(`Excluir o anúncio “${property.title}”? Esta ação não pode ser desfeita.`)) return;
    try {
      await deleteProperty.mutateAsync(property.id);
      toast.success("Anúncio excluído.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível excluir o anúncio.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="inline-flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" /> Carregando sessão administrativa...
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div>
            <p className="text-sm font-body uppercase tracking-[0.18em] text-muted-foreground">Admin</p>
            <h1 className="mt-2 text-3xl font-display font-bold text-foreground sm:text-4xl">Acesse o painel administrativo</h1>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
              Veja visitas marcadas, anúncios cadastrados e corretores responsáveis para operar o portal com segurança.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                "Visitas marcadas em tempo real",
                "Resumo de curtidas por imóvel",
                "Contato rápido com o corretor",
              ].map((item) => (
                <div key={item} className="rounded-lg border border-border bg-surface p-4 text-sm text-foreground">{item}</div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <div>
                <h2 className="text-xl font-display font-semibold text-foreground">Login do admin</h2>
                <p className="text-sm text-muted-foreground">Apenas contas com papel admin entram no painel.</p>
              </div>
            </div>
            {!isSupabaseConfigured && (
              <div className="mb-4 rounded-md border border-border bg-surface p-4 text-sm text-muted-foreground">
                Configure <strong className="text-foreground">VITE_SUPABASE_URL</strong> e <strong className="text-foreground">VITE_SUPABASE_ANON_KEY</strong> para ativar login realmente seguro.
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" {...form.register("email")} />
                <p className="mt-1 text-xs text-destructive">{form.formState.errors.email?.message}</p>
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" {...form.register("password")} />
                <p className="mt-1 text-xs text-destructive">{form.formState.errors.password?.message}</p>
              </div>
              <button type="submit" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-display font-semibold text-primary-foreground transition-opacity hover:opacity-90">
                Entrar no admin
              </button>
            </form>
          </div>
        </section>
      </div>
    );
  }

  if (checkingAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="inline-flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" /> Validando permissões...
          </div>
        </div>
      </div>
    );
  }

  if (adminAccessError) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="max-w-md rounded-lg border border-border bg-card p-6 text-center shadow-sm">
            <ShieldCheck className="mx-auto h-10 w-10 text-accent" />
            <h1 className="mt-4 text-xl font-display font-semibold text-foreground">Não foi possível validar o admin</h1>
            <p className="mt-2 text-sm text-muted-foreground">{adminAccessError instanceof Error ? adminAccessError.message : "Confira a função has_role e a tabela user_roles no Supabase."}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="max-w-md rounded-lg border border-border bg-card p-6 text-center shadow-sm">
            <ShieldCheck className="mx-auto h-10 w-10 text-accent" />
            <h1 className="mt-4 text-xl font-display font-semibold text-foreground">Conta sem permissão de admin</h1>
            <p className="mt-2 text-sm text-muted-foreground">Use uma conta com papel administrativo para visualizar visitas e contatos dos corretores.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-body uppercase tracking-[0.18em] text-muted-foreground">Painel interno</p>
            <h1 className="mt-2 text-3xl font-display font-bold text-foreground sm:text-4xl">Visão administrativa</h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">Acompanhe o desempenho dos anúncios, visitas e contatos dos corretores em um fluxo pensado para operação.</p>
          </div>
          <button onClick={() => signOutAdmin().then(() => toast.success("Sessão encerrada."))} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-5 text-sm font-display font-semibold text-foreground transition-colors hover:bg-background">
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {loadingOverview ? (
          <div className="inline-flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" /> Carregando dados do painel...
          </div>
        ) : overviewError ? (
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-display font-semibold text-foreground">Não foi possível carregar o painel</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {overviewError instanceof Error ? overviewError.message : "Confira as policies de leitura das tabelas properties e scheduled_visits no Supabase."}
            </p>
          </div>
        ) : overview ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Anúncios", value: overview.properties.length, icon: Building2 },
                { label: "Visitas marcadas", value: overview.totalVisits, icon: CalendarClock },
                { label: "Curtidas totais", value: overview.totalLikes, icon: Heart },
                { label: "Contatos com corretor", value: overview.visits.length, icon: Phone },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-border bg-card p-5 shadow-sm">
                  <item.icon className="h-5 w-5 text-primary" />
                  <p className="mt-4 text-3xl font-display font-bold text-foreground">{item.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-lg border border-border bg-card shadow-sm">
                <div className="border-b border-border px-5 py-4">
                  <h2 className="text-xl font-display font-semibold text-foreground">Anúncios cadastrados</h2>
                </div>
                <div className="divide-y divide-border">
                  {overview.properties.map((property) => (
                    <div key={property.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[1.2fr_0.8fr_0.8fr_auto] sm:items-center">
                      <div>
                        <p className="font-display font-semibold text-foreground">{property.title}</p>
                        <p className="text-sm text-muted-foreground">{property.location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Corretor</p>
                        <p className="text-sm text-foreground">{property.brokerName}</p>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Valor</p>
                          <p className="text-sm text-foreground">{formatPriceBRL(property.price)}</p>
                        </div>
                        <span className="rounded-full bg-surface px-3 py-1 text-xs font-display font-semibold text-primary">{property.likesCount} likes</span>
                      </div>
                      <div className="flex gap-2 sm:justify-end">
                        <button type="button" onClick={() => openPromotionEditor(property)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-border px-3 text-sm font-display font-semibold text-foreground transition-colors hover:bg-surface">
                          <Pencil className="h-4 w-4" /> Editar
                        </button>
                        <button type="button" onClick={() => handleDelete(property)} disabled={deleteProperty.isPending} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-destructive/40 px-3 text-sm font-display font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-60">
                          <Trash2 className="h-4 w-4" /> Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card shadow-sm">
                <div className="border-b border-border px-5 py-4">
                  <h2 className="text-xl font-display font-semibold text-foreground">Visitas marcadas</h2>
                </div>
                <div className="divide-y divide-border">
                  {overview.visits.length ? overview.visits.map((visit) => (
                    <div key={visit.id} className="space-y-3 px-5 py-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-display font-semibold text-foreground">{visit.propertyTitle}</p>
                        <span className="rounded-full bg-surface px-3 py-1 text-xs font-display font-semibold text-primary">{visit.status.replace("_", " ")}</span>
                      </div>
                      <div className="grid gap-2 text-sm text-muted-foreground">
                        <p>Visitante: <span className="text-foreground">{visit.visitorName}</span></p>
                        <p>Telefone: <span className="text-foreground">{formatPhoneBR(visit.visitorPhone)}</span></p>
                        <p>Data: <span className="text-foreground">{new Date(`${visit.preferredDate}T12:00:00`).toLocaleDateString("pt-BR")}</span></p>
                        <p>Corretor: <span className="text-foreground">{visit.brokerName}</span></p>
                        <a href={`tel:${visit.brokerPhone}`} className="inline-flex w-fit items-center gap-2 rounded-md border border-border px-3 py-2 text-foreground transition-colors hover:bg-surface">
                          <Phone className="h-4 w-4 text-primary" /> {formatPhoneBR(visit.brokerPhone)}
                        </a>
                      </div>
                    </div>
                  )) : (
                    <div className="px-5 py-6 text-sm text-muted-foreground">Nenhuma visita marcada até o momento.</div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </section>
      <Dialog open={Boolean(editingProperty)} onOpenChange={(open) => !open && setEditingProperty(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar promoção</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground">{editingProperty?.title}</p>
            <div>
              <Label htmlFor="promotion-price">Preço promocional (R$)</Label>
              <Input id="promotion-price" type="number" min="1" value={promotionPrice} onChange={(event) => setPromotionPrice(event.target.value)} />
            </div>
            <label className="flex items-center gap-3 text-sm text-foreground">
              <Checkbox checked={featured} onCheckedChange={(checked) => setFeatured(checked === true)} />
              Destacar este anúncio como promoção
            </label>
            <label className="flex items-center gap-3 text-sm text-foreground">
              <Checkbox checked={sold} onCheckedChange={(checked) => setSold(checked === true)} />
              Mark property as sold
            </label>
            <button type="button" onClick={savePromotion} disabled={updatePromotion.isPending} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-display font-semibold text-primary-foreground disabled:opacity-60">
              {updatePromotion.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Salvar promoção
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
