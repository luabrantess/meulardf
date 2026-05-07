import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, MapPin, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProperty } from "@/hooks/use-real-estate";
import { toast } from "sonner";

const amenitiesOptions = [
  "Piscina",
  "Varanda gourmet",
  "Academia",
  "Portaria 24h",
  "Espaço pet",
  "Coworking",
  "Área verde",
  "Churrasqueira",
  "Sauna",
  "Quadra esportiva",
  "Camera de segurança",
  "Closet",
  "Segurança 24h",
  "Ar-condicionado",
  "Vista panorâmica",
];

const propertySchema = z.object({
  title: z.string().trim().min(5, "Informe um título mais completo.").max(120, "Máximo de 120 caracteres."),
  price: z.coerce.number().min(500, "Informe um valor válido."),
  bedrooms: z.coerce.number().min(1, "Mínimo de 1 quarto.").max(20, "Máximo de 20 quartos."),
  bathrooms: z.coerce.number().min(1, "Mínimo de 1 banheiro.").max(20, "Máximo de 20 banheiros."),
  areaTotal: z.coerce.number().min(20, "Área mínima de 20 m²."),
  description: z.string().trim().min(10, "Descreva melhor o imóvel.").max(2500, "Máximo de 2500 caracteres."),
  location: z.string().trim().min(5, "Informe a localização."),
  amenities: z.array(z.string()).min(1, "Selecione pelo menos uma comodidade."),
  brokerName: z.string().trim().min(3, "Informe o nome do corretor responsável.").max(100, "Máximo de 100 caracteres."),
  brokerPhone: z.string().trim().min(10, "Informe um telefone válido.").max(20, "Máximo de 20 caracteres."),
  purpose: z.enum(["venda", "aluguel", "lancamento"]),
  parkingSpots: z.coerce.number().min(0, "Não pode ser negativo.").max(20, "Máximo de 20 vagas."),
});

