import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Clock, Instagram } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { ProductCard, categoryNameOf } from "@/components/site/ProductCard";
import {
  categoriesQuery,
  galleryQuery,
  offersQuery,
  productsQuery,
  shopSettingsQuery,
  whatsappLink,
} from "@/lib/shop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maison Kaira — Style That Defines You" },
      {
        name: "description",
        content:
          "A contemporary clothing boutique in Bandra, Mumbai. Browse the collection, discover seasonal offers and visit us in store.",
      },
      { property: "og:title", content: "Maison Kaira — Style That Defines You" },
      {
        property: "og:description",
        content:
          "Contemporary fashion, everyday essentials and seasonal styles — browse the collection and visit our Mumbai store.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: shop } = useQuery(shopSettingsQuery);
  const { data: categories } = useQuery(categoriesQuery);
  const { data: products } = useQuery(productsQuery);
  const { data: offers } = useQuery(offersQuery);
  const { data: gallery } = useQuery(galleryQuery);

  const wa = shop?.whatsapp ?? "";
  const active = (products ?? []).filter((p) => p.is_published);
  const newArrivals = active.filter((p) => p.is_new_arrival).slice(0, 4);
  const trending = active.filter((p) => p.is_trending).slice(0, 6);
  const featured = active.find((p) => p.is_featured);

  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative">
        <div className="grid min-h-[78vh] md:grid-cols-[1fr_1.05fr]">
          <div className="order-2 flex flex-col justify-center px-5 py-14 md:order-1 md:px-14 lg:px-20">
            <p className="eyebrow">{shop?.shop_name ?? "Maison Kaira"}</p>
            <h1 className="mt-6 font-display text-[3.25rem] leading-[0.98] tracking-tight md:text-[5.5rem]">
              Style That
              <br />
              Defines You
            </h1>
            <p className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground">
              Discover our latest collection of contemporary fashion, everyday essentials and
              seasonal styles.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/collection"
                className="bg-ink px-9 py-4 text-center text-[0.7rem] tracking-[0.18em] uppercase text-ink-foreground transition-colors hover:bg-accent"
              >
                Explore Collection
              </Link>
              <a
                href={shop?.maps_url ?? "#"}
                target="_blank"
                rel="noreferrer"
                className="border border-foreground px-9 py-4 text-center text-[0.7rem] tracking-[0.18em] uppercase transition-colors hover:bg-foreground hover:text-background"
              >
                Visit Our Store
              </a>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <img
              src="/images/hero.jpg"
              alt="Model wearing the new season collection"
              width={1600}
              height={1920}
              className="h-[58vh] w-full object-cover md:h-full"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-4xl md:text-6xl">Shop by Category</h2>
          <Link
            to="/collection"
            className="link-rule hidden text-[0.7rem] tracking-[0.16em] uppercase text-muted-foreground md:block"
          >
            All Collections
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
          {(categories ?? []).map((cat, i) => (
            <Link
              key={cat.id}
              to="/collection"
              search={{ category: cat.slug }}
              className="group block"
            >
              <div
                className={`media-zoom ${
                  i % 4 === 0 || i % 4 === 3 ? "aspect-[3/4]" : "aspect-[3/4] md:mt-10"
                }`}
              >
                <img
                  src={cat.image_url ?? "/images/hero.jpg"}
                  alt={cat.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mt-4 font-display text-2xl">{cat.name}</h3>
              <span className="eyebrow group-hover:text-accent">Explore</span>
            </Link>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="bg-surface">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
          <p className="eyebrow">Fresh styles, new looks.</p>
          <h2 className="mt-4 font-display text-4xl md:text-6xl">New Arrivals</h2>
          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {newArrivals.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                categoryName={categoryNameOf(categories, p.category_id)}
                whatsapp={wa}
              />
            ))}
          </div>
          <Link
            to="/new-arrivals"
            className="link-rule mt-14 inline-block text-[0.7rem] tracking-[0.16em] uppercase"
          >
            See all new arrivals
          </Link>
        </div>
      </section>

      {/* Featured editorial */}
      <section className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 py-20 md:grid-cols-2 md:gap-20 md:px-10 md:py-28">
        <div className="media-zoom aspect-[4/5]">
          <img
            src="/images/editorial.jpg"
            alt="The new collection"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="eyebrow">Featured</p>
          <h2 className="mt-5 font-display text-4xl leading-tight md:text-6xl">
            The New
            <br />
            Collection
          </h2>
          <p className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground">
            Softer tailoring, deeper neutrals and fabrics chosen for the way the season actually
            feels. Cut generously, finished by hand, meant to be worn often.
          </p>
          {featured && (
            <p className="mt-6 text-sm text-muted-foreground">
              Currently in store: <span className="text-foreground">{featured.name}</span>
            </p>
          )}
          <Link
            to="/collection"
            className="mt-10 inline-block border border-foreground px-9 py-4 text-[0.7rem] tracking-[0.18em] uppercase transition-colors hover:bg-foreground hover:text-background"
          >
            Explore Collection
          </Link>
        </div>
      </section>

      {/* Trending */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <h2 className="font-display text-4xl md:text-6xl">Trending Now</h2>
        </div>
        <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 md:px-10">
          {trending.map((p) => (
            <div key={p.id} className="w-[72vw] shrink-0 snap-start sm:w-[42vw] lg:w-[23vw]">
              <ProductCard
                product={p}
                categoryName={categoryNameOf(categories, p.category_id)}
                whatsapp={wa}
                compact
              />
            </div>
          ))}
        </div>
      </section>

      {/* Offers */}
      {(offers ?? []).length > 0 && (
        <section className="bg-surface">
          <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
            <h2 className="font-display text-4xl md:text-6xl">Special Offers</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {(offers ?? []).slice(0, 2).map((offer) => (
                <article key={offer.id} className="group">
                  <div className="media-zoom aspect-[4/3]">
                    <img
                      src={offer.image_url ?? "/images/offer-festive.jpg"}
                      alt={offer.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="mt-6">
                    <p className="eyebrow">{offer.title}</p>
                    <h3 className="mt-2 font-display text-3xl">{offer.headline}</h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                      {offer.description}
                    </p>
                    {offer.expires_at && (
                      <p className="mt-3 text-xs text-accent">
                        Valid until {new Date(offer.expires_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                        })}
                      </p>
                    )}
                    <Link
                      to="/offers"
                      className="link-rule mt-5 inline-block text-[0.7rem] tracking-[0.16em] uppercase"
                    >
                      View Collection
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About */}
      <section className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 py-20 md:grid-cols-2 md:gap-20 md:px-10 md:py-28">
        <div className="media-zoom aspect-[4/5] md:order-1">
          <img
            src="/images/store-interior.jpg"
            alt="Inside the store"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="md:order-2">
          <p className="eyebrow">Our Story</p>
          <h2 className="mt-5 font-display text-4xl leading-tight md:text-5xl">
            Eighteen years of dressing a city
          </h2>
          <p className="mt-7 text-base leading-relaxed text-muted-foreground">{shop?.about_text}</p>
          <Link
            to="/about"
            className="link-rule mt-8 inline-block text-[0.7rem] tracking-[0.16em] uppercase"
          >
            Know More
          </Link>
        </div>
      </section>

      {/* Store experience */}
      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
          <h2 className="font-display text-4xl md:text-6xl">Visit Our Store</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="media-zoom aspect-[4/3] md:col-span-2">
              <img
                src="/images/store-exterior.jpg"
                alt="Store exterior"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="media-zoom aspect-[4/3]">
              <img
                src="/images/store-interior.jpg"
                alt="Clothing displays inside the store"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="mt-12 grid gap-8 text-sm md:grid-cols-3">
            <p className="flex gap-3 text-ink-foreground/75">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              {shop?.address}
            </p>
            <p className="flex gap-3 whitespace-pre-line text-ink-foreground/75">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              {shop?.opening_hours}
            </p>
            <p className="flex gap-3 text-ink-foreground/75">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <a href={`tel:${shop?.phone ?? ""}`} className="link-rule">
                {shop?.phone}
              </a>
            </p>
          </div>
          <a
            href={shop?.maps_url ?? "#"}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-block border border-ink-foreground/30 px-9 py-4 text-[0.7rem] tracking-[0.18em] uppercase transition-colors hover:border-accent hover:text-accent"
          >
            Get Directions
          </a>
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-4xl md:text-6xl">Style In Real Life</h2>
          <a
            href={shop?.instagram ?? "#"}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-[0.7rem] tracking-[0.16em] uppercase text-muted-foreground transition-colors hover:text-accent"
          >
            <Instagram className="h-4 w-4" /> Follow Us
          </a>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {(gallery ?? []).slice(0, 6).map((item) => (
            <div key={item.id} className="media-zoom aspect-square">
              <img
                src={item.image_url}
                alt={item.caption || "Store gallery"}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-surface">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start gap-8 px-5 py-20 md:flex-row md:items-center md:justify-between md:px-10 md:py-24">
          <h2 className="font-display text-4xl md:text-6xl">Let's Talk Fashion</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappLink(wa, "Hello, I would like to enquire about your collection.")}
              target="_blank"
              rel="noreferrer"
              className="bg-ink px-9 py-4 text-center text-[0.7rem] tracking-[0.18em] uppercase text-ink-foreground transition-colors hover:bg-accent"
            >
              WhatsApp Us
            </a>
            <Link
              to="/contact"
              className="border border-foreground px-9 py-4 text-center text-[0.7rem] tracking-[0.18em] uppercase transition-colors hover:bg-foreground hover:text-background"
            >
              Send an Enquiry
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
