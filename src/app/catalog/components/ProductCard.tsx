import Image from "next/image";
import Link from "next/link";
import { Car, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDays, formatMoney, formatVat, stockBadgeVariant } from "@/lib/catalog";
import type { Offer } from "@/types";
import { AddToRequestControl } from "./AddToRequestControl";

interface ProductCardProps {
  offer: Offer;
}

export function ProductCard({ offer }: ProductCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-xs">
      <div className="relative h-[180px] w-full shrink-0 overflow-hidden bg-muted">
        {offer.photo_url ? (
          <Image
            src={offer.photo_url}
            alt={offer.offer_title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 302px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Package className="size-10" aria-hidden="true" />
          </div>
        )}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <Badge variant={stockBadgeVariant(offer.stock_status)}>{offer.stock_status}</Badge>
          <Badge variant="secondary">MOQ {offer.moq_value}</Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-semibold text-foreground">
            <Link href={`/product/${offer.id}`} className="line-clamp-2 hover:underline">
              {offer.offer_title}
            </Link>
          </h3>
          <p className="line-clamp-2 min-h-10 text-sm font-medium text-muted-foreground">
            {offer.description_short || offer.category.name}
          </p>
        </div>

        <div className="mt-auto flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              <Car data-icon="inline-start" aria-hidden="true" />
              {offer.delivery_lead_days === null
                ? "Доставка по согласованию"
                : `Доставка: ${formatDays(offer.delivery_lead_days)}`}
            </Badge>
            <span className="flex-1 text-right text-xs font-medium text-muted-foreground">
              НДС: {formatVat(offer.vat_rate)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <p className="flex min-w-0 flex-1 items-baseline gap-1">
              <span className="truncate text-lg font-semibold text-foreground">
                {formatMoney(offer.price_value, offer.currency)}
              </span>
              <span className="shrink-0 text-xs font-medium text-muted-foreground">
                / за {offer.price_basis}
              </span>
            </p>
            <AddToRequestControl offer={offer} />
          </div>
        </div>
      </div>
    </article>
  );
}
