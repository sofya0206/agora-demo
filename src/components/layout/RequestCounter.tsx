"use client";

import { ClipboardList } from "lucide-react";
import { useRequest } from "@/hooks/use-request";

export function RequestCounter() {
  const { items } = useRequest();

  return (
    <button
      type="button"
      className="relative inline-flex h-9 items-center gap-2 rounded-[10px] px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
    >
      <ClipboardList className="size-4" aria-hidden="true" />
      Заявки
      {items.length > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
          {items.length}
        </span>
      )}
    </button>
  );
}
