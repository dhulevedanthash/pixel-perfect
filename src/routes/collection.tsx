import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search } from "lucide-react";
import { SiteShell, PageHeading } from "@/components/site/SiteShell";
import { ProductCard, categoryNameOf } from "@/components/site/ProductCard";
import { categoriesQuery, productsQuery, shopSettingsQuery } from "@/lib/shop";

type CollectionSearch = { category?: string | undefined };

export const Route = createFileRoute("/collection")({
  validateSearch: (search: Record<string, unknown>): CollectionSearch => ({
    category: typeof search['category'] === "string" ? (search['category'] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Our Collection — Maison Kaira" },
      {
        name: "description",
        content:
          "Browse the full Maison Kaira catalogue: womenswear, menswear, kidswear, denim, shirts and traditional pieces.",
      },
      { property: "og:title", content: "Our Collection — Maison Kaira" },
      {
        property: "og:description",
        content: "Browse the full clothing catalogue and enquire about any piece in store.",
      },
    ],
  }),
  component: CollectionPage,
});

function CollectionPage() {
  const { category } = Route.useSearch();
  const navigate = useNavigate({ from: "/collection" });
  const [query, setQuery] = useState("");

  const { data: categories } = useQuery(categoriesQuery);
  const { data: products } = useQuery(productsQuery);
  const { data: shop } = useQuery(shopSettingsQuery);

  const selected = categories?.find((c) => c.slug === category);
  const visible = (products ?? [])
    .filter((p) => p.is_published)
    .filter((p) => (selected ? p.category_id === selected.id : true))
    .filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()));

  const setCategory = (slug?: string) =>
    navigate({ search: slug ? { category: slug } : {}, replace: true });

  return (
    <SiteShell>
      <PageHeading
        eyebrow="The Catalogue"
        title="Our Collection"
        intro="Every piece below is available to see, touch and try at our store. Find something you like and send us an enquiry — we'll hold it for you."
      />

      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-col gap-6 border-y border-border py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
            <FilterChip active={!category} onClick={() => setCategory(undefined)} label="All" />
            {(categories ?? []).map((cat) => (
              <FilterChip
                key={cat.id}
                active={category === cat.slug}
                onClick={() => setCategory(cat.slug)}
                label={cat.name}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 border-b border-border pb-2 lg:w-64">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pieces"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-14 py-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              categoryName={categoryNameOf(categories, p.category_id)}
              whatsapp={shop?.whatsapp ?? ""}
            />
          ))}
        </div>

        {visible.length === 0 && (
          <p className="py-20 text-center text-sm text-muted-foreground">
            Nothing matches that just yet. Try another category or ask us in store.
          </p>
        )}
      </div>
    </SiteShell>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 border px-4 py-2 text-[0.68rem] tracking-[0.16em] uppercase transition-colors ${
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
