import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RequestAwareProductGrid } from "@/app/catalog/components/RequestAwareProductGrid";
import { SupplierLogo } from "@/components/SupplierLogo";
import { Badge } from "@/components/ui/badge";
import { ApiError, getOffer, getOffers } from "@/lib/api";
import { formatDays, formatMoney, getSpecEntries, stockBadgeVariant } from "@/lib/catalog";
import { AddToRequestButton } from "./AddToRequestButton";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const { data: offer } = await getOffer(id);
    return {
      title: offer.offer_title,
      description:
        offer.description_short ||
        `${offer.offer_title} — предложение от ${offer.supplier.commercial_name} на Агоре.`,
    };
  } catch {
    return {
      title: "Предложение не найдено",
      description: "Такого предложения нет в каталоге Агоры.",
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  let offer;

  try {
    ({ data: offer } = await getOffer(id));
  } catch (fetchError) {
    if (fetchError instanceof ApiError && fetchError.status === 404) {
      notFound();
    }
    throw fetchError;
  }

  const related = await getOffers({ category: offer.category.slug, per_page: 4 })
    .then((page) => page.data.filter((item) => item.id !== offer.id).slice(0, 3))
    .catch(() => []);

  const specs = getSpecEntries(offer);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-8 sm:px-8">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link href="/catalog" className="hover:text-foreground">Каталог</Link>
        <span>›</span>
        <Link href="/catalog" className="hover:text-foreground">
          {offer.category.name}
        </Link>
        <span>›</span>
        <span className="line-clamp-1 text-foreground">{offer.offer_title}</span>
      </nav>

      <section className="grid gap-8 rounded-[36px] border border-border bg-background p-5 backdrop-blur-xl sm:p-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="relative aspect-square overflow-hidden rounded-[28px] border border-border bg-muted">
            {offer.photo_url ? (
              <Image
                src={offer.photo_url}
                alt={offer.offer_title}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-8xl text-muted-foreground">◫</div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border bg-secondary px-3 py-1 text-xs text-secondary-foreground">
              {offer.category.name}
            </span>
            <Badge variant={stockBadgeVariant(offer.stock_status)}>{offer.stock_status}</Badge>
          </div>

          <h1 className="mt-5 text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl">
            {offer.offer_title}
          </h1>
          <Link
            href={`/supplier/${offer.supplier.id}`}
            className="mt-4 inline-flex items-center gap-3 text-muted-foreground hover:text-foreground"
          >
            <SupplierLogo
              name={offer.supplier.commercial_name}
              logoUrl={offer.supplier.logo_url}
              sizes="40px"
              className="h-10 w-10 rounded-2xl text-base"
            />
            {offer.supplier.commercial_name}
          </Link>

          {offer.description_short && (
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">{offer.description_short}</p>
          )}

          <div className="mt-7 rounded-[28px] border border-border bg-muted p-6">
            <div className="text-4xl font-black">{formatMoney(offer.price_value, offer.currency)}</div>
            <div className="mt-1 text-sm text-muted-foreground">за {offer.price_basis} · минимум {offer.moq_value} {offer.price_basis}</div>
            <AddToRequestButton offer={offer} />
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-5">
        <div className="rounded-[32px] border border-border bg-background p-7 lg:col-span-3">
          <h2 className="text-xl font-semibold">Характеристики</h2>
          {specs.length > 0 ? (
            <dl className="mt-5 divide-y divide-border">
              {specs.map((spec) => (
                <div key={spec.key} className="grid grid-cols-2 gap-4 py-4 text-sm">
                  <dt className="text-muted-foreground">{spec.label}</dt>
                  <dd className="text-right font-medium text-foreground">{spec.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Для этого предложения характеристики не заполнены.</p>
          )}
        </div>

        <div className="rounded-[32px] border border-border bg-background p-7 lg:col-span-2">
          <h2 className="text-xl font-semibold">Условия</h2>
          <dl className="mt-5 space-y-4 text-sm">
            <InfoRow label="Производство" value={formatDays(offer.production_lead_days)} />
            <InfoRow label="Доставка" value={formatDays(offer.delivery_lead_days)} />
            <InfoRow label="Оплата" value={offer.payment_terms} />
            <InfoRow label="НДС" value={offer.vat_rate === "Без НДС" ? offer.vat_rate : `${offer.vat_rate}%`} />
            <InfoRow label="Самовывоз" value={offer.pickup_available ? "Доступен" : "Нет"} />
            <InfoRow label="Брендирование" value={offer.branding_available ? "Доступно" : "Нет"} />
            <InfoRow label="Регионы" value={offer.delivery_regions.join(", ") || "По согласованию"} />
          </dl>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-6 text-2xl font-black">Похожие предложения</h2>
          <RequestAwareProductGrid offers={related} />
        </section>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right text-foreground">{value}</dd>
    </div>
  );
}
