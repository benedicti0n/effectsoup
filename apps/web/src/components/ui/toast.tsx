"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type JSX
} from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);
const TOAST_DURATION_MS = 3000;

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }): JSX.Element {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((handle) => clearTimeout(handle));
      timers.clear();
    };
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    const handle = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timersRef.current.delete(id);
    }, TOAST_DURATION_MS);
    timersRef.current.set(id, handle);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "flex items-center gap-2 rounded-sm px-4 py-3 text-sm font-medium shadow-sm",
              toast.type === "success" && "bg-deep-green text-on-dark",
              toast.type === "error" && "bg-error text-on-primary",
              toast.type === "info" && "bg-ink-primary text-on-primary"
            )}
          >
            {toast.type === "success" ? (
              <HugeiconsIcon icon={Tick02Icon} className="h-4 w-4" />
            ) : (
              <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
            )}
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
