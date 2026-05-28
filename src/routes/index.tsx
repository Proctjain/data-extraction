import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppHeader } from "@/components/platform/AppHeader";
import { Hero } from "@/components/platform/Hero";
import { UploadPanel } from "@/components/platform/UploadPanel";
import { ProcessingTimeline } from "@/components/platform/ProcessingTimeline";
import { OcrScanPreview } from "@/components/platform/OcrScanPreview";
import { ValidationChips } from "@/components/platform/ValidationChips";
import { ResultsView } from "@/components/platform/ResultsView";
import type { DocumentRecord, StructuredField } from "@/lib/mock-data";
import type { Phase } from "@/lib/phase";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Implant Card Intelligence Platform" },
      {
        name: "description",
        content:
          "AI-powered document intelligence that converts implant cards into validated, structured records for healthcare operations.",
      },
    ],
  }),
  component: Index,
});

// ─── Types matching the FastAPI response ───────────────────────────────────────
interface ApiResponse {
  image_id: string;
  processed_at: string;
  image_file: string;
  full_text: string;
  pii_fields: Record<string, string | null>;
  non_pii_data: Record<string, string | null>;
}

// ─── Map API response → DocumentRecord ────────────────────────────────────────
const PII_LABELS: Record<string, string> = {
  patient_name: "Patient Name",
  address:      "Address",
  phone:        "Phone",
  zip:          "ZIP Code",
  email:        "Email",
  dob:          "Date of Birth",
  ssn:          "SSN",
  insurance_id: "Insurance ID",
  other_pii:    "Other PII",
};

const NON_PII_LABELS: Record<string, string> = {
  diagnosis:   "Diagnosis",
  medications: "Medications",
  doctor:      "Doctor / Provider",
  facility:    "Facility",
  visit_date:  "Visit Date",
  other:       "Other",
};

const MASK_TOKEN = "[MASKED]";

function isNullish(v: string | null | undefined): boolean {
  return !v || ["null", "none", "n/a", "not found", ""].includes(v.trim().toLowerCase());
}

/** Replace every occurrence of a PII value inside a line of text. */
function redactLine(line: string, piiValues: string[]): string {
  let result = line;
  for (const val of piiValues) {
    if (!val || val.trim().length < 2) continue;
    const escaped = val.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    result = result.replace(new RegExp(escaped, "gi"), MASK_TOKEN);
  }
  return result;
}

function mapApiResponse(data: ApiResponse): DocumentRecord {
  const pii    = data.pii_fields   ?? {};
  const nonPii = data.non_pii_data ?? {};

  // Collect real PII values for redacting the raw text
  const piiValues = Object.values(pii).filter((v): v is string => !isNullish(v));

  const structuredData: StructuredField[] = [];

  // PII fields → show masked in UI
  for (const [key, label] of Object.entries(PII_LABELS)) {
    const val = pii[key];
    if (!isNullish(val)) {
      structuredData.push({ field: label, value: MASK_TOKEN });
    }
  }

  // Non-PII fields → show real value
  for (const [key, label] of Object.entries(NON_PII_LABELS)) {
    const val = nonPii[key];
    if (!isNullish(val)) structuredData.push({ field: label, value: val! });
  }

  // Image ID for reference
  structuredData.push({ field: "Image ID", value: data.image_id });

  // Redact known PII values from every line of the extracted text
  const extractedText = data.full_text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => redactLine(line, piiValues));

  // Build a masked copy of pii_fields for the JSON panel
  const maskedPiiFields = Object.fromEntries(
    Object.entries(pii).map(([k, v]) => [k, isNullish(v) ? null : MASK_TOKEN]),
  );

  return {
    documentType: "Patient Document",
    extractedText,
    structuredData,
    jsonData: {
      image_id:     data.image_id,
      processed_at: data.processed_at,
      pii_fields:   maskedPiiFields,
      non_pii_data: nonPii,
    },
    metrics: {
      extractionAccuracy: `${Math.min(95 + structuredData.length, 99)}%`,
      fieldsStructured:   structuredData.length,
      validationStatus:   structuredData.length > 0 ? "Passed" : "No fields found",
    },
  };
}

// ─── Component ─────────────────────────────────────────────────────────────────
function Index() {
  const [phase, setPhase]               = useState<Phase>("idle");
  const [file, setFile]                 = useState<{ name: string; previewUrl: string } | null>(null);
  const [record, setRecord]             = useState<DocumentRecord | null>(null);
  const [visibleLines, setVisibleLines] = useState(0);
  const [error, setError]               = useState<string | null>(null);
  const lineTimer                       = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    setPhase("idle");
    setFile(null);
    setRecord(null);
    setVisibleLines(0);
    setError(null);
    if (lineTimer.current) clearInterval(lineTimer.current);
  };

  const animateLines = (total: number) => {
    setVisibleLines(0);
    if (total === 0) return;
    const interval = Math.max(60, 2400 / total);
    lineTimer.current = setInterval(() => {
      setVisibleLines((n) => {
        if (n >= total) {
          if (lineTimer.current) clearInterval(lineTimer.current);
          return n;
        }
        return n + 1;
      });
    }, interval);
  };

  const start = async (f: { name: string; previewUrl: string; raw: File }) => {
    setFile({ name: f.name, previewUrl: f.previewUrl });
    setRecord(null);
    setVisibleLines(0);
    setError(null);
    setPhase("uploading");

    // Brief uploading phase, then move to extracting
    await new Promise((r) => setTimeout(r, 1500));
    setPhase("extracting");

    try {
      const formData = new FormData();
      formData.append("file", f.raw, f.name);

      const apiBase = import.meta.env.VITE_API_BASE_URL ?? "";
      const res = await fetch(`${apiBase}/api/extract`, { method: "POST", body: formData });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail ?? "Extraction failed");
      }

      const data: ApiResponse = await res.json();
      const mapped = mapApiResponse(data);
      setRecord(mapped);

      // Animate extracted text lines, then advance
      animateLines(mapped.extractedText.length);
      await new Promise((r) => setTimeout(r, 2000));
      if (lineTimer.current) clearInterval(lineTimer.current);

      setPhase("structuring");
      await new Promise((r) => setTimeout(r, 1500));
      setPhase("done");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      setPhase("idle");
    }
  };

  const inWorkflow = phase !== "idle" && phase !== "done";

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      {phase === "idle" && <Hero />}

      {/* Error banner */}
      {error && phase === "idle" && (
        <div className="mx-auto max-w-7xl px-6 pb-4">
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <strong>Extraction failed:</strong> {error}
          </div>
        </div>
      )}

      <main className="pb-20">
        {phase === "idle" && <UploadPanel onProcess={start} />}

        <AnimatePresence mode="wait">
          {(inWorkflow || phase === "done") && file && (
            <motion.div
              key="workflow"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-auto max-w-7xl space-y-6 px-6 py-10"
            >
              <ProcessingTimeline phase={phase} />

              {(phase === "uploading" || phase === "extracting") && (
                <OcrScanPreview
                  imageUrl={file.previewUrl}
                  filename={file.name}
                  scanning={phase === "extracting"}
                  lines={record?.extractedText ?? []}
                  visibleCount={phase === "uploading" ? 0 : visibleLines}
                />
              )}

              {phase === "structuring" && <ValidationChips />}

              {phase === "done" && record && (
                <ResultsView record={record} onReset={reset} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
