import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PropertyCard from "@/components/PropertyCard";
import { Building2, Phone, Mail, MapPin } from "lucide-react";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import property6 from "@/assets/property-6.jpg";

const properties = [
  {
    image: property1,
    title: "Apartamento de Luxo com Vista Panorâmica",
    location: "Jardins, São Paulo - SP",
    price: "R$ 1.850.000",
    bedrooms: 3,
    bathrooms: 2,
    area: 142,
    featured: true,
  },
  {
    image: property2,
    title: "Casa Clássica com Jardim Amplo",
    location: "Higienópolis, São Paulo - SP",
    price: "R$ 2.300.000",
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    featured: false,
  },
  {
    image: property3,
    title: "Cobertura Duplex com Terraço",
    location: "Leblon, Rio de Janeiro - RJ",
    price: "R$ 4.500.000",
    bedrooms: 4,
    bathrooms: 4,
    area: 320,
    featured: true,
  },
  {
    image: property4,
    title: "Studio Moderno e Aconchegante",
    location: "Vila Madalena, São Paulo - SP",
    price: "R$ 480.000",
    bedrooms: 1,
    bathrooms: 1,
    area: 38,
    featured: false,
  },
  {
    image: property5,
    title: "Casa Contemporânea com Piscina",
    location: "Alphaville, Barueri - SP",
    price: "R$ 3.200.000",
    bedrooms: 5,
    bathrooms: 4,
    area: 450,
    featured: true,
  },
  {
    image: property6,
    title: "Apartamento Gourmet Alto Padrão",
    location: "Itaim Bibi, São Paulo - SP",
    price: "R$ 1.650.000",
    bedrooms: 3,
    bathrooms: 3,
    area: 165,
    featured: false,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      {/* Properties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h2 className="text-3xl font-display font-bold text-foreground mb-2">
            Imóveis em Destaque
          </h2>
          <p className="text-muted-foreground font-body">
            Seleção especial dos melhores imóveis disponíveis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {properties.map((property, index) => (
            <PropertyCard key={index} {...property} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-primary text-primary-foreground font-display font-semibold px-10 py-3 rounded-lg hover:opacity-90 transition-opacity">
            Ver Todos os Imóveis
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-surface py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "15.000+", label: "Imóveis Disponíveis" },
            { value: "8.500+", label: "Clientes Satisfeitos" },
            { value: "120+", label: "Cidades Atendidas" },
            { value: "10+", label: "Anos de Experiência" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-display font-bold text-primary">{stat.value}</p>
              <p className="text-muted-foreground text-sm mt-1 font-body">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-6 h-6" />
                <span className="font-display font-bold text-lg">ImóvelBR</span>
              </div>
              <p className="text-primary-foreground/70 text-sm font-body leading-relaxed">
                Encontre o imóvel perfeito para você. Compra, venda e aluguel com segurança e confiança.
              </p>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-4">Links Rápidos</h4>
              <div className="flex flex-col gap-2 text-sm text-primary-foreground/70 font-body">
                <a href="#" className="hover:text-primary-foreground transition-colors">Sobre Nós</a>
                <a href="#" className="hover:text-primary-foreground transition-colors">Como Funciona</a>
                <a href="#" className="hover:text-primary-foreground transition-colors">Blog</a>
                <a href="#" className="hover:text-primary-foreground transition-colors">Termos de Uso</a>
              </div>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-4">Contato</h4>
              <div className="flex flex-col gap-3 text-sm text-primary-foreground/70 font-body">
                <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> (11) 9999-8888</span>
                <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> contato@imovelbr.com</span>
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> São Paulo, SP - Brasil</span>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-10 pt-6 text-center text-xs text-primary-foreground/50 font-body">
            © 2026 ImóvelBR. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
