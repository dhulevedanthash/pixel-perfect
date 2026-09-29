import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { offersQuery, type Offer } from "@/lib/shop";
import { Field, PanelHeader, EmptyRow } from "./ui";

export function OffersPanel() {
  const qc = useQueryClient();
  const { data: offers } = useQuery(offersQuery);
  const [form, setForm] = useState({
    title: "",
    headline: "",
    description: "",
    image_url: "",
    expires_at: "",
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["offers"] });

  const add = async () => {
    if (!form.title.trim() || !form.headline.trim()) {
      toast.error("A title and headline are required.");
      return;
    }
    const { error } = await supabase.from("offers").insert({
      title: form.title.trim(),
      headline: form.headline.trim(),
      description: form.description,
      image_url: form.image_url || null,
      expires_at: form.expires_at || null,
      is_active: true,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    setForm({ title: "", headline: "", description: "", image_url: "", expires_at: "" });
    toast.success("Offer created.");
    refresh();
  };

  const update = async (offer: Offer, patch: Partial<Offer>) => {
    const { error } = await supabase.from("offers").update(patch).eq("id", offer.id);
    if (error) toast.error(error.message);
    else refresh();
  };

  const remove = async (offer: Offer) => {
    if (!window.confirm(`Delete the offer "${offer.title}"?`)) return;
    const { error } = await supabase.from("offers").delete().eq("id", offer.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Offer deleted.");
      refresh();
    }
  };

  return (
    <div>
      <PanelHeader title="Offers" description="Promotions shown on the home page and offers page." />

      <div className="mb-8 grid gap-4 rounded-md border border-border p-4 sm:grid-cols-2">
        <Field label="Title">
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Festive Edit"
          />
        </Field>
        <Field label="Headline">
          <Input
            value={form.headline}
            onChange={(e) => setForm({ ...form, headline: e.target.value })}
            placeholder="20% off ethnic wear"
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Description">
            <Textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Image URL">
          <Input
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            placeholder="/images/offer-festive.jpg"
          />
        </Field>
        <Field label="Valid until">
          <Input
            type="date"
            value={form.expires_at}
            onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
          />
        </Field>
        <div className="sm:col-span-2">
          <Button onClick={add}>
            <Plus className="h-4 w-4" /> Create offer
          </Button>
        </div>
      </div>

      <div className="divide-y divide-border border-y border-border">
        {(offers ?? []).map((offer) => (
          <div key={offer.id} className="flex items-center gap-4 py-3">
            <img
              src={offer.image_url ?? "/images/offer-festive.jpg"}
              alt=""
              className="h-14 w-20 shrink-0 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{offer.headline}</p>
              <p className="text-xs text-muted-foreground">
                {offer.title}
                {offer.expires_at
                  ? ` · until ${new Date(offer.expires_at).toLocaleDateString("en-IN")}`
                  : ""}
              </p>
            </div>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              Active
              <Switch
                checked={offer.is_active}
                onCheckedChange={(v) => update(offer, { is_active: v })}
              />
            </label>
            <Button variant="ghost" size="icon" onClick={() => remove(offer)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {(offers ?? []).length === 0 && <EmptyRow>No offers yet.</EmptyRow>}
      </div>
    </div>
  );
}
