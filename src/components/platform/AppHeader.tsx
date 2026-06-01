import { Activity } from "lucide-react";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Activity className="h-4.5 w-4.5" strokeWidth={2.25} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight text-foreground">
              Doc Intelligence
            </span>
            <span className="text-[11px] text-muted-foreground">
              Document Operations Platform
            </span>
          </div>
        </div>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a className="hover:text-foreground transition-colors">Workflows</a>
          <a className="hover:text-foreground transition-colors">Records</a>
          <a className="hover:text-foreground transition-colors">Audit</a>
          <a className="hover:text-foreground transition-colors">Settings</a>
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden rounded-full border border-border bg-surface-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground sm:inline-block">
            Demo Environment
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
            JD
          </div>
        </div>
      </div>
    </header>
  );
}
