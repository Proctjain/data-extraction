import { CheckCircle2, Gauge, Layers } from "lucide-react";

type Props = {
  metrics: { extractionAccuracy: string; fieldsStructured: number; validationStatus: string };
};

export function KpiCards({ metrics }: Props) {
  const items = [
    { label: "Extraction Accuracy", value: metrics.extractionAccuracy, Icon: Gauge, accent: "text-accent" },
    { label: "Fields Structured", value: String(metrics.fieldsStructured), Icon: Layers, accent: "text-primary" },
    { label: "Validation Status", value: metrics.validationStatus, Icon: CheckCircle2, accent: "text-success" },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map(({ label, value, Icon, accent }) => (
        <div
          key={label}
          className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-soft)]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </span>
            <Icon className={`h-4 w-4 ${accent}`} />
          </div>
          <div className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </div>
        </div>
      ))}
    </div>
  );
}
