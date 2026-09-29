import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function PageHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="mx-auto max-w-[1400px] px-5 pt-16 pb-10 md:px-10 md:pt-24 md:pb-14">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="mt-4 font-display text-[2.75rem] leading-[1.05] tracking-tight md:text-7xl">
        {title}
      </h1>
      {intro && (
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">{intro}</p>
      )}
    </section>
  );
}
