export type StockStatus =
  "В наличии" | "Под заказ" | "Нет в наличии" | "Ожидается";

export type Currency = "RUB" | "CNY" | "USD" | "EUR" | string;

export interface Category {
  id: number;
  slug: string;
  name: string;
  priority: string;
  sort_order: number;
}

export interface SupplierContact {
  person: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  telegram: string | null;
}

export interface Supplier {
  id: number;
  commercial_name: string;
  legal_name: string | null;
  inn: string;
  legal_address: string | null;
  logo_url: string | null;
  contact: SupplierContact;
  shipping_cities: string[];
}

export interface OfferSupplier {
  id: number;
  commercial_name: string;
  logo_url: string | null;
}

export interface OfferCategory {
  id: number;
  slug: string;
  name: string;
}

export interface Offer {
  id: number;
  offer_title: string;
  supplier: OfferSupplier;
  category: OfferCategory;
  price_value: number;
  currency: Currency;
  price_basis: string;
  moq_value: number;
  stock_status: StockStatus | string;
  production_lead_days: number | null;
  delivery_lead_days: number | null;
  delivery_regions: string[];
  pickup_available: boolean;
  payment_terms: string;
  vat_rate: string;
  branding_available: boolean;
  photo_url: string | null;
  description_short: string | null;
  specs: Record<string, string | number | boolean>;
}

export interface PageLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PageMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number | null;
  to?: number | null;
}

export interface Paginated<T> {
  data: T[];
  links: PageLinks;
  meta: PageMeta;
}

export type CatalogSort = "price_asc" | "price_desc";

export interface CatalogFilters {
  search: string;
  category: string;
  supplierId: string;
  region: string;
  stockStatus: string;
  sort: CatalogSort;
  page: number;
  expanded: number[];
}

export interface RequestItem {
  offerId: number;
  title: string;
  supplierId: number;
  supplierName: string;
  price: number;
  currency: Currency;
  priceBasis: string;
  quantity: number;
}

export interface SupplierFinderSelection {
  categorySlugs: string[];
  regions: string[];
  maxMoq: number | null;
}
