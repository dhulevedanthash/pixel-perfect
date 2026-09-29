import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const FIELD =
  "w-full border-b border-border bg-transparent py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-accent";

export function EnquiryForm({ defaultProduct = "" }: { defaultProduct?: string }) {
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    product: defaultProduct,
    message: "",
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Please add your name and phone number.");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("enquiries").insert({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      product: form.product.trim(),
      message: form.message.trim(),
    });
    setSending(false);
    if (error) {
      toast.error("Your enquiry could not be sent. Please try calling the store.");
      return;
    }
    toast.success("Thank you — we will get back to you shortly.");
    setForm({ name: "", phone: "", email: "", product: defaultProduct, message: "" });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="eyebrow">Name</span>
          <input className={FIELD} value={form.name} onChange={set("name")} placeholder="Your name" />
        </label>
        <label className="block">
          <span className="eyebrow">Phone</span>
          <input className={FIELD} value={form.phone} onChange={set("phone")} placeholder="Phone number" />
        </label>
        <label className="block">
          <span className="eyebrow">Email</span>
          <input className={FIELD} value={form.email} onChange={set("email")} placeholder="Email address" />
        </label>
        <label className="block">
          <span className="eyebrow">Product interested in</span>
          <input
            className={FIELD}
            value={form.product}
            onChange={set("product")}
            placeholder="e.g. Ivory Linen Shirt"
          />
        </label>
      </div>
      <label className="block">
        <span className="eyebrow">Message</span>
        <textarea
          className={`${FIELD} min-h-28 resize-none`}
          value={form.message}
          onChange={set("message")}
          placeholder="Tell us what you're looking for"
        />
      </label>
      <button
        type="submit"
        disabled={sending}
        className="bg-ink px-10 py-4 text-[0.7rem] tracking-[0.18em] uppercase text-ink-foreground transition-colors hover:bg-accent disabled:opacity-60"
      >
        {sending ? "Sending…" : "Send Enquiry"}
      </button>
    </form>
  );
}
