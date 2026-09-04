import { Suspense } from "react";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { getCategories, getSuppliers } from "@/lib/api";
import { PILOT_CATEGORIES } from "@/lib/catalog";
import type { Category, Supplier } from "@/types";
import {
  SUPPLIERS_SCAN_LIMIT,
  readCatalogFilters,
  type RawSearchParams,
} from "./catalog-params";
import { CatalogFiltersSidebar } from "./components/CatalogFilters";
import { FiltersSheet } from "./components/FiltersSheet";
import { OffersSection } from "./components/OffersSection";
import { OffersSkeleton } from "./components/OffersSkeleton";
import { SearchBar } from "./components/SearchBar";

interface CatalogPageProps {
  searchParams: Promise<RawSearchParams>;
}

export async function generateMetadata({
  searchParams,
}: CatalogPageProps): Promise<Metadata> {
  const filters = readCatalogFilters(await searchParams);
  const category = filters.category
    ? PILOT_CATEGORIES.find((item) => item.slug === filters.category)
    : undefined;

  return {
    title: category
      ? `${category.name} — каталог Агоры`
      : "Каталог предложений — Агора",
    description:
      "Сравнивайте предложения поставщиков транспортной упаковки по цене, наличию и условиям поставки в каталоге Агоры.",
  };
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const filters = readCatalogFilters(await searchParams);

  const [categoriesResult, suppliersResult] = await Promise.allSettled([
    getCategories(),
    getSuppliers({ per_page: SUPPLIERS_SCAN_LIMIT }),
  ]);

  const categories: Category[] =
    categoriesResult.status === "fulfilled" &&
    categoriesResult.value.data.length > 0
      ? categoriesResult.value.data
      : PILOT_CATEGORIES;
  const suppliers: Supplier[] =
    suppliersResult.status === "fulfilled" ? suppliersResult.value.data : [];

  const activeCount = [
    filters.category,
    filters.supplierId,
    filters.region,
    filters.stockStatus,
  ].filter(Boolean).length;

  return (
    <div className="mx-auto w-full max-w-[1440px] px-5 pb-20 sm:px-8 xl:px-20">
      <section className="flex flex-col gap-4 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-lg font-medium text-muted-foreground">
            Каталог предложений
          </p>
          {/* Заявка уходит одному поставщику — предупреждаем до того, как её наберут. */}
          <Badge variant="secondary">Одна заявка — один поставщик</Badge>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-medium tracking-[-0.04em] text-foreground sm:text-[26px]">
            Сравнивайте упаковку по цене и условиям поставки
          </h1>
          <p className="text-sm font-medium text-muted-foreground">
            Единый каталог проверенных поставщиков транспортной упаковки
          </p>
        </div>
      </section>

      <div className="flex flex-col gap-6 pt-2 lg:flex-row">
        <CatalogFiltersSidebar categories={categories} suppliers={suppliers} />

        <section className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex items-center gap-2">
            <FiltersSheet
              categories={categories}
              suppliers={suppliers}
              activeCount={activeCount}
            />
            <div className="min-w-0 flex-1">
              <SearchBar />
            </div>
          </div>

          <Suspense key={JSON.stringify(filters)} fallback={<OffersSkeleton />}>
            <OffersSection filters={filters} suppliers={suppliers} />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
