import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowUpRight,
  Bath,
  Bed,
  CalendarDays,
  Car,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Maximize,
  Phone,
  Share2,
  Star,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuthSession } from "@/hooks/use-auth";
import { useLikedProperties, useProperty, useScheduleVisit, useToggleLike } from "@/hooks/use-real-estate";
import { formatPhoneBR, formatPriceBRL, getPurposeLabel } from "@/lib/property-service";
import { toast } from "sonner";

const visitSchema = z.object({
  visitorName: z.string().trim().min(3, "Informe seu nome."),
  visitorPhone: z.string().trim().min(10, "Informe um telefone válido."),
  preferredDate: z.string().min(1, "Selecione uma data."),
  message: z.string().trim().max(500, "Máximo de 500 caracteres.").optional(),
});

const PropertyDetail = () => {
  const navigate = useNavigate();
  const { slug = "" } = useParams();
  const [currentImage, setCurrentImage] = useState(0);
  const { session } = useAuthSession();
  const { data: property, isLoading } = useProperty(slug);
  const { data: likedProperties = [] } = useLikedProperties(session);
  const likeMutation = useToggleLike(session);
  const scheduleMutation = useScheduleVisit();
  const form = useForm<z.infer<typeof visitSchema>>({
    resolver: zodResolver(visitSchema),
    defaultValues: { visitorName: "", visitorPhone: "", preferredDate: "", message: "" },
  });

  const gallery = property?.gallery ?? [];
  const liked = property ? likedProperties.includes(property.id) : false;
  const mapUrl = useMemo(() => property?.mapEmbedUrl ?? `https://www.google.com/maps?q=${encodeURIComponent(property?.location ?? "Brasil")}&output=embed`, [property]);

  const onSubmit = form.handleSubmit(async (values) => {
    if (!property) return;
    try {
      await scheduleMutation.mutateAsync({ propertyId: property.id, ...values });
      form.reset();
      toast.success("Visita agendada com sucesso.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível agendar a visita.");
    }
  });

  const showNextImage = () => setCurrentImage((value) => (gallery.length ? (value + 1) % gallery.length : 0));
  const showPreviousImage = () => setCurrentImage((value) => (gallery.length ? (value - 1 + gallery.length) % gallery.length : 0));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="h-24 w-full max-w-xl animate-pulse rounded-lg border border-border bg-surface" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <div className="rounded-lg border border-border bg-card p-6 text-center shadow-sm">
            <h1 className="text-2xl font-display font-semibold text-foreground">Imóvel não encontrado</h1>
            <p className="mt-2 text-sm text-muted-foreground">Esse anúncio não está mais disponível.</p>
            <Link to="/imoveis" className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-display font-semibold text-primary-foreground">
              Voltar ao catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative overflow-hidden rounded-lg border border-border bg-card">
            <img src={gallery[currentImage] ?? property.coverImage} alt={property.title} className="h-[320px] w-full object-cover sm:h-[480px]" />
            <button onClick={showPreviousImage} className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 text-foreground backdrop-blur transition-opacity hover:opacity-90">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={showNextImage} className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 text-foreground backdrop-blur transition-opacity hover:opacity-90">
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-card/90 px-3 py-1 text-xs font-display font-semibold text-foreground backdrop-blur">{getPurposeLabel(property.purpose)}</span>
              {property.featured && <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-display font-semibold text-accent-foreground"><Star className="h-3 w-3" /> Destaque</span>}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-2">
            {gallery.map((image, index) => (
              <button key={`${image}-${index}`} onClick={() => setCurrentImage(index)} className={`overflow-hidden rounded-lg border ${index === currentImage ? "border-primary" : "border-border"}`}>
                <img src={image} alt={`${property.title} ${index + 1}`} className="h-24 w-full object-cover lg:h-[116px]" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-3xl font-display font-bold text-foreground sm:text-4xl">{property.title}</h1>
                <p className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground sm:text-base">
                  <MapPin className="h-4 w-4" /> {property.location}
                </p>
                <p className="mt-4 text-3xl font-display font-bold text-primary">{formatPriceBRL(property.price)}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => likeMutation.mutate(property.id)} className={`inline-flex h-11 w-11 items-center justify-center rounded-full border ${liked ? "border-accent text-accent" : "border-border text-muted-foreground"}`}>
                  <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
                </button>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copiado.");
                  }}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { icon: Bed, label: "Quartos", value: property.bedrooms },
                { icon: Bath, label: "Banheiros", value: property.bathrooms },
                { icon: Maximize, label: "Área total", value: `${property.areaTotal} m²` },
                { icon: Car, label: "Vagas", value: property.parkingSpots },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-border bg-surface p-4 text-center">
                  <item.icon className="mx-auto h-5 w-5 text-primary" />
                  <p className="mt-3 text-xl font-display font-bold text-foreground">{item.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-xl font-display font-semibold text-foreground">Descrição completa</h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground sm:text-base">{property.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-display font-semibold text-foreground">Comodidades</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <span key={amenity} className="rounded-full border border-border bg-surface px-3 py-2 text-sm text-foreground">{amenity}</span>
                ))}
              </div>
            </div>

            <div>
              <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                <div className="grid gap-0 lg:grid-cols-[0.95fr_1.35fr]">
                  <div className="flex flex-col justify-between border-b border-border bg-surface p-5 lg:border-b-0 lg:border-r">
                    <div>
                      <p className="inline-flex items-center gap-2 text-sm font-body uppercase tracking-[0.18em] text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary" /> Localização
                      </p>
                      <h2 className="mt-3 text-2xl font-display font-semibold text-foreground">Onde fica este imóvel</h2>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">{property.location}</p>
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-display font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      Abrir rota <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                  <iframe title={`Mapa de ${property.title}`} src={mapUrl} className="h-[360px] w-full lg:h-[420px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="sticky top-24 rounded-lg border border-border bg-card p-6 shadow-sm">
              <p className="text-2xl font-display font-bold text-primary">{formatPriceBRL(property.price)}</p>
              <p className="mt-1 text-sm text-muted-foreground">{property.likesCount} pessoas curtiram este imóvel.</p>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-display font-semibold text-primary-foreground transition-opacity hover:opacity-90">
                    <CalendarDays className="h-4 w-4" /> Agendar visita
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-display text-xl">Agendar visita</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={onSubmit} className="space-y-4 pt-2">
                    <div>
                      <Label htmlFor="visitorName">Nome</Label>
                      <Input id="visitorName" {...form.register("visitorName")} />
                      <p className="mt-1 text-xs text-destructive">{form.formState.errors.visitorName?.message}</p>
                    </div>
                    <div>
                      <Label htmlFor="visitorPhone">Telefone</Label>
                      <Input id="visitorPhone" type="tel" {...form.register("visitorPhone")} />
                      <p className="mt-1 text-xs text-destructive">{form.formState.errors.visitorPhone?.message}</p>
                    </div>
                    <div>
                      <Label htmlFor="preferredDate">Data preferida</Label>
                      <Input id="preferredDate" type="date" {...form.register("preferredDate")} />
                      <p className="mt-1 text-xs text-destructive">{form.formState.errors.preferredDate?.message}</p>
                    </div>
                    <div>
                      <Label htmlFor="message">Mensagem</Label>
                      <Textarea id="message" rows={4} {...form.register("message")} />
                      <p className="mt-1 text-xs text-destructive">{form.formState.errors.message?.message}</p>
                    </div>
                    <button type="submit" disabled={scheduleMutation.isPending} className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-accent px-5 text-sm font-display font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60">
                      Confirmar agendamento
                    </button>
                  </form>
                </DialogContent>
              </Dialog>

              <a href={`tel:${property.brokerPhone}`} className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-primary px-5 text-sm font-display font-semibold text-primary transition-colors hover:bg-surface">
                <Phone className="h-4 w-4" /> Ligar agora
              </a>

              
            </div>
          </aside>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <button onClick={() => likeMutation.mutate(property.id)} className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border text-muted-foreground">
            <Heart className={`h-5 w-5 ${liked ? "fill-current text-accent" : ""}`} />
          </button>
          <Dialog>
            <DialogTrigger asChild>
              <button className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-display font-semibold text-primary-foreground">
                <CalendarDays className="h-4 w-4" /> Agendar visita
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">Agendar visita</DialogTitle>
              </DialogHeader>
              <form onSubmit={onSubmit} className="space-y-4 pt-2">
                <div>
                  <Label htmlFor="visitorNameMobile">Nome</Label>
                  <Input id="visitorNameMobile" {...form.register("visitorName")} />
                </div>
                <div>
                  <Label htmlFor="visitorPhoneMobile">Telefone</Label>
                  <Input id="visitorPhoneMobile" type="tel" {...form.register("visitorPhone")} />
                </div>
                <div>
                  <Label htmlFor="preferredDateMobile">Data preferida</Label>
                  <Input id="preferredDateMobile" type="date" {...form.register("preferredDate")} />
                </div>
                <div>
                  <Label htmlFor="messageMobile">Mensagem</Label>
                  <Textarea id="messageMobile" rows={4} {...form.register("message")} />
                </div>
                <button type="submit" className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-accent px-5 text-sm font-display font-semibold text-accent-foreground">
                  Confirmar agendamento
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
