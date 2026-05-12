import { Table as TableIcon, Braces } from "lucide-react";

type Props = { value: "table" | "json"; onChange: (v: "table" | "json") => void };

export function ViewToggle({ value, onChange }: Props) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-surface-muted p-0.5">
      {(
        [
          { key: "table" as const, label: "Table View", Icon: TableIcon },
          { key: "json" as const, label: "JSON View", Icon: Braces },
        ]
      ).map(({ key, label, Icon }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            value === key
              ? "bg-surface text-foreground shadow-[var(--shadow-soft)]"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
}
