import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { shopSettingsQuery, type ShopSettings } from "@/lib/shop";
import { Field, PanelHeader } from "./ui";

type Form = Omit<ShopSettings, "id" | "updated_at">;

export function SettingsPanel() {
  const qc = useQueryClient();
  const { data: shop } = useQuery(shopSettingsQuery);
  const [form, setForm] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (shop) {
      const { id: _id, updated_at: _updated, ...rest } = shop;
      setForm(rest);
    }
  }, [shop]);

  if (!form) return null;

  const set = (key: keyof Form, value: string) => setForm({ ...form, [key]: value });

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("shop_settings").update(form).eq("id", 1);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Shop details updated.");
    qc.invalidateQueries({ queryKey: ["shop_settings"] });
  };

  return (
    <div>
      <PanelHeader
        title="Shop details"
        description="Name, contact details and text shown across the website."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Shop name">
          <Input value={form.shop_name} onChange={(e) => set("shop_name", e.target.value)} />
        </Field>
        <Field label="Tagline">
          <Input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
        </Field>
        <Field label="Phone">
          <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label="WhatsApp number" hint="Include the country code, e.g. 919820012345.">
          <Input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
        </Field>
        <Field label="Email">
          <Input value={form.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Google Maps link">
          <Input value={form.maps_url} onChange={(e) => set("maps_url", e.target.value)} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Address">
            <Input value={form.address} onChange={(e) => set("address", e.target.value)} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Opening hours" hint="One line per day or range.">
            <Textarea
              rows={3}
              value={form.opening_hours}
              onChange={(e) => set("opening_hours", e.target.value)}
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="About text">
            <Textarea
              rows={5}
              value={form.about_text}
              onChange={(e) => set("about_text", e.target.value)}
            />
          </Field>
        </div>
        <Field label="Instagram link">
          <Input value={form.instagram} onChange={(e) => set("instagram", e.target.value)} />
        </Field>
        <Field label="Facebook link">
          <Input value={form.facebook} onChange={(e) => set("facebook", e.target.value)} />
        </Field>
        <Field label="Logo URL">
          <Input value={form.logo_url ?? ""} onChange={(e) => set("logo_url", e.target.value)} />
        </Field>
      </div>

      <Button className="mt-8" onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </div>
  );
}
