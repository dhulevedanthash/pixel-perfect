import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { SiteShell, PageHeading } from "@/components/site/SiteShell";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { shopSettingsQuery, whatsappLink } from "@/lib/shop";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Maison Kaira" },
      {
        name: "description",
        content:
          "Call, WhatsApp or send an enquiry — and find our address and opening hours in Bandra, Mumbai.",
      },
      { property: "og:title", content: "Contact — Maison Kaira" },
      {
        property: "og:description",
        content: "Call, WhatsApp or send an enquiry to our Mumbai boutique.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { data: shop } = useQuery(shopSettingsQuery);

  return (
    <SiteShell>
      <PageHeading
        eyebrow="Get in touch"
        title="Let's Talk Fashion"
        intro="Ask about a size, a colour, an alteration or simply when to drop by. We answer WhatsApp fastest."
      />

      <div className="mx-auto grid max-w-[1400px] gap-16 px-5 pb-24 md:grid-cols-2 md:px-10">
        <div>
          <ul className="space-y-7 text-sm">
            <Row icon={<Phone className="h-4 w-4 text-accent" />} label="Phone">
              <a href={`tel:${shop?.phone ?? ""}`} className="link-rule">
                {shop?.phone}
              </a>
            </Row>
            <Row icon={<Mail className="h-4 w-4 text-accent" />} label="Email">
              <a href={`mailto:${shop?.email ?? ""}`} className="link-rule">
                {shop?.email}
              </a>
            </Row>
            <Row icon={<MapPin className="h-4 w-4 text-accent" />} label="Address">
              {shop?.address}
            </Row>
            <Row icon={<Clock className="h-4 w-4 text-accent" />} label="Opening Hours">
              <span className="whitespace-pre-line">{shop?.opening_hours}</span>
            </Row>
          </ul>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={whatsappLink(shop?.whatsapp ?? "", "Hello, I have a question about your collection.")}
              target="_blank"
              rel="noreferrer"
              className="bg-ink px-8 py-4 text-center text-[0.7rem] tracking-[0.18em] uppercase text-ink-foreground transition-colors hover:bg-accent"
            >
              WhatsApp Us
            </a>
            <a
              href={`tel:${shop?.phone ?? ""}`}
              className="border border-foreground px-8 py-4 text-center text-[0.7rem] tracking-[0.18em] uppercase transition-colors hover:bg-foreground hover:text-background"
            >
              Call Now
            </a>
            <a
              href={shop?.maps_url ?? "#"}
              target="_blank"
              rel="noreferrer"
              className="border border-border px-8 py-4 text-center text-[0.7rem] tracking-[0.18em] uppercase text-muted-foreground transition-colors hover:border-accent hover:text-accent"
            >
              Get Directions
            </a>
          </div>
        </div>

        <div className="border-t border-border pt-10 md:border-t-0 md:border-l md:pt-0 md:pl-16">
          <h2 className="font-display text-3xl">Send an enquiry</h2>
          <div className="mt-8">
            <EnquiryForm />
          </div>
        </div>
      </div>
    </SiteShell>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-4">
      <span className="mt-1">{icon}</span>
      <span>
        <span className="eyebrow block">{label}</span>
        <span className="mt-1 block text-foreground">{children}</span>
      </span>
    </li>
  );
}
