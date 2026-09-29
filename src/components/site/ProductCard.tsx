import { Link } from "@tanstack/react-router";
import { formatPrice, productEnquiryLink, type Category, type Product } from "@/lib/shop";

export function ProductCard({
  product,
  categoryName,
  whatsapp,
  compact = false,
}: {
  product: Product;
  categoryName?: string | undefined;
  whatsapp: string;
  compact?: boolean;
}) {
  return (
    <article className="group flex flex-col">
      <Link
        to="/collection/$slug"
        params={{ slug: product.slug }}
        className="media-zoom block aspect-[3/4]"
      >
        <img
          src={product.image_url ?? "/images/hero.jpg"}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        {categoryName && <p className="eyebrow">{categoryName}</p>}
        <h3 className="mt-2 font-display text-xl leading-snug">
          <Link to="/collection/$slug" params={{ slug: product.slug }} className="link-rule">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-foreground">{formatPrice(product.price)}</p>

        {!compact && (
          <>
            {product.sizes.length > 0 && (
              <p className="mt-3 text-xs tracking-wide text-muted-foreground">
                {product.sizes.join(" · ")}
              </p>
            )}
            {product.colors.length > 0 && (
              <p className="mt-1 text-xs tracking-wide text-muted-foreground">
                {product.colors.join(" · ")}
              </p>
            )}
            <div className="mt-5 flex gap-2">
              <Link
                to="/collection/$slug"
                params={{ slug: product.slug }}
                className="flex-1 border border-foreground px-4 py-2.5 text-center text-[0.68rem] tracking-[0.16em] uppercase transition-colors hover:bg-foreground hover:text-background"
              >
                View Details
              </Link>
              <a
                href={productEnquiryLink(whatsapp, product.name)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 border border-border px-4 py-2.5 text-center text-[0.68rem] tracking-[0.16em] uppercase text-muted-foreground transition-colors hover:border-accent hover:text-accent"
              >
                Enquire
              </a>
            </div>
          </>
        )}

        {compact && (
          <Link
            to="/collection/$slug"
            params={{ slug: product.slug }}
            className="link-rule mt-4 w-fit text-[0.68rem] tracking-[0.16em] uppercase"
          >
            View Details
          </Link>
        )}
      </div>
    </article>
  );
}

export function categoryNameOf(categories: Category[] | undefined, id: string | null) {
  return categories?.find((c) => c.id === id)?.name;
}
