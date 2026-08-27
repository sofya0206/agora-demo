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
        inRequest ? "bg-cyan-400 text-black" : "bg-white text-black hover:bg-cyan-100"
      }`}
    >
      {inRequest ? "Убрать из заявки" : "Добавить в заявку"}
    </button>
  );
}
