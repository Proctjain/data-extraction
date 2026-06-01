import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="border-b border-border bg-[var(--gradient-hero)]">
      <div className="mx-auto max-w-7xl px-6 py-14 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground shadow-[var(--shadow-soft)]">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          AI Document Intelligence · Healthcare Operations
        </div>
        <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          AI-Powered Text Extraction
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-muted-foreground md:text-lg">
          Transform scanned implant cards into validated, structured records for
          downstream workflows.
        </p>
      </div>
    </section>
  );
}
