import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductsPanel } from "@/components/admin/ProductsPanel";
import { CategoriesPanel } from "@/components/admin/CategoriesPanel";
import { OffersPanel } from "@/components/admin/OffersPanel";
import { GalleryPanel } from "@/components/admin/GalleryPanel";
import { EnquiriesPanel } from "@/components/admin/EnquiriesPanel";
import { SettingsPanel } from "@/components/admin/SettingsPanel";
import { enquiriesQuery, productsQuery } from "@/lib/shop";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Maison Kaira" },
      { name: "description", content: "Manage the Maison Kaira catalogue, offers and enquiries." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Dashboard — Maison Kaira" },
      {
        property: "og:description",
        content: "Manage the Maison Kaira catalogue, offers and enquiries.",
      },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      if (!next) navigate({ to: "/admin/login" });
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecked(true);
      if (!data.session) navigate({ to: "/admin/login" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  if (!checked || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Checking your session…
      </div>
    );
  }

  return <Dashboard email={session.user.email ?? ""} />;
}

function Dashboard({ email }: { email: string }) {
  const navigate = useNavigate();
  const { data: products } = useQuery(productsQuery);
  const { data: enquiries } = useQuery(enquiriesQuery);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  const newEnquiries = (enquiries ?? []).filter((e) => e.status !== "handled").length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-8">
          <div>
            <p className="eyebrow">Maison Kaira</p>
            <h1 className="font-display text-2xl">Store dashboard</h1>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="hidden sm:inline">{email}</span>
            <Link to="/" className="link-rule text-xs tracking-[0.14em] uppercase">
              View site
            </Link>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Stat label="Products" value={(products ?? []).length} />
          <Stat
            label="Published"
            value={(products ?? []).filter((p) => p.is_published).length}
          />
          <Stat label="New enquiries" value={newEnquiries} />
        </div>

        <Tabs defaultValue="products">
          <TabsList className="flex h-auto flex-wrap justify-start">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="offers">Offers</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="enquiries">Enquiries</TabsTrigger>
            <TabsTrigger value="settings">Shop details</TabsTrigger>
          </TabsList>

          <div className="pt-8">
            <TabsContent value="products">
              <ProductsPanel />
            </TabsContent>
            <TabsContent value="categories">
              <CategoriesPanel />
            </TabsContent>
            <TabsContent value="offers">
              <OffersPanel />
            </TabsContent>
            <TabsContent value="gallery">
              <GalleryPanel />
            </TabsContent>
            <TabsContent value="enquiries">
              <EnquiriesPanel />
            </TabsContent>
            <TabsContent value="settings">
              <SettingsPanel />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-border p-5">
      <p className="eyebrow">{label}</p>
      <p className="mt-2 font-display text-3xl">{value}</p>
    </div>
  );
}
