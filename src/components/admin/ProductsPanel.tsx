import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  categoriesQuery,
  formatPrice,
  parseList,
  productsQuery,
  slugify,
  type Product,
} from "@/lib/shop";
import { Field, PanelHeader, EmptyRow } from "./ui";

type Draft = {
  name: string;
  slug: string;
  category_id: string;
  price: string;
  description: string;
  image_url: string;
  images: string;
  sizes: string;
  colors: string;
  material: string;
  availability: string;
  is_published: boolean;
  is_new_arrival: boolean;
  is_featured: boolean;
  is_trending: boolean;
};

const EMPTY: Draft = {
  name: "",
  slug: "",
  category_id: "",
  price: "",
  description: "",
  image_url: "",
  images: "",
  sizes: "",
  colors: "",
  material: "",
  availability: "In stock",
  is_published: true,
  is_new_arrival: false,
  is_featured: false,
  is_trending: false,
};

function toDraft(p: Product): Draft {
  return {
    name: p.name,
    slug: p.slug,
    category_id: p.category_id ?? "",
    price: String(p.price),
    description: p.description,
    image_url: p.image_url ?? "",
    images: p.images.join(", "),
    sizes: p.sizes.join(", "),
    colors: p.colors.join(", "),
    material: p.material,
    availability: p.availability,
    is_published: p.is_published,
    is_new_arrival: p.is_new_arrival,
    is_featured: p.is_featured,
    is_trending: p.is_trending,
  };
}

export function ProductsPanel() {
  const qc = useQueryClient();
  const { data: products } = useQuery(productsQuery);
  const { data: categories } = useQuery(categoriesQuery);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const startNew = () => {
    setEditing(null);
    setDraft(EMPTY);
    setOpen(true);
  };

  const startEdit = (p: Product) => {
    setEditing(p);
    setDraft(toDraft(p));
    setOpen(true);
  };

  const save = async () => {
    if (!draft.name.trim() || !draft.price) {
      toast.error("A name and price are required.");
      return;
    }
    setSaving(true);
    const payload = {
      name: draft.name.trim(),
      slug: draft.slug.trim() || slugify(draft.name),
      category_id: draft.category_id || null,
      price: Number(draft.price),
      description: draft.description,
      image_url: draft.image_url || null,
      images: parseList(draft.images),
      sizes: parseList(draft.sizes),
      colors: parseList(draft.colors),
      material: draft.material,
      availability: draft.availability,
      is_published: draft.is_published,
      is_new_arrival: draft.is_new_arrival,
      is_featured: draft.is_featured,
      is_trending: draft.is_trending,
    };

    const { error } = editing
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);

    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editing ? "Product updated." : "Product added.");
    setOpen(false);
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  const remove = async (p: Product) => {
    if (!window.confirm(`Remove "${p.name}" from the catalogue?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Product removed.");
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  return (
    <div>
      <PanelHeader
        title="Products"
        description="Add, edit and publish the pieces shown in the catalogue."
        action={
          <Button onClick={startNew}>
            <Plus className="h-4 w-4" /> Add product
          </Button>
        }
      />

      <div className="divide-y divide-border border-y border-border">
        {(products ?? []).map((p) => (
          <div key={p.id} className="flex items-center gap-4 py-3">
            <img
              src={p.image_url ?? "/images/hero.jpg"}
              alt=""
              className="h-16 w-12 shrink-0 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{p.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatPrice(p.price)} ·{" "}
                {categories?.find((c) => c.id === p.category_id)?.name ?? "Uncategorised"}
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {!p.is_published && <Badge variant="outline">Hidden</Badge>}
                {p.is_new_arrival && <Badge variant="secondary">New</Badge>}
                {p.is_trending && <Badge variant="secondary">Trending</Badge>}
                {p.is_featured && <Badge variant="secondary">Featured</Badge>}
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => startEdit(p)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => remove(p)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {(products ?? []).length === 0 && <EmptyRow>No products yet.</EmptyRow>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit product" : "Add product"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <Input value={draft.name} onChange={(e) => set("name", e.target.value)} />
            </Field>
            <Field label="Link slug" hint="Leave empty to generate from the name.">
              <Input value={draft.slug} onChange={(e) => set("slug", e.target.value)} />
            </Field>
            <Field label="Category">
              <select
                value={draft.category_id}
                onChange={(e) => set("category_id", e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Uncategorised</option>
                {(categories ?? []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Price (₹)">
              <Input
                type="number"
                value={draft.price}
                onChange={(e) => set("price", e.target.value)}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Description">
                <Textarea
                  rows={3}
                  value={draft.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Main image URL" hint="e.g. /images/p-jeans.jpg or a full https link.">
                <Input value={draft.image_url} onChange={(e) => set("image_url", e.target.value)} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Extra image URLs" hint="Separate with commas.">
                <Input value={draft.images} onChange={(e) => set("images", e.target.value)} />
              </Field>
            </div>
            <Field label="Sizes" hint="Comma separated.">
              <Input value={draft.sizes} onChange={(e) => set("sizes", e.target.value)} />
            </Field>
            <Field label="Colours" hint="Comma separated.">
              <Input value={draft.colors} onChange={(e) => set("colors", e.target.value)} />
            </Field>
            <Field label="Material">
              <Input value={draft.material} onChange={(e) => set("material", e.target.value)} />
            </Field>
            <Field label="Availability">
              <Input
                value={draft.availability}
                onChange={(e) => set("availability", e.target.value)}
              />
            </Field>

            <div className="grid gap-3 sm:col-span-2 sm:grid-cols-2">
              <Toggle
                label="Published"
                checked={draft.is_published}
                onChange={(v) => set("is_published", v)}
              />
              <Toggle
                label="New arrival"
                checked={draft.is_new_arrival}
                onChange={(v) => set("is_new_arrival", v)}
              />
              <Toggle
                label="Trending"
                checked={draft.is_trending}
                onChange={(v) => set("is_trending", v)}
              />
              <Toggle
                label="Featured"
                checked={draft.is_featured}
                onChange={(v) => set("is_featured", v)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving…" : "Save product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm">
      {label}
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}
