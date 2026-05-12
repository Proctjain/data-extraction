import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppHeader } from "@/components/platform/AppHeader";
import { Hero } from "@/components/platform/Hero";
import { UploadPanel } from "@/components/platform/UploadPanel";
import { ProcessingTimeline } from "@/components/platform/ProcessingTimeline";
import { OcrScanPreview } from "@/components/platform/OcrScanPreview";
import { ValidationChips } from "@/components/platform/ValidationChips";
import { ResultsView } from "@/components/platform/ResultsView";
import { mockData, DEFAULT_DOC_KEY, type DocumentRecord } from "@/lib/mock-data";
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

function Index() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [file, setFile] = useState<{ name: string; previewUrl: string } | null>(null);
  const [visibleLines, setVisibleLines] = useState(0);
  const lineTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const record: DocumentRecord = mockData[DEFAULT_DOC_KEY];

  const start = (f: { name: string; previewUrl: string }) => {
    setFile(f);
    setPhase("uploading");
  };

  const reset = () => {
    setPhase("idle");
    setFile(null);
    setVisibleLines(0);
  };

  // Phase orchestration
  useEffect(() => {
    if (phase === "uploading") {
      const t = setTimeout(() => setPhase("extracting"), 2000);
      return () => clearTimeout(t);
    }
    if (phase === "extracting") {
      setVisibleLines(0);
      const total = record.extractedText.length;
      const interval = 2400 / total;
      lineTimer.current = setInterval(() => {
        setVisibleLines((n) => {
          if (n >= total) {
            if (lineTimer.current) clearInterval(lineTimer.current);
            return n;
          }
          return n + 1;
        });
      }, interval);
      const t = setTimeout(() => setPhase("structuring"), 3000);
      return () => {
        clearTimeout(t);
        if (lineTimer.current) clearInterval(lineTimer.current);
      };
    }
    if (phase === "structuring") {
      const t = setTimeout(() => setPhase("done"), 2000);
      return () => clearTimeout(t);
    }
  }, [phase, record.extractedText.length]);

  const inWorkflow = phase !== "idle" && phase !== "done";

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      {phase === "idle" && <Hero />}

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
                  lines={record.extractedText}
                  visibleCount={
                    phase === "uploading" ? 0 : visibleLines
                  }
                />
              )}

              {phase === "structuring" && <ValidationChips />}

              {phase === "done" && (
                <ResultsView record={record} onReset={reset} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
