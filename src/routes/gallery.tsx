import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Instagram } from "lucide-react";
import { SiteShell, PageHeading } from "@/components/site/SiteShell";
import { galleryQuery, shopSettingsQuery } from "@/lib/shop";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Style In Real Life — Maison Kaira" },
      {
        name: "description",
        content: "Photographs from the store, the rails and the people wearing our pieces.",
      },
      { property: "og:title", content: "Style In Real Life — Maison Kaira" },
      {
        property: "og:description",
        content: "Photographs from the store, the rails and the people wearing our pieces.",
      },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  const { data: gallery } = useQuery(galleryQuery);
  const { data: shop } = useQuery(shopSettingsQuery);

  return (
    <SiteShell>
      <PageHeading eyebrow="Gallery" title="Style In Real Life" />

      <div className="mx-auto max-w-[1400px] px-5 pb-24 md:px-10">
        <a
          href={shop?.instagram ?? "#"}
          target="_blank"
          rel="noreferrer"
          className="mb-10 inline-flex items-center gap-2 text-[0.7rem] tracking-[0.16em] uppercase text-muted-foreground transition-colors hover:text-accent"
        >
          <Instagram className="h-4 w-4" /> Follow Us
        </a>

        <div className="columns-2 gap-3 md:columns-3 lg:columns-4">
          {(gallery ?? []).map((item) => (
            <figure key={item.id} className="media-zoom mb-3 break-inside-avoid">
              <img
                src={item.image_url}
                alt={item.caption || "Store gallery"}
                loading="lazy"
                className="w-full"
              />
              {item.caption && (
                <figcaption className="bg-background pt-2 text-xs text-muted-foreground">
                  {item.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
