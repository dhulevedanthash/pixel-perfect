import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categoriesQuery, slugify, type Category } from "@/lib/shop";
import { Field, PanelHeader, EmptyRow } from "./ui";

export function CategoriesPanel() {
  const qc = useQueryClient();
  const { data: categories } = useQuery(categoriesQuery);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const refresh = () => qc.invalidateQueries({ queryKey: ["categories"] });

  const add = async () => {
    if (!name.trim()) return;
    const { error } = await supabase.from("categories").insert({
      name: name.trim(),
      slug: slugify(name),
      image_url: imageUrl || null,
      sort_order: (categories?.length ?? 0) + 1,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    setName("");
    setImageUrl("");
    toast.success("Category added.");
    refresh();
  };

  const update = async (cat: Category, patch: Partial<Category>) => {
    const { error } = await supabase.from("categories").update(patch).eq("id", cat.id);
    if (error) toast.error(error.message);
    else refresh();
  };

  const remove = async (cat: Category) => {
    if (!window.confirm(`Delete the ${cat.name} category?`)) return;
    const { error } = await supabase.from("categories").delete().eq("id", cat.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Category deleted.");
      refresh();
    }
  };

  return (
    <div>
      <PanelHeader
        title="Categories"
        description="Groups shown on the home page and used to filter the catalogue."
      />

      <div className="mb-8 grid gap-4 rounded-md border border-border p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <Field label="New category">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ethnic" />
        </Field>
        <Field label="Image URL">
          <Input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="/images/cat-women.jpg"
          />
        </Field>
        <Button onClick={add}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      <div className="divide-y divide-border border-y border-border">
        {(categories ?? []).map((cat) => (
          <div key={cat.id} className="flex items-center gap-4 py-3">
            <img
              src={cat.image_url ?? "/images/hero.jpg"}
              alt=""
              className="h-14 w-12 shrink-0 object-cover"
            />
            <Input
              defaultValue={cat.name}
              onBlur={(e) =>
                e.target.value !== cat.name && update(cat, { name: e.target.value })
              }
              className="max-w-48"
            />
            <Input
              defaultValue={cat.image_url ?? ""}
              onBlur={(e) =>
                e.target.value !== (cat.image_url ?? "") &&
                update(cat, { image_url: e.target.value || null })
              }
              className="flex-1"
            />
            <Button variant="ghost" size="icon" onClick={() => remove(cat)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {(categories ?? []).length === 0 && <EmptyRow>No categories yet.</EmptyRow>}
      </div>
    </div>
  );
}
