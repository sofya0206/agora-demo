import { PackageOpen } from "lucide-react";
import { ApiError, getOffers } from "@/lib/api";
import type { CatalogFilters, Offer, OfferSupplier, Supplier } from "@/types";
import {
  COUNT_REVALIDATE_SECONDS,
  GROUPS_PER_PAGE,
  GROUP_MAX_SIZE,
  GROUP_PREVIEW_SIZE,
  applyFilterPatch,
  pluralResults,
  sortOffers,
  toOffersQuery,
  writeCatalogFilters,
} from "../catalog-params";
import { CatalogPagination } from "./CatalogPagination";
import { RetryButton } from "./RetryButton";
import { SortMenu } from "./SortMenu";
import { SupplierGroup } from "./SupplierGroup";

interface OffersSectionProps {
  filters: CatalogFilters;
  suppliers: Supplier[];
}

interface LoadedGroup {
  supplier: OfferSupplier;
  offers: Offer[];
  total: number;
}

function toOfferSupplier(supplier: Supplier): OfferSupplier {
  return {
    id: supplier.id,
    commercial_name: supplier.commercial_name,
    logo_url: supplier.logo_url,
  };
}

/**
 * API отдаёт плоский список офферов, поэтому группы собираем сами.
 * Под фильтрами приходится пересчитывать офферы каждого поставщика, иначе не узнать,
 * у кого выдача непустая. Без фильтров этот пересчёт пропускаем: точные суммы всё равно
 * приезжают в meta.total вместе с офферами текущей страницы, и группу с нулём мы по нему
 * отбрасываем. Плата за это: поставщик без офферов занимает место в пагинации,
 * поэтому на странице может оказаться меньше четырёх групп.
 */
async function loadGroups(filters: CatalogFilters, suppliers: Supplier[]) {
  const query = toOffersQuery(filters);
  const filtered = Boolean(
    filters.search || filters.category || filters.region || filters.stockStatus,
  );
  const selected = filters.supplierId
    ? suppliers.filter((supplier) => String(supplier.id) === filters.supplierId)
    : suppliers;

  const counted: { supplier: Supplier; total: number | null }[] = filtered
    ? (
        await Promise.all(
          selected.map(async (supplier) => {
            const page = await getOffers(
              { ...query, supplier_id: supplier.id, per_page: 1 },
              undefined,
              COUNT_REVALIDATE_SECONDS,
            );
            return { supplier, total: page.meta.total };
          }),
        )
      ).filter((entry) => entry.total > 0)
    : selected.map((supplier) => ({ supplier, total: null }));

  const overallPromise = filtered
    ? Promise.resolve(
        counted.reduce((sum, entry) => sum + (entry.total ?? 0), 0),
      )
    : getOffers(
        { ...query, per_page: 1 },
        undefined,
        COUNT_REVALIDATE_SECONDS,
      ).then((page) => page.meta.total);

  const totalPages = Math.max(1, Math.ceil(counted.length / GROUPS_PER_PAGE));
  const currentPage = Math.min(filters.page, totalPages);
  const pageStart = (currentPage - 1) * GROUPS_PER_PAGE;
  const expanded = new Set(filters.expanded);

  const loadedPromise = Promise.all(
    counted.slice(pageStart, pageStart + GROUPS_PER_PAGE).map(async (entry) => {
      // Полную выборку тянем только когда она нужна: раскрытая группа или сортировка,
      // которой у API нет. В остальных случаях хватает офферов на превью.
      const full =
        expanded.has(entry.supplier.id) || filters.sort !== "price_asc";
      const page = await getOffers({
        ...query,
        supplier_id: entry.supplier.id,
        per_page: full ? GROUP_MAX_SIZE : GROUP_PREVIEW_SIZE,
      });
      const sorted = sortOffers(page.data, filters.sort);

      return {
        supplier: toOfferSupplier(entry.supplier),
        offers: expanded.has(entry.supplier.id)
          ? sorted
          : sorted.slice(0, GROUP_PREVIEW_SIZE),
        total: page.meta.total,
      };
    }),
  );

  const [overall, loaded] = await Promise.all([overallPromise, loadedPromise]);
  // Поставщика без офферов не рисуем: заголовок компании с пустой сеткой выглядит поломкой.
  const groups: LoadedGroup[] = loaded.filter((group) => group.total > 0);

  return { groups, totalOffers: overall, totalPages, currentPage };
}

export async function OffersSection({
  filters,
  suppliers,
}: OffersSectionProps) {
  let result: Awaited<ReturnType<typeof loadGroups>> | null = null;
  let errorMessage: string | null = null;

  try {
    result = await loadGroups(filters, suppliers);
  } catch (requestError) {
    errorMessage =
      requestError instanceof ApiError
        ? requestError.message
        : "Не удалось загрузить каталог. Попробуйте ещё раз.";
  }

  if (!result) {
    return (
      <div className="rounded-2xl border border-border bg-background p-10 text-center shadow-xs">
        <h2 className="text-lg font-semibold text-foreground">
          Каталог не загрузился
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{errorMessage}</p>
        <RetryButton />
      </div>
    );
  }

  const { groups, totalOffers, totalPages, currentPage } = result;

  const expandHref = (supplierId: number) => {
    const query = writeCatalogFilters(
      applyFilterPatch(filters, {
        page: currentPage,
        expanded: [...new Set([...filters.expanded, supplierId])],
      }),
    );
    return query ? `/catalog?${query}` : "/catalog";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="flex-1 text-base font-medium text-muted-foreground">
          Найдено:{" "}
          <strong className="font-semibold text-foreground">
            {pluralResults(totalOffers)}
          </strong>
        </p>
        <SortMenu />
      </div>

      {groups.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-border bg-background p-12 text-center shadow-xs">
          <PackageOpen
            className="size-10 text-muted-foreground"
            aria-hidden="true"
          />
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            Предложений пока нет
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Измените фильтры или сбросьте их — по текущему запросу поставщики
            ничего не предлагают.
          </p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-10">
          {groups.map((group) => (
            <SupplierGroup
              key={group.supplier.id}
              supplier={group.supplier}
              offers={group.offers}
              total={group.total}
              expanded={filters.expanded.includes(group.supplier.id)}
              expandHref={expandHref(group.supplier.id)}
            />
          ))}
        </div>
      )}

      <div className="mt-6">
        <CatalogPagination
          filters={filters}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
