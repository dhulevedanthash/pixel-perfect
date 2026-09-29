import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteShell, PageHeading } from "@/components/site/SiteShell";
import { shopSettingsQuery } from "@/lib/shop";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Maison Kaira" },
      {
        name: "description",
        content:
          "Eighteen years of dressing Mumbai: how our boutique chooses fabric, fit and the pieces that last.",
      },
      { property: "og:title", content: "Our Story — Maison Kaira" },
      {
        property: "og:description",
        content: "How our Mumbai boutique chooses fabric, fit and the pieces that last.",
      },
    ],
  }),
  component: About,
});

const PILLARS = [
  { title: "Eighteen years", body: "Open on the same street since 2008, fitting three generations of the same families." },
  { title: "Quality first", body: "Natural fibres, honest construction and fabrics we've tested through a Mumbai summer." },
  { title: "Latest fashion", body: "New pieces arrive every fortnight, chosen by hand rather than by algorithm." },
  { title: "Service in person", body: "Alterations on site, styling advice at no charge and no pressure to buy." },
];

function About() {
  const { data: shop } = useQuery(shopSettingsQuery);

  return (
    <SiteShell>
      <PageHeading eyebrow="Our Story" title="A boutique, not a warehouse" />

      <section className="mx-auto grid max-w-[1400px] gap-10 px-5 pb-20 md:grid-cols-2 md:gap-16 md:px-10">
        <div className="media-zoom aspect-[4/5]">
          <img
            src="/images/store-interior.jpg"
            alt="Inside the store"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="text-lg leading-relaxed text-muted-foreground">{shop?.about_text}</p>
          <dl className="mt-12 grid gap-8 sm:grid-cols-2">
            {PILLARS.map((p) => (
              <div key={p.title}>
                <dt className="font-display text-2xl">{p.title}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-24">
          <p className="eyebrow text-ink-foreground/50">The Store</p>
          <h2 className="mt-4 max-w-2xl font-display text-3xl leading-snug md:text-5xl">
            {shop?.address}
          </h2>
          <p className="mt-6 whitespace-pre-line text-sm text-ink-foreground/70">
            {shop?.opening_hours}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href={shop?.maps_url ?? "#"}
              target="_blank"
              rel="noreferrer"
              className="border border-ink-foreground/30 px-9 py-4 text-center text-[0.7rem] tracking-[0.18em] uppercase transition-colors hover:border-accent hover:text-accent"
            >
              Get Directions
            </a>
            <Link
              to="/contact"
              className="bg-accent px-9 py-4 text-center text-[0.7rem] tracking-[0.18em] uppercase text-accent-foreground transition-opacity hover:opacity-90"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
