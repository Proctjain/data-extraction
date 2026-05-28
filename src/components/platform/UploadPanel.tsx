import { useRef, useState } from "react";
import { Upload, FileImage, X, ArrowRight } from "lucide-react";
import implantCardSample from "@/assets/implant_card.png";

type FileEntry = { name: string; previewUrl: string; raw: File };

type Props = {
  onProcess: (file: FileEntry) => void;
};

export function UploadPanel({ onProcess }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<FileEntry | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || !files[0]) return;
    const f = files[0];
    setFile({ name: f.name, previewUrl: URL.createObjectURL(f), raw: f });
  };

  const useSample = async () => {
    const res  = await fetch(implantCardSample);
    const blob = await res.blob();
    const raw  = new File([blob], "implant_card.png", { type: "image/png" });
    setFile({ name: "implant_card.png", previewUrl: implantCardSample, raw });
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-surface p-10 text-center shadow-[var(--shadow-soft)] transition-colors ${
            dragOver ? "border-accent bg-accent/5" : "border-border"
          }`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-primary">
            <Upload className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-lg font-semibold text-foreground">
            Upload an implant card
          </h2>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            Drag and drop a scanned card or browse from your device. PNG, JPG up
            to 10 MB.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Upload className="h-4 w-4" />
              Browse files
            </button>
            <button
              onClick={useSample}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Use sample card
            </button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {/* Preview */}
        <div className="flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Selected document
            </h3>
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground">
              Implant Card
            </span>
          </div>

          {file ? (
            <div className="mt-4 flex flex-1 flex-col">
              <div className="relative overflow-hidden rounded-xl border border-border bg-surface-muted">
                <img
                  src={file.previewUrl}
                  alt="Uploaded implant card preview"
                  width={1024}
                  height={640}
                  className="h-44 w-full object-cover"
                />
              </div>
              <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-surface-muted px-3 py-2.5">
                <div className="flex items-center gap-2.5 truncate">
                  <FileImage className="h-4 w-4 shrink-0 text-accent" />
                  <span className="truncate text-sm font-medium text-foreground">
                    {file.name}
                  </span>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => onProcess(file)}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground transition-all hover:opacity-95 hover:shadow-[var(--shadow-elegant)]"
              >
                Process Implant Card
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="mt-4 flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-muted p-8 text-center">
              <FileImage className="h-8 w-8 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">
                No document selected yet
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
