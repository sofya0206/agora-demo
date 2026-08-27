import type { Offer } from "@/types";
import { ProductGrid } from "./ProductGrid";

interface RequestAwareProductGridProps {
  offers: Offer[];
}

export function RequestAwareProductGrid({ offers }: RequestAwareProductGridProps) {
  return <ProductGrid offers={offers} />;
}
