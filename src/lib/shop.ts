import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Product = Tables<"products">;
export type Category = Tables<"categories">;
export type Offer = Tables<"offers">;
export type GalleryItem = Tables<"gallery">;
export type Enquiry = Tables<"enquiries">;
export type ShopSettings = Tables<"shop_settings">;

function unwrap<T>(res: { data: unknown; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

export const shopSettingsQuery = queryOptions({
  queryKey: ["shop_settings"],
  queryFn: async () =>
    unwrap<ShopSettings>(await supabase.from("shop_settings").select("*").eq("id", 1).single()),
  staleTime: 60_000,
});

export const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: async () =>
    unwrap<Category[]>(await supabase.from("categories").select("*").order("sort_order")),
});

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: async () =>
    unwrap<Product[]>(
      await supabase.from("products").select("*").order("created_at", { ascending: false }),
    ),
});

export const offersQuery = queryOptions({
  queryKey: ["offers"],
  queryFn: async () =>
    unwrap<Offer[]>(await supabase.from("offers").select("*").order("created_at", { ascending: false })),
});

export const galleryQuery = queryOptions({
  queryKey: ["gallery"],
  queryFn: async () => unwrap<GalleryItem[]>(await supabase.from("gallery").select("*").order("sort_order")),
});

export const enquiriesQuery = queryOptions({
  queryKey: ["enquiries"],
  queryFn: async () =>
    unwrap<Enquiry[]>(await supabase.from("enquiries").select("*").order("created_at", { ascending: false })),
});

export async function fetchProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export function productQuery(slug: string) {
  return queryOptions({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug),
  });
}

export function formatPrice(value: number | string) {
  const n = typeof value === "string" ? Number(value) : value;
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function whatsappLink(number: string, message: string) {
  const digits = (number || "").replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function productEnquiryLink(number: string, productName: string) {
  return whatsappLink(
    number,
    `Hello, I am interested in ${productName}. Please provide more details.`,
  );
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function parseList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
