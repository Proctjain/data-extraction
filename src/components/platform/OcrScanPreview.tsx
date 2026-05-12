import { motion } from "framer-motion";
import { ScanLine } from "lucide-react";

type Props = {
  imageUrl: string;
  filename: string;
  scanning: boolean;
  lines: string[];
  visibleCount: number;
};

export function OcrScanPreview({ imageUrl, filename, scanning, lines, visibleCount }: Props) {
  return (
    <div className="grid gap-4 rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)] lg:grid-cols-[1fr_1fr]">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Document</h3>
          <span className="truncate rounded-md bg-surface-muted px-2 py-0.5 text-[11px] text-muted-foreground">
            {filename}
          </span>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-border bg-surface-muted">
          <img
            src={imageUrl}
            alt="Implant card being processed"
            width={1024}
            height={640}
            className="h-64 w-full object-cover"
          />
          {scanning && (
            <>
              <div className="absolute inset-0 bg-accent/5" />
              <div className="animate-scan-line absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_12px_2px_var(--accent)]" />
            </>
          )}
        </div>
      </div>
      <div>
        <div className="mb-3 flex items-center gap-2">
          <ScanLine className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-semibold text-foreground">Extracted text</h3>
        </div>
        <div className="h-64 overflow-auto rounded-xl border border-border bg-surface-muted p-3 font-mono text-xs leading-relaxed text-foreground">
          {lines.slice(0, visibleCount).map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="py-0.5"
            >
              <span className="mr-2 text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              {l}
            </motion.div>
          ))}
          {visibleCount < lines.length && (
            <div className="mt-1 inline-block h-3 w-2 animate-pulse bg-accent" />
          )}
        </div>
      </div>
    </div>
  );
}
