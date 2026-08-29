import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SupplierLogo } from "@/components/SupplierLogo";
import { Button } from "@/components/ui/button";
import type { Offer, OfferSupplier } from "@/types";
import { pluralOffers } from "../catalog-params";
import { ProductCard } from "./ProductCard";

interface SupplierGroupProps {
  supplier: OfferSupplier;
  offers: Offer[];
  total: number;
  expanded: boolean;
  expandHref: string;
}

export function SupplierGroup({
  supplier,
  offers,
  total,
  expanded,
  expandHref,
}: SupplierGroupProps) {
  const hasMore = !expanded && total > offers.length;

  return (
    <section
      className="flex flex-col items-center gap-4"
      aria-labelledby={`supplier-${supplier.id}`}
    >
      <div className="flex w-full flex-wrap items-center gap-2">
        <SupplierLogo
          name={supplier.commercial_name}
          logoUrl={supplier.logo_url}
          sizes="40px"
          className="size-10 rounded-lg text-base"
        />
        <h2
          id={`supplier-${supplier.id}`}
          className="text-lg font-medium text-foreground"
        >
          {supplier.commercial_name}
        </h2>
        <Button asChild variant="secondary" size="sm" className="text-sm">
          <Link href={`/supplier/${supplier.id}`}>
            Подробнее о поставщике
            <ArrowRight data-icon="inline-end" aria-hidden="true" />
          </Link>
        </Button>
        <p className="ml-auto text-base font-semibold text-muted-foreground">
          {pluralOffers(total)}
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
        {offers.map((offer) => (
          <ProductCard key={offer.id} offer={offer} />
        ))}
      </div>

      {hasMore && (
        <Button asChild variant="secondary" size="sm" className="text-sm">
          <Link href={expandHref} scroll={false}>
            Показать еще
          </Link>
        </Button>
      )}
    </section>
  );
}
