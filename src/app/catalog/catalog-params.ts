import type { OffersQuery } from "@/lib/api";
import type { CatalogFilters, CatalogSort, Offer } from "@/types";

export const GROUPS_PER_PAGE = 4;
export const GROUP_PREVIEW_SIZE = 6;
export const GROUP_MAX_SIZE = 60;
export const SUPPLIERS_SCAN_LIMIT = 100;
/** Счётчики офферов по поставщикам меняются редко, поэтому держим их в Data Cache. */
export const COUNT_REVALIDATE_SECONDS = 60;

export const SORT_OPTIONS: { value: CatalogSort; label: string }[] = [
  { value: "price_asc", label: "Сначала дешевле" },
  { value: "price_desc", label: "Сначала дороже" },
];

export const EMPTY_FILTERS: CatalogFilters = {
  search: "",
  category: "",
  supplierId: "",
  region: "",
  stockStatus: "",
  sort: "price_asc",
  page: 1,
  expanded: [],
};

export type RawSearchParams = Record<string, string | string[] | undefined>;

function single(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

function parseExpanded(value: string) {
  return value
    .split(",")
    .map((part) => Number(part))
    .filter((id) => Number.isInteger(id) && id > 0);
}

export function readCatalogFilters(raw: RawSearchParams): CatalogFilters {
  const sort = single(raw.sort);

  return {
    search: single(raw.q).trim(),
    category: single(raw.category),
    supplierId: single(raw.supplier_id),
    region: single(raw.region),
    stockStatus: single(raw.stock_status),
    sort: sort === "price_desc" ? "price_desc" : "price_asc",
    page: Math.max(1, Number(single(raw.page)) || 1),
    expanded: parseExpanded(single(raw.expand)),
  };
}

export function writeCatalogFilters(filters: CatalogFilters) {
  const params = new URLSearchParams();

  const assign = (key: string, value: string) => {
    if (value) params.set(key, value);
  };

  assign("q", filters.search.trim());
  assign("category", filters.category);
  assign("supplier_id", filters.supplierId);
  assign("region", filters.region);
  assign("stock_status", filters.stockStatus);
  if (filters.sort !== "price_asc") params.set("sort", filters.sort);
  if (filters.page > 1) params.set("page", String(filters.page));
  if (filters.expanded.length > 0)
    params.set("expand", filters.expanded.join(","));

  return params.toString();
}

/**
 * Смена фильтра или сортировки возвращает выдачу на первую страницу,
 * а раскрытые группы схлопывает, иначе ссылка ведёт на пустой экран.
 */
export function applyFilterPatch(
  filters: CatalogFilters,
  patch: Partial<CatalogFilters>,
): CatalogFilters {
  const next = { ...filters, ...patch };
  const touchesQuery = Object.keys(patch).some(
    (key) => key !== "page" && key !== "expanded",
  );

  if (touchesQuery) {
    next.page = patch.page ?? 1;
    next.expanded = patch.expanded ?? [];
  } else if (patch.page !== undefined && patch.expanded === undefined) {
    next.expanded = [];
  }

  return next;
}

export function toOffersQuery(filters: CatalogFilters): OffersQuery {
  return {
    q: filters.search || undefined,
    category: filters.category || undefined,
    region: filters.region || undefined,
    stock_status: filters.stockStatus || undefined,
  };
}

export function sortOffers(offers: Offer[], sort: CatalogSort) {
  const price = (offer: Offer) => offer.price_value ?? Number.POSITIVE_INFINITY;

  return [...offers].sort((first, second) =>
    sort === "price_desc"
      ? price(second) - price(first)
      : price(first) - price(second),
  );
}

export function pluralOffers(count: number) {
  const tail = count % 10;
  const teen = count % 100;

  if (tail === 1 && teen !== 11) return `${count} оффер`;
  if (tail >= 2 && tail <= 4 && (teen < 10 || teen >= 20))
    return `${count} оффера`;
  return `${count} офферов`;
}

export function pluralResults(count: number) {
  const tail = count % 10;
  const teen = count % 100;

  if (tail === 1 && teen !== 11) return `${count} предложение`;
  if (tail >= 2 && tail <= 4 && (teen < 10 || teen >= 20))
    return `${count} предложения`;
  return `${count} предложений`;
}
