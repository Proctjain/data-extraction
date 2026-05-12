import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { highlightJson } from "@/lib/highlight";

type Props = { data: unknown };

export function JsonPanel({ data }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-code-bg shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-chart-4/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
          <span className="ml-2 text-xs text-code-fg/70">record.json</span>
        </div>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-code-fg hover:bg-white/10"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy JSON"}
        </button>
      </div>
      <pre
        className="flex-1 overflow-auto p-5 font-mono text-xs leading-relaxed text-code-fg"
        dangerouslySetInnerHTML={{ __html: highlightJson(data) }}
      />
    </div>
  );
}
