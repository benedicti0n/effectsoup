import * as React from "react";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
}

export function AppShell({ children, className }: AppShellProps) {
  return (
    <div
      className={cn(
        "flex h-screen w-full overflow-hidden bg-background text-foreground",
        className
      )}
    >
      {children}
    </div>
  );
}

export function AppMain({ children, className }: AppShellProps) {
  return (
    <main
      className={cn(
        "relative flex flex-1 flex-col items-center justify-center overflow-hidden p-6",
        className
      )}
    >
      {children}
    </main>
  );
}

export function AppSidebar({ children, className }: AppShellProps) {
  return (
    <aside
      className={cn(
        "flex h-full w-80 flex-col gap-6 overflow-y-auto border-l bg-card p-5",
        className
      )}
    >
      {children}
    </aside>
  );
}

export function SidebarSection({
  children,
  className,
  title,
}: AppShellProps & { title?: string }) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {title && (
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
