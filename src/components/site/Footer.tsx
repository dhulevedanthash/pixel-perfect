import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Instagram, Facebook } from "lucide-react";
import { shopSettingsQuery } from "@/lib/shop";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/collection", label: "Collections" },
  { to: "/new-arrivals", label: "New Arrivals" },
  { to: "/offers", label: "Offers" },
  { to: "/about", label: "About" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

export function Footer() {
  const { data: shop } = useQuery(shopSettingsQuery);

  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-16 md:grid-cols-4 md:px-10 md:py-24">
        <div className="md:col-span-1">
          <p className="font-display text-2xl tracking-[0.16em] uppercase">
            RAJHANS COLLECTION
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-foreground/60">
            {shop?.tagline ?? "Style That Defines You"}
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href={shop?.instagram ?? "#"}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center border border-ink-foreground/25 transition-colors hover:border-accent hover:text-accent"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={shop?.facebook ?? "#"}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center border border-ink-foreground/25 transition-colors hover:border-accent hover:text-accent"
            >
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <p className="eyebrow text-ink-foreground/50">Explore</p>
          <ul className="mt-5 space-y-3 text-sm">
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="link-rule text-ink-foreground/75 hover:text-ink-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-ink-foreground/50">Contact</p>
          <ul className="mt-5 space-y-3 text-sm text-ink-foreground/75">
            <li>
              <a href={`tel:${shop?.phone ?? ""}`} className="link-rule">
                {shop?.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${shop?.email ?? ""}`} className="link-rule">
                {shop?.email}
              </a>
            </li>
            <li className="max-w-xs leading-relaxed">{shop?.address}</li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-ink-foreground/50">Opening Hours</p>
          <p className="mt-5 text-sm leading-relaxed whitespace-pre-line text-ink-foreground/75">
            {shop?.opening_hours}
          </p>
        </div>
      </div>

      <div className="border-t border-ink-foreground/12">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-5 py-6 text-xs text-ink-foreground/45 md:flex-row md:items-center md:justify-between md:px-10">
          <p>
            © {new Date().getFullYear()} {shop?.shop_name ?? "Maison Kaira"}. All rights reserved.
          </p>
          <Link to="/admin" className="link-rule w-fit">
            Store Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
