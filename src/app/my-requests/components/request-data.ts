import type { RequestItem, RequestStatus, SubmittedRequest } from "@/types";

export type RequestView = Pick<
  SubmittedRequest,
  | "id"
  | "number"
  | "createdAt"
  | "supplierId"
  | "supplierName"
  | "supplierLogoUrl"
  | "items"
  | "preliminaryTotal"
  | "currency"
  | "status"
>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function readItem(value: unknown): RequestItem | null {
  if (
    !isRecord(value) ||
    !isPositiveInteger(value.offerId) ||
    typeof value.title !== "string" ||
    !isPositiveInteger(value.supplierId) ||
    typeof value.supplierName !== "string" ||
    !isNullableString(value.supplierLogoUrl) ||
    !(
      value.price === null ||
      (typeof value.price === "number" &&
        (Number.isNaN(value.price) ||
          (Number.isFinite(value.price) && value.price >= 0)))
    ) ||
    typeof value.currency !== "string" ||
    typeof value.priceBasis !== "string" ||
    typeof value.quantity !== "number" ||
    !Number.isFinite(value.quantity) ||
    value.quantity <= 0 ||
    typeof value.moq !== "number" ||
    !Number.isFinite(value.moq) ||
    value.moq <= 0 ||
    !isNullableString(value.photoUrl)
  ) {
    return null;
  }

  return {
    offerId: value.offerId,
    title: value.title,
    supplierId: value.supplierId,
    supplierName: value.supplierName,
    supplierLogoUrl: value.supplierLogoUrl,
    // JSON сохраняет NaN как null. В компонентах заявки это цена по запросу.
    price: value.price === null ? Number.NaN : value.price,
    currency: value.currency,
    priceBasis: value.priceBasis,
    quantity: value.quantity,
    moq: value.moq,
    photoUrl: value.photoUrl,
  };
}

function isRequestStatus(value: unknown): value is RequestStatus {
  return (
    value === "sent" ||
    value === "viewed" ||
    value === "discussion" ||
    value === "confirmed" ||
    value === "rejected"
  );
}

/* Хранилище Сони остаётся без изменений. Проверяем только данные нашего экрана. */
export function readRequests(value: unknown): RequestView[] {
  if (!Array.isArray(value)) return [];

  const requests: RequestView[] = [];
  const ids = new Set<string>();
  const numbers = new Set<number>();

  for (const entry of value) {
    if (
      !isRecord(entry) ||
      typeof entry.id !== "string" ||
      !entry.id ||
      !isPositiveInteger(entry.number) ||
      typeof entry.createdAt !== "string" ||
      !Number.isFinite(Date.parse(entry.createdAt)) ||
      !isPositiveInteger(entry.supplierId) ||
      typeof entry.supplierName !== "string" ||
      !isNullableString(entry.supplierLogoUrl) ||
      !Array.isArray(entry.items) ||
      typeof entry.preliminaryTotal !== "number" ||
      !Number.isFinite(entry.preliminaryTotal) ||
      entry.preliminaryTotal < 0 ||
      typeof entry.currency !== "string" ||
      !isRequestStatus(entry.status) ||
      ids.has(entry.id) ||
      numbers.has(entry.number)
    ) {
      continue;
    }

    const items = entry.items.map(readItem);
    if (
      !items.every(
        (item): item is RequestItem =>
          item !== null && item.supplierId === entry.supplierId,
      )
    )
      continue;

    ids.add(entry.id);
    numbers.add(entry.number);
    requests.push({
      id: entry.id,
      number: entry.number,
      createdAt: entry.createdAt,
      supplierId: entry.supplierId,
      supplierName: entry.supplierName,
      supplierLogoUrl: entry.supplierLogoUrl,
      items,
      preliminaryTotal: entry.preliminaryTotal,
      currency: entry.currency,
      status: entry.status,
    });
  }

  return requests.sort((first, second) => second.number - first.number);
}
