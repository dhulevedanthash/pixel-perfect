import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { enquiriesQuery, type Enquiry } from "@/lib/shop";
import { PanelHeader, EmptyRow } from "./ui";

export function EnquiriesPanel() {
  const qc = useQueryClient();
  const { data: enquiries } = useQuery(enquiriesQuery);
  const refresh = () => qc.invalidateQueries({ queryKey: ["enquiries"] });

  const markHandled = async (item: Enquiry) => {
    const { error } = await supabase
      .from("enquiries")
      .update({ is_handled: !item.is_handled })
      .eq("id", item.id);
    if (error) toast.error(error.message);
    else refresh();
  };

  const remove = async (item: Enquiry) => {
    if (!window.confirm("Delete this enquiry?")) return;
    const { error } = await supabase.from("enquiries").delete().eq("id", item.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Enquiry deleted.");
      refresh();
    }
  };

  const pending = (enquiries ?? []).filter((e) => !e.is_handled).length;

  return (
    <div>
      <PanelHeader
        title="Enquiries"
        description={`Messages sent from the website. ${pending} waiting for a reply.`}
      />

      <div className="divide-y divide-border border-y border-border">
        {(enquiries ?? []).map((item) => (
          <article key={item.id} className="py-4">
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-medium">{item.name}</p>
              {item.is_handled ? (
                <Badge variant="secondary">Handled</Badge>
              ) : (
                <Badge>New</Badge>
              )}
              <span className="text-xs text-muted-foreground">
                {new Date(item.created_at).toLocaleString("en-IN")}
              </span>
              <div className="ml-auto flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => markHandled(item)}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => remove(item)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              <a href={`tel:${item.phone}`} className="link-rule">
                {item.phone}
              </a>
              {item.email ? (
                <>
                  {" · "}
                  <a href={`mailto:${item.email}`} className="link-rule">
                    {item.email}
                  </a>
                </>
              ) : null}
              {item.product_name ? ` · about ${item.product_name}` : ""}
            </p>
            <p className="mt-3 text-sm leading-relaxed">{item.message}</p>
          </article>
        ))}
        {(enquiries ?? []).length === 0 && <EmptyRow>No enquiries yet.</EmptyRow>}
      </div>
    </div>
  );
}
