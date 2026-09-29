import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { galleryQuery, type GalleryItem } from "@/lib/shop";
import { Field, PanelHeader, EmptyRow } from "./ui";

export function GalleryPanel() {
  const qc = useQueryClient();
  const { data: gallery } = useQuery(galleryQuery);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");

  const refresh = () => qc.invalidateQueries({ queryKey: ["gallery"] });

  const add = async () => {
    if (!imageUrl.trim()) {
      toast.error("An image URL is required.");
      return;
    }
    const { error } = await supabase.from("gallery").insert({
      image_url: imageUrl.trim(),
      caption,
      sort_order: (gallery?.length ?? 0) + 1,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    setImageUrl("");
    setCaption("");
    toast.success("Photo added.");
    refresh();
  };

  const remove = async (item: GalleryItem) => {
    const { error } = await supabase.from("gallery").delete().eq("id", item.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Photo removed.");
      refresh();
    }
  };

  return (
    <div>
      <PanelHeader title="Gallery" description="Photos shown on the home page and gallery page." />

      <div className="mb-8 grid gap-4 rounded-md border border-border p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <Field label="Image URL">
          <Input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="/images/store-interior.jpg"
          />
        </Field>
        <Field label="Caption">
          <Input value={caption} onChange={(e) => setCaption(e.target.value)} />
        </Field>
        <Button onClick={add}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(gallery ?? []).map((item) => (
          <figure key={item.id} className="group relative">
            <img src={item.image_url} alt={item.caption} className="aspect-square w-full object-cover" />
            <figcaption className="mt-1 truncate text-xs text-muted-foreground">
              {item.caption}
            </figcaption>
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => remove(item)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </figure>
        ))}
      </div>
      {(gallery ?? []).length === 0 && <EmptyRow>No photos yet.</EmptyRow>}
    </div>
  );
}
