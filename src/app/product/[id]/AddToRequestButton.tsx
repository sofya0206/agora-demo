"use client";

import { useRequest } from "@/hooks/use-request";
import type { Offer } from "@/types";

interface AddToRequestButtonProps {
  offer: Offer;
}

export function AddToRequestButton({ offer }: AddToRequestButtonProps) {
  const { ids, toggle } = useRequest();
  const inRequest = ids.has(offer.id);

  return (
    <button
      type="button"
      onClick={() => toggle(offer)}
      className={`mt-6 w-full rounded-2xl px-6 py-4 text-sm font-semibold transition ${
        inRequest
          ? "bg-muted-foreground text-background"
          : "bg-primary text-primary-foreground hover:bg-primary/90"
      }`}
    >
      {inRequest ? "Убрать из заявки" : "Добавить в заявку"}
    </button>
  );
}
