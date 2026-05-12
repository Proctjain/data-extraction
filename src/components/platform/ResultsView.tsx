import { useState } from "react";
import { motion } from "framer-motion";
import { StructuredTable } from "./StructuredTable";
import { JsonPanel } from "./JsonPanel";
import { ViewToggle } from "./ViewToggle";
import { KpiCards } from "./KpiCards";
import type { DocumentRecord } from "@/lib/mock-data";

type Props = { record: DocumentRecord; onReset: () => void };

export function ResultsView({ record, onReset }: Props) {
  const [view, setView] = useState<"table" | "json">("table");

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <KpiCards metrics={record.metrics} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Validated record output
          </h2>
          <p className="text-sm text-muted-foreground">
            Review structured fields or inspect the JSON payload mapped to schema.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle value={view} onChange={setView} />
          <button
            onClick={onReset}
            className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary"
          >
            Process another
          </button>
        </div>
      </div>

      <div className={`grid gap-6 ${view === "json" ? "lg:grid-cols-2" : ""}`}>
        <div className="min-h-[560px]">
          <StructuredTable rows={record.structuredData} />
        </div>
        {view === "json" && (
          <div className="min-h-[560px]">
            <JsonPanel data={record.jsonData} />
          </div>
        )}
      </div>
    </motion.section>
  );
}
