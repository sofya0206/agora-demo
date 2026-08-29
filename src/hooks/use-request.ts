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
    price: offer.price_value,
    currency: offer.currency,
    priceBasis: offer.price_basis,
    quantity: offer.moq_value,
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

function readItems(): RequestItem[] {
  try {
    return JSON.parse(getSnapshot()) as RequestItem[];
  } catch {
    // Повреждённую заявку начинаем заново.
    return [];
  }
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
  const items = useMemo(() => {
    try {
      return JSON.parse(snapshot) as RequestItem[];
    } catch {
      return [];
    }
  }, [snapshot]);
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
          ? { ...item, quantity: Math.max(1, quantity) }
          : item,
      ),
    );
  }, []);

  const remove = useCallback((offerId: number) => {
    save(readItems().filter((item) => item.offerId !== offerId));
  }, []);

  return { items, ids, toggle, add, setQuantity, remove };
}
