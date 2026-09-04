import type {
  ContactMethod,
  EntityType,
  RequestItem,
  RequestStatus,
} from "@/types";

export const SUBMITTED_REQUESTS_STORAGE_KEY = "agora-submitted-requests";

export const CONTACT_METHODS: { value: ContactMethod; label: string }[] = [
  { value: "phone", label: "Телефонный звонок" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "telegram", label: "Telegram" },
  { value: "max", label: "МАКС" },
  { value: "email", label: "E-mail" },
];

export const ENTITY_TYPES: { value: EntityType; label: string }[] = [
  { value: "legal", label: "Юридическое лицо" },
  { value: "individual", label: "Физическое лицо" },
];

/* Подписи статусов из макета «Мои заявки» — общие для списка, бейджей и шагов. */
export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  sent: "КП отправлено",
  viewed: "Просмотр",
  discussion: "Обсуждение условий",
  confirmed: "Подтверждена",
  rejected: "Отклонена",
};

/* Цену по запросу API отдаёт пустой, поэтому проверяем само число. */
export function isPriceOnRequest(item: RequestItem) {
  return !Number.isFinite(item.price);
}

export function itemTotal(item: RequestItem) {
  return isPriceOnRequest(item) ? 0 : item.price * item.quantity;
}

/* Предварительная сумма считается только по позициям с известной ценой. */
export function requestTotal(items: RequestItem[]) {
  return items.reduce((sum, item) => sum + itemTotal(item), 0);
}

export function splitByPrice(items: RequestItem[]) {
  return {
    priced: items.filter((item) => !isPriceOnRequest(item)),
    onRequest: items.filter(isPriceOnRequest),
  };
}

export interface SupplierGroup {
  supplierId: number;
  supplierName: string;
  supplierLogoUrl: string | null;
  items: RequestItem[];
}

/* В заявку можно набрать офферы разных компаний, а заявка уходит одному
   поставщику — поэтому позиции всегда режем по поставщикам. */
export function groupBySupplier(items: RequestItem[]): SupplierGroup[] {
  const groups = new Map<number, SupplierGroup>();

  items.forEach((item) => {
    const group = groups.get(item.supplierId);

    if (group) {
      group.items.push(item);
      return;
    }

    groups.set(item.supplierId, {
      supplierId: item.supplierId,
      supplierName: item.supplierName,
      supplierLogoUrl: item.supplierLogoUrl,
      items: [item],
    });
  });

  return [...groups.values()];
}

export function formatPositions(count: number) {
  const tail = count % 10;
  const hundreds = count % 100;

  if (tail === 1 && hundreds !== 11) return `${count} позиция`;
  if (tail >= 2 && tail <= 4 && (hundreds < 10 || hundreds >= 20))
    return `${count} позиции`;

  return `${count} позиций`;
}

export function formatRequestNumbers(numbers: number[]) {
  return numbers.map((number) => `№${number}`).join(", ");
}

export function formatRequestDate(iso: string) {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
