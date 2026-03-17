import { Building2, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-card/95 backdrop-blur-md sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Building2 className="w-7 h-7 text-primary" />
            <span className="font-display font-bold text-xl text-foreground">
              ImóvelBR
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">Comprar</a>
            <a href="#" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">Alugar</a>
            <a href="#" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">Lançamentos</a>
            <a href="#" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">Contato</a>
            <button className="bg-primary text-primary-foreground font-display font-semibold text-sm px-5 py-2 rounded-lg hover:opacity-90 transition-opacity">
              Anunciar
            </button>
          </div>

          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            <a href="#" className="text-sm font-body text-muted-foreground hover:text-foreground py-2">Comprar</a>
            <a href="#" className="text-sm font-body text-muted-foreground hover:text-foreground py-2">Alugar</a>
            <a href="#" className="text-sm font-body text-muted-foreground hover:text-foreground py-2">Lançamentos</a>
            <a href="#" className="text-sm font-body text-muted-foreground hover:text-foreground py-2">Contato</a>
            <button className="bg-primary text-primary-foreground font-display font-semibold text-sm px-5 py-2 rounded-lg w-full">
              Anunciar
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
