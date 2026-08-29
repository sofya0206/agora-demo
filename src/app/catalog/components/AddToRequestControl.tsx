"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRequest } from "@/hooks/use-request";
import type { Offer } from "@/types";

interface AddToRequestControlProps {
  offer: Offer;
}

export function AddToRequestControl({ offer }: AddToRequestControlProps) {
  const { items, add, setQuantity } = useRequest();
  const item = items.find((entry) => entry.offerId === offer.id);

  const step = Math.max(1, offer.moq_value || 1);

  if (!item) {
    return (
      <Button type="button" size="lg" onClick={() => add(offer)}>
        В заявку
      </Button>
    );
  }

  const quantity = item.quantity;

  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        size="icon-lg"
        onClick={() => setQuantity(offer.id, quantity - step)}
        disabled={quantity - step < step}
        aria-label="Уменьшить количество"
      >
        <Minus aria-hidden="true" />
      </Button>
      <Input
        type="number"
        inputMode="numeric"
        min={step}
        step={step}
        value={quantity}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (Number.isFinite(next))
            setQuantity(offer.id, Math.max(step, Math.round(next)));
        }}
        aria-label={`Количество, ${offer.price_basis}`}
        className="h-9 w-16 px-2 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <Button
        type="button"
        size="icon-lg"
        onClick={() => setQuantity(offer.id, quantity + step)}
        aria-label="Увеличить количество"
      >
        <Plus aria-hidden="true" />
      </Button>
    </div>
  );
}
