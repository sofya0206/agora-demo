import type {
  Category,
  Offer,
  Paginated,
  Supplier,
} from "@/types";

export const DEFAULT_API_URL = "https://agora.178.88.115.213.sslip.io/api";

export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL
).replace(/\/$/, "");

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type QueryValue = string | number | boolean | null | undefined;

function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const url = new URL(`${API_URL}${path.startsWith("/") ? path : `/${path}`}`);

  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

async function getJson<T>(
  path: string,
  query?: Record<string, QueryValue>,
  signal?: AbortSignal,
  revalidate?: number,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(buildUrl(path, query), {
      headers: { Accept: "application/json" },
      ...(revalidate === undefined
        ? { cache: "no-store" as const }
        : { next: { revalidate } }),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    throw new ApiError(0, "Не удалось подключиться к API");
  }

  if (!response.ok) {
    let message = `API вернул ошибку ${response.status}`;

    try {
      const body = (await response.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      // Сервер может вернуть HTML для инфраструктурных ошибок.
    }

    throw new ApiError(response.status, message);
  }

  return response.json() as Promise<T>;
}

export function getCategories(signal?: AbortSignal) {
  return getJson<{ data: Category[] }>("/categories", undefined, signal, 300);
}

export interface OffersQuery {
  q?: string;
  category?: string;
  category_id?: number;
  supplier_id?: number;
  stock_status?: string;
  region?: string;
  per_page?: number;
  page?: number;
}

export function getOffers(query: OffersQuery = {}, signal?: AbortSignal, revalidate?: number) {
  return getJson<Paginated<Offer>>(
    "/offers",
    query as Record<string, QueryValue>,
    signal,
    revalidate,
  );
}

export function getOffer(id: number | string, signal?: AbortSignal) {
  return getJson<{ data: Offer }>(`/offers/${id}`, undefined, signal);
}

export interface SuppliersQuery {
  q?: string;
  city?: string;
  per_page?: number;
  page?: number;
}

export function getSuppliers(query: SuppliersQuery = {}, signal?: AbortSignal) {
  return getJson<Paginated<Supplier>>(
    "/suppliers",
    query as Record<string, QueryValue>,
    signal,
    300,
  );
}

export function getSupplier(id: number | string, signal?: AbortSignal) {
  return getJson<{ data: Supplier }>(`/suppliers/${id}`, undefined, signal);
}