const Anunciar = () => {
  const navigate = useNavigate();
  const createProperty = useCreateProperty();
  const [photos, setPhotos] = useState<File[]>([]);
  const form = useForm<z.infer<typeof propertySchema>>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      price: 0,
      bedrooms: 3,
      bathrooms: 2,
      areaTotal: 200,
      description: "",
      location: "",
      amenities: [],
      brokerName: "",
      brokerPhone: "",
      purpose: "venda",
      parkingSpots: 1,
    },
  });
  const photoPreviews = useMemo(() => photos.map((photo) => URL.createObjectURL(photo)), [photos]);
  const watchedLocation = form.watch("location");
  const previewMapUrl = `https://www.google.com/maps?q=${encodeURIComponent(watchedLocation || "Brasília DF")}&output=embed`;

  useEffect(() => () => photoPreviews.forEach((url) => URL.revokeObjectURL(url)), [photoPreviews]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const property = await createProperty.mutateAsync({
        title: values.title,
        price: values.price,
        bedrooms: values.bedrooms,
        bathrooms: values.bathrooms,
        areaTotal: values.areaTotal,
        parkingSpots: values.parkingSpots,
        description: values.description,
        location: values.location,
        amenities: values.amenities,
        brokerName: values.brokerName,
        brokerPhone: values.brokerPhone,
        purpose: values.purpose,
        photos,
      });
      toast.success("Imóvel anunciado com sucesso!");
      navigate(`/imovel/${property.slug}`);
      
    } catch (error) {
      console.error("Erro ao publicar:", error);
      toast.error("Erro de conexão com o banco de dados.");
    }
  });
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-body uppercase tracking-[0.18em] text-muted-foreground">Publicação</p>
          <h1 className="mt-2 text-3xl font-display font-bold text-foreground sm:text-4xl">Anunciar imóvel</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Preencha os dados do imóvel para publicar um anúncio completo, com detalhes para o catálogo, página de destaque e painel administrativo.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <form onSubmit={onSubmit} className="grid gap-8 rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6 lg:grid-cols-2">
          <div className="space-y-5 lg:col-span-2">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input id="title" placeholder="Ex.: Apartamento com varanda gourmet" {...form.register("title")} />
              <p className="mt-1 text-xs text-destructive">{form.formState.errors.title?.message}</p>
            </div>
          </div>

          <div>
            <Label htmlFor="price">Valor</Label>
            <Input id="price" type="number" inputMode="numeric" {...form.register("price")} />
            <p className="mt-1 text-xs text-destructive">{form.formState.errors.price?.message}</p>
          </div>

          <div>
            <Label htmlFor="purpose">Finalidade</Label>
            <select id="purpose" {...form.register("purpose")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground">
              <option value="venda">Venda</option>
              <option value="aluguel">Aluguel</option>
              <option value="lancamento">Lançamento</option>
            </select>
          </div>

          <div>
            <Label htmlFor="bedrooms">Quartos</Label>
            <Input id="bedrooms" type="number" {...form.register("bedrooms")} />
            <p className="mt-1 text-xs text-destructive">{form.formState.errors.bedrooms?.message}</p>
          </div>

          <div>
            <Label htmlFor="bathrooms">Banheiros</Label>
            <Input id="bathrooms" type="number" {...form.register("bathrooms")} />
            <p className="mt-1 text-xs text-destructive">{form.formState.errors.bathrooms?.message}</p>
          </div>

          <div>
            <Label htmlFor="areaTotal">Área total (m²)</Label>
            <Input id="areaTotal" type="number" {...form.register("areaTotal")} />
            <p className="mt-1 text-xs text-destructive">{form.formState.errors.areaTotal?.message}</p>
          </div>

          <div>
            <Label htmlFor="parkingSpots">Vagas</Label>
            <Input id="parkingSpots" type="number" {...form.register("parkingSpots")} />
            <p className="mt-1 text-xs text-destructive">{form.formState.errors.parkingSpots?.message}</p>
          </div>

          <div className="lg:col-span-2">
            <Label htmlFor="location">Localização</Label>
            <Input id="location" placeholder="Bairro, cidade e estado" {...form.register("location")} />
            <p className="mt-1 text-xs text-destructive">{form.formState.errors.location?.message}</p>
          </div>

          <div className="lg:col-span-2">
            <Label htmlFor="photos">Fotos do imóvel</Label>
            <label
              htmlFor="photos"
              className="mt-2 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface px-4 py-6 text-center transition-colors hover:border-primary hover:bg-background"
            >
              <ImagePlus className="h-9 w-9 text-primary" />
              <span className="mt-3 text-sm font-display font-semibold text-foreground">Selecionar fotos</span>
              <span className="mt-1 text-xs text-muted-foreground">Use imagens JPG, PNG ou WebP. A primeira foto vira a capa do anúncio.</span>
            </label>
            <Input
              id="photos"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              className="sr-only"
              onChange={(event) => {
                const selectedPhotos = Array.from(event.target.files ?? []);
                setPhotos((current) => [...current, ...selectedPhotos].slice(0, 8));
                event.target.value = "";
              }}
            />
            {photoPreviews.length ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {photoPreviews.map((preview, index) => (
                  <div key={preview} className="relative overflow-hidden rounded-lg border border-border bg-card">
                    <img src={preview} alt={`Foto selecionada ${index + 1}`} className="h-36 w-full object-cover" />
                    <button
                      type="button"
                      aria-label="Remover foto"
                      onClick={() => setPhotos((current) => current.filter((_, photoIndex) => photoIndex !== index))}
                      className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-card/90 text-foreground shadow-sm backdrop-blur"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {index === 0 ? <span className="absolute bottom-2 left-2 rounded-full bg-primary px-3 py-1 text-xs font-display font-semibold text-primary-foreground">Capa</span> : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="lg:col-span-2">
            <Label htmlFor="description">Descrição completa</Label>
            <Textarea id="description" rows={7} placeholder="Destaques do imóvel, estrutura, condomínio e vizinhança." {...form.register("description")} />
            <p className="mt-1 text-xs text-destructive">{form.formState.errors.description?.message}</p>
          </div>

          <div className="lg:col-span-2 overflow-hidden rounded-lg border border-border bg-card">
            <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 text-sm font-display font-semibold text-foreground">
                  <MapPin className="h-4 w-4 text-primary" /> Prévia do mapa
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{watchedLocation || "Digite a localização para visualizar o endereço do anúncio."}</p>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(watchedLocation || "Brasília DF")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-10 items-center justify-center rounded-md border border-border px-4 text-sm font-display font-semibold text-foreground transition-colors hover:bg-surface"
              >
                Abrir no Maps
              </a>
            </div>
            <iframe title="Prévia do mapa do imóvel" src={previewMapUrl} className="h-72 w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>

          <div className="lg:col-span-2">
            <Label>Comodidades</Label>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {amenitiesOptions.map((amenity) => {
                const selectedAmenities = form.watch("amenities");
                const checked = selectedAmenities.includes(amenity);
                return (
                  <label key={amenity} className="flex items-center gap-3 rounded-md border border-border bg-surface px-4 py-3 text-sm text-foreground">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(checkedState) => {
                        const next = checkedState
                          ? [...selectedAmenities, amenity]
                          : selectedAmenities.filter((item) => item !== amenity);
                        form.setValue("amenities", next, { shouldValidate: true });
                      }}
                    />
                    {amenity}
                  </label>
                );
              })}
            </div>
            <p className="mt-1 text-xs text-destructive">{form.formState.errors.amenities?.message}</p>
          </div>

          <div>
            <Label htmlFor="brokerName">Nome do corretor responsável</Label>
            <Input id="brokerName" {...form.register("brokerName")} />
            <p className="mt-1 text-xs text-destructive">{form.formState.errors.brokerName?.message}</p>
          </div>

          <div>
            <Label htmlFor="brokerPhone">Telefone</Label>
            <Input id="brokerPhone" type="tel" placeholder="(11) 99999-9999" {...form.register("brokerPhone")} />
            <p className="mt-1 text-xs text-destructive">{form.formState.errors.brokerPhone?.message}</p>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => navigate("/imoveis")} className="inline-flex min-h-11 items-center justify-center rounded-md border border-border px-5 text-sm font-display font-semibold text-foreground transition-colors hover:bg-surface">
              Cancelar
            </button>
            <button type="submit" disabled={createProperty.isPending} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-display font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60">
              {createProperty.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Publicar anúncio
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Anunciar;
