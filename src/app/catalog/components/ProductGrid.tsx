import type { Offer } from "@/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  offers: Offer[];
  /** Заявка теперь живёт внутри карточки, пропсы остались для старых вызовов. */
  requestItemIds?: Set<number>;
  onAddToRequest?: (offer: Offer) => void;
}

export function ProductGrid({ offers }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
      {offers.map((offer) => (
        <ProductCard key={offer.id} offer={offer} />
      ))}
    </div>
  );
}
