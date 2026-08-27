import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Car } from "lucide-react";
import { ProductCard } from "@/app/catalog/components/ProductCard";
import { SupplierLogo } from "@/components/SupplierLogo";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ApiError, getOffers, getSupplier } from "@/lib/api";
import { formatMoney } from "@/lib/catalog";
import type { Offer, OfferCategory } from "@/types";
import { CategoryFilter } from "./CategoryFilter";

interface SupplierPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: SupplierPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const { data: supplier } = await getSupplier(id);
    const description = supplier.legal_name
      ? `${supplier.commercial_name} (${supplier.legal_name}) — поставщик упаковки на Агоре. ИНН ${supplier.inn}.`
      : `${supplier.commercial_name} — поставщик упаковки на Агоре. ИНН ${supplier.inn}.`;

    return {
      title: supplier.commercial_name,
      description,
      openGraph: {
        title: supplier.commercial_name,
        description,
        images: supplier.logo_url ? [supplier.logo_url] : undefined,
      },
    };
  } catch {
    return {
      title: "Поставщик не найден",
      description: "Такого поставщика нет в каталоге Агоры.",
    };
  }
}

export default async function SupplierPage({ params, searchParams }: SupplierPageProps) {
  const { id } = await params;
  const { category } = await searchParams;
  const requestedCategory = typeof category === "string" ? category : "";

  let supplier;
  let offers: Offer[];

  try {
    const [supplierResponse, offersResponse] = await Promise.all([
      getSupplier(id),
      getOffers({ supplier_id: Number(id), per_page: 100 }),
    ]);
    supplier = supplierResponse.data;
    offers = offersResponse.data;
  } catch (fetchError) {
    if (fetchError instanceof ApiError && fetchError.status === 404) {
      notFound();
    }

    const message =
      fetchError instanceof ApiError ? fetchError.message : "Не удалось загрузить поставщика.";

    return (
      <div className="mx-auto w-full max-w-[1440px] px-5 py-20 text-center sm:px-8 xl:px-20">
        <h1 className="text-2xl font-medium tracking-[-0.04em] text-foreground sm:text-[26px]">
          Поставщик не найден
        </h1>
        <p className="mt-2 text-sm font-medium text-muted-foreground">{message}</p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/catalog">Вернуться в каталог</Link>
        </Button>
      </div>
    );
  }

  const inStockCount = offers.filter((offer) => offer.stock_status === "В наличии").length;
  const minOffer = offers.reduce<Offer | null>(
    (minimum, offer) => (!minimum || offer.price_value < minimum.price_value ? offer : minimum),
    null,
  );
  const categories = Array.from(
    new Map<string, OfferCategory>(
      offers.map((offer) => [offer.category.slug, offer.category]),
    ).values(),
  );
  const activeCategory = categories.some((item) => item.slug === requestedCategory)
    ? requestedCategory
    : "";
  const visibleOffers = activeCategory
    ? offers.filter((offer) => offer.category.slug === activeCategory)
    : offers;

  return (
    <div className="mx-auto w-full max-w-[1440px] px-5 pb-20 sm:px-8 xl:px-20">
      <Breadcrumb className="py-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/catalog">Каталог</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Поставщик {supplier.commercial_name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-6">
        <section className="flex flex-col justify-between gap-6 rounded-2xl border border-border bg-background p-6 shadow-xs lg:flex-row lg:items-center">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <SupplierLogo
              name={supplier.commercial_name}
              logoUrl={supplier.logo_url}
              sizes="102px"
              className="size-[102px] rounded-lg text-3xl"
            />
            <div className="flex flex-col items-start gap-2">
              <div className="flex flex-col gap-1">
                <p className="text-lg font-medium text-muted-foreground">Поставщик</p>
                <h1 className="text-2xl font-medium tracking-[-0.04em] text-foreground sm:text-[26px]">
                  {supplier.commercial_name}
                </h1>
              </div>
              <p className="flex flex-wrap items-center gap-x-1 text-sm font-medium text-muted-foreground">
                <span>{supplier.legal_name || "Юрлицо не указано"}</span>
                <span>ИНН {supplier.inn}</span>
              </p>
              {supplier.shipping_cities.length > 0 && (
                <Badge variant="secondary" className="h-auto whitespace-normal text-left">
                  <Car data-icon="inline-start" aria-hidden="true" />
                  Отгрузка: {supplier.shipping_cities.join(", ")}
                </Badge>
              )}
            </div>
          </div>

          <dl className="grid gap-2 sm:grid-cols-3 lg:w-[491px] lg:shrink-0">
            <Stat label="Офферов" value={String(offers.length)} />
            <Stat label="В наличии" value={String(inStockCount)} />
            <Stat
              label="Цена от"
              value={minOffer ? formatMoney(minOffer.price_value, minOffer.currency) : "—"}
            />
          </dl>
        </section>

        <section className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-6 shadow-xs">
          <h2 className="text-2xl font-medium tracking-[-0.04em] text-foreground sm:text-[26px]">
            Реквизиты и контакты
          </h2>
          <dl className="grid gap-4 sm:grid-cols-2 sm:gap-x-6">
            <Contact label="Контактное лицо" value={supplier.contact.person} />
            <Contact
              label="Телефон"
              value={supplier.contact.phone}
              href={supplier.contact.phone ? `tel:${supplier.contact.phone}` : undefined}
            />
            <Contact
              label="Email"
              value={supplier.contact.email}
              href={supplier.contact.email ? `mailto:${supplier.contact.email}` : undefined}
            />
            <Contact label="Telegram" value={supplier.contact.telegram} />
            <Contact label="Юридический адрес" value={supplier.legal_address} />
            <Contact
              label="Сайт"
              value={supplier.contact.website}
              href={supplier.contact.website || undefined}
              external
            />
          </dl>
        </section>

        <section className="flex flex-col gap-4 pt-4">
          <div className="flex flex-col gap-2">
            <p className="text-lg font-medium text-muted-foreground">Ассортимент</p>
            <h2 className="text-2xl font-medium tracking-[-0.04em] text-foreground sm:text-[26px]">
              Предложения поставщика
            </h2>
          </div>

          {categories.length > 0 && (
            <CategoryFilter categories={categories} value={activeCategory} />
          )}

          {visibleOffers.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleOffers.map((offer) => (
                <ProductCard key={offer.id} offer={offer} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm font-medium text-muted-foreground">
              У поставщика пока нет активных предложений.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-baseline justify-between gap-2 overflow-hidden rounded-lg border border-border bg-muted p-3 sm:flex-col sm:justify-start">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="truncate text-2xl font-medium tracking-[-0.04em] text-foreground sm:text-[26px]">
        {value}
      </dd>
    </div>
  );
}

function Contact({
  label,
  value,
  href,
  external = false,
}: {
  label: string;
  value: string | null;
  href?: string;
  external?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="text-lg font-medium break-words text-foreground">
        {value && href ? (
          <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            className="underline-offset-4 hover:underline"
          >
            {value}
          </a>
        ) : (
          value || "Не указано"
        )}
      </dd>
    </div>
  );
}
