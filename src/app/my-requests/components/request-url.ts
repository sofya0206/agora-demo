import type { RequestStatus } from "@/types";

export type RequestFilter = "all" | RequestStatus;

const REQUEST_FILTERS = new Set<RequestFilter>([
  "all",
  "sent",
  "viewed",
  "discussion",
  "confirmed",
  "rejected",
]);

export function readRequestFilter(value: string | null): RequestFilter {
  return value && REQUEST_FILTERS.has(value as RequestFilter)
    ? (value as RequestFilter)
    : "all";
}

export function readRequestNumber(value: string | null): number | null {
  if (!value || !/^[1-9]\d*$/.test(value)) return null;
  const number = Number(value);
  return Number.isSafeInteger(number) ? number : null;
}

export function buildRequestsHref(
  searchParams: URLSearchParams,
  patch: { filter?: RequestFilter; requestNumber?: number | null },
) {
  const next = new URLSearchParams(searchParams);

  if (patch.filter !== undefined) {
    if (patch.filter === "all") next.delete("status");
    else next.set("status", patch.filter);
    next.delete("request");
  }

  if (patch.requestNumber !== undefined) {
    if (patch.requestNumber === null) next.delete("request");
    else next.set("request", String(patch.requestNumber));
  }

  const query = next.toString();
  return query ? `/my-requests?${query}` : "/my-requests";
}
