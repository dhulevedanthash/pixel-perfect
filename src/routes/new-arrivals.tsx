import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteShell, PageHeading } from "@/components/site/SiteShell";
import { ProductCard, categoryNameOf } from "@/components/site/ProductCard";
import { categoriesQuery, productsQuery, shopSettingsQuery } from "@/lib/shop";

export const Route = createFileRoute("/new-arrivals")({
  head: () => ({
    meta: [
      { title: "New Arrivals — Maison Kaira" },
      {
        name: "description",
        content: "The newest pieces to land in store — fresh styles, new looks, seen first here.",
      },
      { property: "og:title", content: "New Arrivals — Maison Kaira" },
      {
        property: "og:description",
        content: "The newest pieces to land in our Mumbai boutique.",
      },
    ],
  }),
  component: NewArrivals,
});

function NewArrivals() {
  const { data: products } = useQuery(productsQuery);
  const { data: categories } = useQuery(categoriesQuery);
  const { data: shop } = useQuery(shopSettingsQuery);

  const items = (products ?? []).filter((p) => p.is_published && p.is_new_arrival);

  return (
    <SiteShell>
      <PageHeading eyebrow="Fresh styles, new looks." title="New Arrivals" />
      <div className="mx-auto max-w-[1400px] px-5 pb-24 md:px-10">
        <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              categoryName={categoryNameOf(categories, p.category_id)}
              whatsapp={shop?.whatsapp ?? ""}
            />
          ))}
        </div>
        {items.length === 0 && (
          <p className="py-20 text-center text-sm text-muted-foreground">
            The next drop is on its way. Check back soon.
          </p>
        )}
      </div>
    </SiteShell>
  );
}
