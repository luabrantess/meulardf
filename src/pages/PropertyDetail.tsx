import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import {
  Heart,
  Bed,
  Bath,
  Maximize,
  MapPin,
  Share2,
  ArrowLeft,
  Car,
  Waves,
  TreePine,
  ShieldCheck,
  Wifi,
  AirVent,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Phone,
  Star,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

import img1 from "@/assets/property-detail-1.jpg";
import img2 from "@/assets/property-detail-2.jpg";
import img3 from "@/assets/property-detail-3.jpg";
import img4 from "@/assets/property-detail-4.jpg";
import img5 from "@/assets/property-detail-5.jpg";

const images = [img1, img2, img3, img4, img5];
const imageLabels = ["Sala de Estar", "Cozinha", "Quarto Principal", "Banheiro", "Varanda"];

const amenities = [
  { icon: Car, label: "2 Vagas de Garagem" },
  { icon: Waves, label: "Piscina" },
  { icon: TreePine, label: "Área Verde" },
  { icon: ShieldCheck, label: "Segurança 24h" },
  { icon: Wifi, label: "Infraestrutura de Internet" },
  { icon: AirVent, label: "Ar Condicionado Central" },
];

const PropertyDetail = () => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [scheduleForm, setScheduleForm] = useState({ name: "", phone: "", date: "", message: "" });

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Visita agendada com sucesso! Entraremos em contato em breve.");
    setScheduleForm({ name: "", phone: "", date: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar aos imóveis
        </button>
      </div>

      {/* Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 h-auto lg:h-[480px]">
          {/* Main image */}
          <div className="lg:col-span-3 relative rounded-xl overflow-hidden group">
            <img
              src={images[currentImage]}
              alt={imageLabels[currentImage]}
              className="w-full h-72 sm:h-96 lg:h-full object-cover transition-transform duration-500"
              width={1280}
              height={960}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />

            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>

            <span className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm text-foreground text-xs font-body px-3 py-1.5 rounded-full">
              {currentImage + 1} / {images.length} — {imageLabels[currentImage]}
            </span>
          </div>

          {/* Thumbnails */}
          <div className="hidden lg:flex flex-col gap-3">
            {images.slice(0, 4).map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`relative rounded-lg overflow-hidden flex-1 border-2 transition-all ${
                  currentImage === i ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt={imageLabels[i]} className="w-full h-full object-cover" loading="lazy" />
                {i === 3 && images.length > 4 && (
                  <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                    <span className="text-primary-foreground font-display font-bold text-sm">+{images.length - 4} fotos</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile thumbnails */}
        <div className="flex lg:hidden gap-2 mt-3 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                currentImage === i ? "border-accent" : "border-transparent opacity-70"
              }`}
            >
              <img src={img} alt={imageLabels[i]} className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1 bg-accent/10 text-accent text-xs font-display font-semibold px-3 py-1 rounded-full mb-3">
                    <Star className="w-3 h-3" /> Destaque
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                    Cobertura Duplex com Vista Panorâmica
                  </h1>
                  <p className="flex items-center gap-1.5 text-muted-foreground mt-2 font-body">
                    <MapPin className="w-4 h-4" /> Jardins, São Paulo - SP
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      setLiked(!liked);
                      toast(liked ? "Removido dos favoritos" : "Adicionado aos favoritos");
                    }}
                    className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all ${
                      liked
                        ? "bg-accent/10 border-accent text-accent"
                        : "border-border text-muted-foreground hover:border-accent hover:text-accent"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copiado!");
                    }}
                    className="w-11 h-11 rounded-full flex items-center justify-center border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <p className="text-3xl font-display font-bold text-primary mt-4">R$ 4.500.000</p>
              <p className="text-muted-foreground text-sm font-body mt-1">IPTU: R$ 1.200/mês • Condomínio: R$ 2.800/mês</p>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Bed, value: "4", label: "Quartos" },
                { icon: Bath, value: "4", label: "Banheiros" },
                { icon: Maximize, value: "320 m²", label: "Área Total" },
                { icon: Car, value: "3", label: "Vagas" },
              ].map((spec) => (
                <div key={spec.label} className="bg-surface rounded-xl p-4 text-center">
                  <spec.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="font-display font-bold text-foreground text-lg">{spec.value}</p>
                  <p className="text-muted-foreground text-xs font-body">{spec.label}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-display font-bold text-foreground mb-4">Sobre o Imóvel</h2>
              <div className="text-muted-foreground font-body leading-relaxed space-y-3">
                <p>
                  Magnífica cobertura duplex localizada no coração dos Jardins, um dos bairros mais nobres de São Paulo.
                  Com 320m² de área privativa, este imóvel exclusivo oferece uma vista panorâmica deslumbrante da cidade,
                  combinando sofisticação, conforto e praticidade.
                </p>
                <p>
                  O pavimento inferior conta com ampla sala de estar e jantar integradas, cozinha gourmet com ilha central,
                  lavabo social, e três suítes — sendo uma master com closet e banheira de imersão. O pavimento superior
                  abriga um espaço de home office, sala de TV, terraço com churrasqueira e piscina privativa com deck.
                </p>
                <p>
                  Acabamentos de altíssimo padrão incluem piso em mármore italiano, esquadrias em alumínio com vidro duplo,
                  iluminação planejada e automação residencial completa. O condomínio oferece infraestrutura completa com
                  academia, salão de festas, playground e segurança 24 horas.
                </p>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-display font-bold text-foreground mb-4">Comodidades</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {amenities.map((amenity) => (
                  <div
                    key={amenity.label}
                    className="flex items-center gap-3 bg-surface rounded-lg p-3"
                  >
                    <amenity.icon className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground text-sm font-body">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div>
              <h2 className="text-xl font-display font-bold text-foreground mb-4">Localização</h2>
              <div className="rounded-xl overflow-hidden border border-border">
                <iframe
                  title="Localização do imóvel"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0976951333286!2d-46.66166!3d-23.564224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sJardins%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1700000000000"
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          {/* Right - Sidebar */}
          <div className="space-y-6">
            {/* CTA Card */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm sticky top-24">
              <p className="text-2xl font-display font-bold text-primary mb-1">R$ 4.500.000</p>
              <p className="text-muted-foreground text-sm font-body mb-6">Parcelas a partir de R$ 22.000/mês</p>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="w-full bg-primary text-primary-foreground font-display font-semibold py-3.5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <CalendarDays className="w-5 h-5" /> Agendar Visita
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-display">Agendar Visita</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSchedule} className="space-y-4 mt-2">
                    <div>
                      <label className="text-sm font-body text-foreground block mb-1.5">Nome completo</label>
                      <input
                        type="text"
                        required
                        value={scheduleForm.name}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, name: e.target.value })}
                        className="w-full border border-input rounded-lg px-3 py-2.5 text-sm font-body bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Seu nome"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-body text-foreground block mb-1.5">Telefone</label>
                      <input
                        type="tel"
                        required
                        value={scheduleForm.phone}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, phone: e.target.value })}
                        className="w-full border border-input rounded-lg px-3 py-2.5 text-sm font-body bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-body text-foreground block mb-1.5">Data preferida</label>
                      <input
                        type="date"
                        required
                        value={scheduleForm.date}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                        className="w-full border border-input rounded-lg px-3 py-2.5 text-sm font-body bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-body text-foreground block mb-1.5">Mensagem (opcional)</label>
                      <textarea
                        value={scheduleForm.message}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, message: e.target.value })}
                        rows={3}
                        className="w-full border border-input rounded-lg px-3 py-2.5 text-sm font-body bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        placeholder="Alguma observação?"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-accent text-accent-foreground font-display font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Confirmar Agendamento
                    </button>
                  </form>
                </DialogContent>
              </Dialog>

              <button className="w-full mt-3 border border-primary text-primary font-display font-semibold py-3.5 rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" /> Ligar Agora
              </button>

              <div className="border-t border-border mt-6 pt-5">
                <p className="text-xs text-muted-foreground font-body mb-3">Corretor responsável</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-display font-bold text-sm">RC</span>
                  </div>
                  <div>
                    <p className="font-display font-semibold text-foreground text-sm">Rafael Costa</p>
                    <p className="text-muted-foreground text-xs font-body">CRECI 12345-SP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertyDetail;
