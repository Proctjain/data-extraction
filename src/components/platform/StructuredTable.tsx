import { useMemo, useState } from "react";
import { Search, Download, ShieldCheck } from "lucide-react";
import type { StructuredField } from "@/lib/mock-data";

type Props = { rows: StructuredField[] };

export function StructuredTable({ rows }: Props) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const needle = q.toLowerCase();
    return rows.filter(
      (r) =>
        r.field.toLowerCase().includes(needle) ||
        r.value.toLowerCase().includes(needle),
    );
  }, [rows, q]);

  const confidence = rows.find((r) => r.field === "Confidence Score")?.value;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-surface shadow-[var(--shadow-soft)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">Structured record</h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
            <ShieldCheck className="h-3 w-3" />
            Validated
          </span>
          {confidence && (
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">
              {confidence} confidence
            </span>
          )}
        </div>
        <button
          onClick={() => alert("Mock export — record downloaded")}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary"
        >
          <Download className="h-3.5 w-3.5" />
          Export
        </button>
      </div>
      <div className="border-b border-border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search fields or values"
            className="w-full rounded-lg border border-border bg-surface-muted py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-surface-muted text-left text-[11px] uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-2.5 font-medium">Field</th>
              <th className="px-5 py-2.5 font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.field} className="border-t border-border hover:bg-surface-muted/60">
                <td className="px-5 py-3 font-medium text-foreground">{r.field}</td>
                <td className="px-5 py-3 text-muted-foreground">{r.value}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={2} className="px-5 py-8 text-center text-sm text-muted-foreground">
                  No matching fields
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
