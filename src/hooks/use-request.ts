"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { Offer, RequestItem } from "@/types";

const STORAGE_KEY = "agora-request-items";
const EMPTY_SNAPSHOT = "[]";
const listeners = new Set<() => void>();

function itemFromOffer(offer: Offer): RequestItem {
  return {
    offerId: offer.id,
    title: offer.offer_title,
    supplierId: offer.supplier.id,
    supplierName: offer.supplier.commercial_name,
    supplierLogoUrl: offer.supplier.logo_url,
    price: offer.price_value,
    currency: offer.currency,
    priceBasis: offer.price_basis,
    quantity: offer.moq_value,
    moq: offer.moq_value,
    photoUrl: offer.photo_url,
  };
}

/* Заявки, сохранённые до появления MOQ и фото, дополняем на чтении. */
function normalize(item: RequestItem): RequestItem {
  const moq = Number.isFinite(item.moq) && item.moq > 0 ? item.moq : 1;

  return {
    ...item,
    moq,
    supplierLogoUrl: item.supplierLogoUrl ?? null,
    photoUrl: item.photoUrl ?? null,
    quantity: Math.max(moq, item.quantity || moq),
  };
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) || EMPTY_SNAPSHOT;
  } catch {
    return EMPTY_SNAPSHOT;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function parse(snapshot: string): RequestItem[] {
  try {
    const parsed = JSON.parse(snapshot) as RequestItem[];
    return Array.isArray(parsed) ? parsed.map(normalize) : [];
  } catch {
    // Повреждённую заявку начинаем заново.
    return [];
  }
}

function readItems(): RequestItem[] {
  return parse(getSnapshot());
}

function save(items: RequestItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    listeners.forEach((listener) => listener());
  } catch {
    // В приватном режиме localStorage может быть недоступен.
  }
}

export function useRequest() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => EMPTY_SNAPSHOT,
  );
  const items = useMemo(() => parse(snapshot), [snapshot]);
  const ids = useMemo(
    () => new Set(items.map((item) => item.offerId)),
    [items],
  );

  const toggle = useCallback((offer: Offer) => {
    const current = readItems();

    save(
      current.some((item) => item.offerId === offer.id)
        ? current.filter((item) => item.offerId !== offer.id)
        : [...current, itemFromOffer(offer)],
    );
  }, []);

  const add = useCallback((offer: Offer) => {
    const current = readItems();
    if (current.some((item) => item.offerId === offer.id)) return;
    save([...current, itemFromOffer(offer)]);
  }, []);

  const setQuantity = useCallback((offerId: number, quantity: number) => {
    const current = readItems();
    save(
      current.map((item) =>
        item.offerId === offerId
          ? { ...item, quantity: Math.max(item.moq, quantity) }
          : item,
      ),
    );
  }, []);

  const remove = useCallback((offerId: number) => {
    save(readItems().filter((item) => item.offerId !== offerId));
  }, []);

  /* После отправки заявки черновик очищаем целиком. */
  const clear = useCallback(() => {
    save([]);
  }, []);

  return { items, ids, toggle, add, setQuantity, remove, clear };
}
