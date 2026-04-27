import { Building2, Menu, Shield, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const navItems = [
  { label: "Comprar", to: "/imoveis?purpose=venda" },
  { label: "Alugar", to: "/imoveis?purpose=aluguel" },
  { label: "Destaques", to: "/destaques" },
  { label: "Contato", to: "/#contato" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-body transition-colors hover:text-foreground ${isActive ? "text-foreground" : "text-muted-foreground"}`;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between w-full gap-6">
          <Link to="/" className="flex items-center gap-2">
            <Building2 className="h-7 w-7 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">MeuLAR</span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              item.to.startsWith('/#') ? (
                <a key={item.label} href={item.to} className="text-sm font-body text-muted-foreground transition-colors hover:text-foreground">
                  {item.label}
                </a>
              ) : (
                <NavLink key={item.label} to={item.to} className={linkClass}>
                  {item.label}
                </NavLink>
              )
            ))}
            <NavLink to="/admin" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground transition-colors hover:text-foreground">
              <Shield className="h-4 w-4" /> Admin
            </NavLink>
            <Link
              to="/anunciar"
              className="inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-display font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Anunciar
            </Link>
          </div>

          <button type="button" className="inline-flex md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Abrir menu">
            {open ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-card px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              item.to.startsWith('/#') ? (
                <a key={item.label} href={item.to} className="rounded-md px-2 py-3 text-sm font-body text-muted-foreground transition-colors hover:bg-surface hover:text-foreground" onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              ) : (
                <NavLink key={item.label} to={item.to} className="rounded-md px-2 py-3 text-sm font-body text-muted-foreground transition-colors hover:bg-surface hover:text-foreground" onClick={() => setOpen(false)}>
                  {item.label}
                </NavLink>
              )
            ))}
            <NavLink to="/admin" className="rounded-md px-2 py-3 text-sm font-body text-muted-foreground transition-colors hover:bg-surface hover:text-foreground" onClick={() => setOpen(false)}>
              Admin
            </NavLink>
            <Link to="/anunciar" className="mt-1 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-display font-semibold text-primary-foreground" onClick={() => setOpen(false)}>
              Anunciar
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
