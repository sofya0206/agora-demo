"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

/* В макете тема переключается сегментированной парой кнопок, а не одной. */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0 rounded-lg bg-muted p-0.5",
        className,
      )}
      role="group"
      aria-label="Тема оформления"
    >
      <button
        type="button"
        aria-label="Светлая тема"
        aria-pressed={mounted ? !isDark : undefined}
        onClick={() => setTheme("light")}
        className={cn(
          "inline-flex h-7 w-9 items-center justify-center rounded-md text-foreground transition-colors",
          mounted && !isDark
            ? "bg-background shadow-xs"
            : "hover:bg-background/50",
        )}
      >
        <Sun className="size-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Тёмная тема"
        aria-pressed={mounted ? isDark : undefined}
        onClick={() => setTheme("dark")}
        className={cn(
          "inline-flex h-7 w-9 items-center justify-center rounded-md text-foreground transition-colors",
          isDark ? "bg-background shadow-xs" : "hover:bg-background/50",
        )}
      >
        <Moon className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
