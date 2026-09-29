import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { shopSettingsQuery, whatsappLink } from "@/lib/shop";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/collection", label: "Collections" },
  { to: "/new-arrivals", label: "New Arrivals" },
  { to: "/offers", label: "Offers" },
  { to: "/about", label: "About" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { data: shop } = useQuery(shopSettingsQuery);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const wa = whatsappLink(
    shop?.whatsapp ?? "",
    `Hello ${shop?.shop_name ?? ""}, I would like to know more about your collection.`,
  );

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled ? "border-border bg-background/95 backdrop-blur" : "border-transparent bg-background"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:h-20 md:px-10">
        <Link to="/" className="font-display text-xl tracking-[0.18em] uppercase md:text-2xl">
          {shop?.shop_name ?? "Maison Kaira"}
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="link-rule text-[0.78rem] tracking-[0.14em] uppercase text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat with us on WhatsApp"
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:text-accent sm:flex"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
              <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.38a9.87 9.87 0 0 0 4.74 1.2c5.46 0 9.9-4.44 9.9-9.9S17.5 2 12.04 2Zm0 18.05c-1.5 0-2.98-.4-4.27-1.17l-.3-.18-3.15.82.84-3.07-.2-.32a8.14 8.14 0 0 1-1.25-4.33c0-4.5 3.66-8.15 8.15-8.15 4.5 0 8.15 3.66 8.15 8.15 0 4.5-3.66 8.15-8.15 8.15Zm4.47-6.1c-.24-.12-1.45-.72-1.68-.8-.22-.08-.39-.12-.55.12-.16.25-.62.8-.77.97-.14.16-.28.18-.52.06-.25-.12-1.04-.38-1.97-1.22-.73-.65-1.22-1.45-1.37-1.7-.14-.24-.01-.37.11-.49.11-.11.25-.28.37-.43.12-.14.16-.24.24-.4.08-.17.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.3-.22.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.17 1.72 2.62 4.16 3.68.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.45-.59 1.65-1.17.2-.57.2-1.06.14-1.17-.06-.1-.22-.16-.46-.28Z" />
            </svg>
          </a>
          <a
            href={shop?.maps_url ?? "#"}
            target="_blank"
            rel="noreferrer"
            className="hidden bg-ink px-5 py-2.5 text-[0.7rem] tracking-[0.18em] uppercase text-ink-foreground transition-colors hover:bg-accent sm:inline-block"
          >
            Visit Store
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-50 overflow-y-auto bg-background px-5 pt-6 pb-16 lg:hidden">
          <nav className="flex flex-col">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="border-b border-border py-5 font-display text-3xl"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 flex flex-col gap-3">
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="border border-border py-4 text-center text-[0.72rem] tracking-[0.18em] uppercase"
            >
              WhatsApp Us
            </a>
            <a
              href={shop?.maps_url ?? "#"}
              target="_blank"
              rel="noreferrer"
              className="bg-ink py-4 text-center text-[0.72rem] tracking-[0.18em] uppercase text-ink-foreground"
            >
              Visit Store
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
