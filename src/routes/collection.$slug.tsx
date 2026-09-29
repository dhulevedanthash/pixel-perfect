import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Phone } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { ProductCard, categoryNameOf } from "@/components/site/ProductCard";
import {
  categoriesQuery,
  fetchProductBySlug,
  formatPrice,
  productEnquiryLink,
  productsQuery,
  shopSettingsQuery,
} from "@/lib/shop";

export const Route = createFileRoute("/collection/$slug")({
  loader: async ({ params }) => {
    const product = await fetchProductBySlug(params.slug);
    if (!product || !product.is_published) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Piece not found — Maison Kaira" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product } = loaderData;
    const description =
      product.description || `${product.name} — available to try at our Mumbai store.`;
    return {
      meta: [
        { title: `${product.name} — Maison Kaira` },
        { name: "description", content: description },
        { property: "og:title", content: `${product.name} — Maison Kaira` },
        { property: "og:description", content: description },
      ],
    };
  },
  notFoundComponent: ProductNotFound,
  component: ProductDetail,
});

function ProductNotFound() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-[1400px] px-5 py-32 text-center md:px-10">
        <h1 className="font-display text-5xl">This piece isn't available</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          It may have sold out or been taken off the catalogue.
        </p>
        <Link
          to="/collection"
          className="link-rule mt-8 inline-block text-[0.7rem] tracking-[0.16em] uppercase"
        >
          Back to collection
        </Link>
      </div>
    </SiteShell>
  );
}

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const { data: categories } = useQuery(categoriesQuery);
  const { data: products } = useQuery(productsQuery);
  const { data: shop } = useQuery(shopSettingsQuery);
  const [activeImage, setActiveImage] = useState(0);

  const images = product.images.length > 0 ? product.images : [product.image_url ?? "/images/hero.jpg"];
  const categoryName = categoryNameOf(categories, product.category_id);
  const similar = (products ?? [])
    .filter((p) => p.is_published && p.id !== product.id && p.category_id === product.category_id)
    .slice(0, 4);

  return (
    <SiteShell>
      <div className="mx-auto max-w-[1400px] px-5 pt-8 md:px-10">
        <Link to="/collection" className="link-rule eyebrow">
          ← Collection
        </Link>
      </div>

      <section className="mx-auto grid max-w-[1400px] gap-10 px-5 py-10 md:grid-cols-2 md:gap-16 md:px-10 md:py-16">
        <div>
          <div className="media-zoom aspect-[3/4]">
            <img
              src={images[activeImage]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square w-20 overflow-hidden border ${
                    i === activeImage ? "border-foreground" : "border-transparent"
                  }`}
                >
                  <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="md:pt-6">
          {categoryName && <p className="eyebrow">{categoryName}</p>}
          <h1 className="mt-4 font-display text-4xl leading-tight md:text-6xl">{product.name}</h1>
          <p className="mt-5 text-xl">{formatPrice(product.price)}</p>
          <p className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <dl className="mt-10 space-y-5 border-t border-border pt-8 text-sm">
            <Spec label="Sizes" value={product.sizes.join(" · ")} />
            <Spec label="Colours" value={product.colors.join(" · ")} />
            <Spec label="Material" value={product.material} />
            <Spec label="Availability" value={product.availability} />
          </dl>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href={productEnquiryLink(shop?.whatsapp ?? "", product.name)}
              target="_blank"
              rel="noreferrer"
              className="bg-ink px-8 py-4 text-center text-[0.7rem] tracking-[0.18em] uppercase text-ink-foreground transition-colors hover:bg-accent"
            >
              Enquire on WhatsApp
            </a>
            <a
              href={`tel:${shop?.phone ?? ""}`}
              className="flex items-center justify-center gap-2 border border-foreground px-8 py-4 text-[0.7rem] tracking-[0.18em] uppercase transition-colors hover:bg-foreground hover:text-background"
            >
              <Phone className="h-3.5 w-3.5" /> Call Store
            </a>
          </div>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="bg-surface">
          <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-24">
            <h2 className="font-display text-3xl md:text-5xl">Similar Styles</h2>
            <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
              {similar.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  categoryName={categoryNameOf(categories, p.category_id)}
                  whatsapp={shop?.whatsapp ?? ""}
                  compact
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteShell>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-6">
      <dt className="eyebrow w-28 shrink-0">{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}
