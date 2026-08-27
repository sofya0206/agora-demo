import type { Category, Currency, Offer } from "@/types";

export const FINDER_STORAGE_KEY = "agora-supplier-finder";

export const PILOT_CATEGORIES: Category[] = [
  { id: -1, slug: "corrugated-boxes", name: "Гофрокороба", priority: "high", sort_order: 10 },
  { id: -2, slug: "corrugated-sheet", name: "Гофролист", priority: "medium", sort_order: 20 },
  { id: -3, slug: "stretch-film", name: "Стрейч-плёнка", priority: "high", sort_order: 30 },
  { id: -4, slug: "shrink-film", name: "Термоусадочная плёнка", priority: "high", sort_order: 40 },
  { id: -5, slug: "bubble-wrap", name: "Воздушно-пузырчатая плёнка", priority: "high", sort_order: 50 },
  { id: -6, slug: "foam-pe", name: "Вспененный полиэтилен", priority: "medium", sort_order: 60 },
  { id: -7, slug: "packing-tape", name: "Упаковочный скотч", priority: "high", sort_order: 70 },
  { id: -8, slug: "strapping-tape", name: "Стреппинг-лента", priority: "medium", sort_order: 80 },
  { id: -9, slug: "courier-bags", name: "Курьерские и сейф-пакеты", priority: "high", sort_order: 90 },
  { id: -10, slug: "zip-lock", name: "Zip-lock пакеты", priority: "medium", sort_order: 100 },
  { id: -11, slug: "fillers", name: "Наполнители", priority: "medium", sort_order: 110 },
  { id: -12, slug: "thermal-labels", name: "Термоэтикетки", priority: "high", sort_order: 120 },
  { id: -13, slug: "pallets", name: "Паллеты", priority: "high", sort_order: 130 },
  { id: -14, slug: "rpc", name: "Складская пластиковая тара", priority: "medium", sort_order: 140 },
];

export const PILOT_REGIONS = [
  "Москва",
  "Московская область",
  "ЦФО",
  "Россия",
] as const;

export const STOCK_STATUSES = [
  "В наличии",
  "Под заказ",
  "Нет в наличии",
  "Ожидается",
] as const;

const specLabels: Record<string, { label: string; unit?: string }> = {
  box_type: { label: "Тип конструкции" },
  inner_length_mm: { label: "Внутренняя длина", unit: "мм" },
  inner_width_mm: { label: "Внутренняя ширина", unit: "мм" },
  inner_height_mm: { label: "Внутренняя высота", unit: "мм" },
  board_grade: { label: "Марка картона" },
  flute_profile: { label: "Профиль гофры" },
  sheet_format: { label: "Формат" },
  sheet_length_mm: { label: "Длина", unit: "мм" },
  sheet_width_mm: { label: "Ширина", unit: "мм" },
  stretch_type: { label: "Тип намотки" },
  stretch_width_mm: { label: "Ширина", unit: "мм" },
  stretch_thickness_mkm: { label: "Толщина", unit: "мкм" },
  stretch_length_m: { label: "Длина намотки", unit: "м" },
  shrink_material: { label: "Материал" },
  shrink_format: { label: "Формат" },
  shrink_width_mm: { label: "Ширина", unit: "мм" },
  shrink_thickness_mkm: { label: "Толщина", unit: "мкм" },
  bubble_width_mm: { label: "Ширина", unit: "мм" },
  bubble_length_m: { label: "Длина", unit: "м" },
  bubble_layers: { label: "Количество слоёв" },
  bubble_diameter_mm: { label: "Диаметр пузырька", unit: "мм" },
  foam_pe_form: { label: "Форма" },
  foam_pe_thickness_mm: { label: "Толщина", unit: "мм" },
  foam_pe_width_mm: { label: "Ширина", unit: "мм" },
  foam_pe_length_m: { label: "Длина / намотка", unit: "м" },
  tape_base_material: { label: "Основа" },
  tape_adhesive_type: { label: "Тип клея" },
  tape_width_mm: { label: "Ширина", unit: "мм" },
  tape_length_m: { label: "Длина намотки", unit: "м" },
  strap_material: { label: "Материал" },
  strap_width_mm: { label: "Ширина", unit: "мм" },
  strap_thickness_mm: { label: "Толщина", unit: "мм" },
  strap_length_m: { label: "Длина намотки", unit: "м" },
  courier_width_mm: { label: "Ширина", unit: "мм" },
  courier_height_mm: { label: "Высота", unit: "мм" },
  courier_flap_mm: { label: "Клапан", unit: "мм" },
  courier_thickness_mkm: { label: "Толщина плёнки", unit: "мкм" },
  zip_width_mm: { label: "Ширина", unit: "мм" },
  zip_height_mm: { label: "Высота", unit: "мм" },
  zip_thickness_mkm: { label: "Толщина", unit: "мкм" },
  zip_material: { label: "Материал" },
  filler_type: { label: "Тип наполнителя" },
  filler_material: { label: "Материал" },
  filler_pack_volume_l: { label: "Объём упаковки", unit: "л" },
  filler_pack_weight_kg: { label: "Вес упаковки", unit: "кг" },
  label_print_type: { label: "Тип печати" },
  label_width_mm: { label: "Ширина этикетки", unit: "мм" },
  label_height_mm: { label: "Высота этикетки", unit: "мм" },
  labels_per_roll: { label: "Этикеток в рулоне", unit: "шт" },
  pallet_material: { label: "Материал" },
  pallet_length_mm: { label: "Длина", unit: "мм" },
  pallet_width_mm: { label: "Ширина", unit: "мм" },
  pallet_dynamic_load_kg: { label: "Динамическая нагрузка", unit: "кг" },
  rpc_format_type: { label: "Формат" },
  rpc_length_mm: { label: "Длина", unit: "мм" },
  rpc_width_mm: { label: "Ширина", unit: "мм" },
  rpc_height_mm: { label: "Высота", unit: "мм" },
};

export function formatMoney(value: number, currency: Currency = "RUB") {
  // Оффер со скрытой ценой приходит из API как null.
  if (!Number.isFinite(value)) return "Цена по запросу";

  try {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency,
      maximumFractionDigits: value % 1 === 0 ? 0 : 2,
    }).format(value);
  } catch {
    return `${new Intl.NumberFormat("ru-RU").format(value)} ${currency}`;
  }
}

export function formatDays(value: number | null) {
  if (value === null) return "Не указан";
  return `${value} ${value % 10 === 1 && value % 100 !== 11 ? "день" : value % 10 >= 2 && value % 10 <= 4 && (value % 100 < 10 || value % 100 >= 20) ? "дня" : "дней"}`;
}

export function getSpecEntries(offer: Offer) {
  return Object.entries(offer.specs)
    .filter(([key, value]) => specLabels[key] && value !== "" && value != null)
    .map(([key, value]) => ({
      key,
      label: specLabels[key].label,
      value: `${String(value)}${specLabels[key].unit ? ` ${specLabels[key].unit}` : ""}`,
    }));
}

export type StockBadgeVariant = "default" | "secondary" | "destructive";

export function stockBadgeVariant(status: string): StockBadgeVariant {
  if (status === "В наличии") return "default";
  if (status === "Нет в наличии") return "destructive";
  return "secondary";
}

export function formatVat(rate: string) {
  return rate === "Без НДС" ? rate : `${rate}%`;
}
