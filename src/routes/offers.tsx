import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteShell, PageHeading } from "@/components/site/SiteShell";
import { offersQuery } from "@/lib/shop";

export const Route = createFileRoute("/offers")({
  head: () => ({
    meta: [
      { title: "Special Offers — Maison Kaira" },
      {
        name: "description",
        content: "Current in-store offers on festive wear, denim and seasonal collections.",
      },
      { property: "og:title", content: "Special Offers — Maison Kaira" },
      {
        property: "og:description",
        content: "Current in-store offers on festive wear, denim and seasonal collections.",
      },
    ],
  }),
  component: Offers,
});

function Offers() {
  const { data: offers } = useQuery(offersQuery);
  const live = (offers ?? []).filter(
    (o) => o.is_active && (!o.expires_at || new Date(o.expires_at) >= new Date(new Date().toDateString())),
  );

  return (
    <SiteShell>
      <PageHeading
        eyebrow="Limited Time"
        title="Special Offers"
        intro="Offers run in store only. Mention them at the counter or message us before you visit."
      />

      <div className="mx-auto max-w-[1400px] space-y-20 px-5 pb-24 md:px-10">
        {live.map((offer, i) => (
          <article key={offer.id} className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
            <div className={`media-zoom aspect-[4/3] ${i % 2 ? "md:order-2" : ""}`}>
              <img
                src={offer.image_url ?? "/images/offer-festive.jpg"}
                alt={offer.title}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="eyebrow">{offer.title}</p>
              <h2 className="mt-4 font-display text-4xl md:text-6xl">{offer.headline}</h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
                {offer.description}
              </p>
              {offer.expires_at && (
                <p className="mt-5 text-sm text-accent">
                  Valid until{" "}
                  {new Date(offer.expires_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
              <Link
                to="/collection"
                className="mt-8 inline-block border border-foreground px-9 py-4 text-[0.7rem] tracking-[0.18em] uppercase transition-colors hover:bg-foreground hover:text-background"
              >
                View Collection
              </Link>
            </div>
          </article>
        ))}

        {live.length === 0 && (
          <p className="py-20 text-center text-sm text-muted-foreground">
            No offers are running right now — new ones are announced here and on Instagram.
          </p>
        )}
      </div>
    </SiteShell>
  );
}
