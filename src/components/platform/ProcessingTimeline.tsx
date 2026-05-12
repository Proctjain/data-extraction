import { Check, Loader2, Upload, ScanLine, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { Phase } from "@/lib/phase";

const STAGES: { key: Phase; label: string; helper: string; Icon: typeof Upload }[] = [
  { key: "uploading", label: "Uploading", helper: "Securely transferring image", Icon: Upload },
  { key: "extracting", label: "Extracting", helper: "OCR & clinical identifiers", Icon: ScanLine },
  { key: "structuring", label: "Structuring", helper: "Validation & schema mapping", Icon: Sparkles },
];

const ORDER: Phase[] = ["idle", "uploading", "extracting", "structuring", "done"];

function status(phase: Phase, key: Phase): "done" | "active" | "pending" {
  const i = ORDER.indexOf(phase);
  const j = ORDER.indexOf(key);
  if (i > j) return "done";
  if (i === j) return "active";
  return "pending";
}

export function ProcessingTimeline({ phase }: { phase: Phase }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Processing pipeline</h3>
        <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-medium text-accent">
          AI workflow
        </span>
      </div>
      <ol className="grid gap-3 md:grid-cols-3">
        {STAGES.map(({ key, label, helper, Icon }, idx) => {
          const s = status(phase, key);
          return (
            <motion.li
              key={key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`relative flex items-start gap-3 rounded-xl border p-4 ${
                s === "active"
                  ? "border-accent bg-accent/5"
                  : s === "done"
                    ? "border-border bg-surface-muted"
                    : "border-border bg-surface"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  s === "done"
                    ? "bg-success text-success-foreground"
                    : s === "active"
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-muted-foreground"
                }`}
              >
                {s === "done" ? (
                  <Check className="h-4.5 w-4.5" />
                ) : s === "active" ? (
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                ) : (
                  <Icon className="h-4.5 w-4.5" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {label}
                  </span>
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    Step {idx + 1}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{helper}</p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
