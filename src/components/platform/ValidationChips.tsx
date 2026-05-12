import { motion } from "framer-motion";
import { ShieldCheck, Gauge, ListChecks, Braces } from "lucide-react";

const CHIPS = [
  { label: "Validation Complete", Icon: ShieldCheck },
  { label: "Confidence Score Generated", Icon: Gauge },
  { label: "Fields Standardized", Icon: ListChecks },
  { label: "JSON Schema Mapped", Icon: Braces },
];

export function ValidationChips() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Structuring & validation
      </h3>
      <div className="flex flex-wrap gap-2">
        {CHIPS.map(({ label, Icon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.18 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success"
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
