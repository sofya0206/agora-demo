"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { SUBMITTED_REQUESTS_STORAGE_KEY, requestTotal } from "@/lib/request";
import type { RequestDraft, RequestStatus, SubmittedRequest } from "@/types";

const EMPTY_SNAPSHOT = "[]";
const listeners = new Set<() => void>();

function getSnapshot() {
  try {
    return (
      window.localStorage.getItem(SUBMITTED_REQUESTS_STORAGE_KEY) ||
      EMPTY_SNAPSHOT
    );
  } catch {
    return EMPTY_SNAPSHOT;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === SUBMITTED_REQUESTS_STORAGE_KEY) listener();
  };
  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function parse(snapshot: string): SubmittedRequest[] {
  try {
    const parsed = JSON.parse(snapshot) as SubmittedRequest[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Повреждённую историю заявок игнорируем, а не роняем экран.
    return [];
  }
}

function readRequests() {
  return parse(getSnapshot());
}

function save(requests: SubmittedRequest[]) {
  try {
    window.localStorage.setItem(
      SUBMITTED_REQUESTS_STORAGE_KEY,
      JSON.stringify(requests),
    );
    listeners.forEach((listener) => listener());
  } catch {
    // В приватном режиме localStorage может быть недоступен.
  }
}

function createId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `request-${Date.now()}-${Math.round(Math.random() * 1e6)}`;
  }
}

/*
  Отправленные заявки. POST-эндпоинта в API нет, поэтому отправка имитируется:
  заявка складывается в localStorage отдельным ключом от черновика заявки
  (agora-request-items), чтобы очистка корзины не стирала историю.
*/
export function useSubmittedRequests() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => EMPTY_SNAPSHOT,
  );
  const requests = useMemo(() => parse(snapshot), [snapshot]);

  const getById = useCallback(
    (id: string) => requests.find((request) => request.id === id),
    [requests],
  );

  const getByNumber = useCallback(
    (number: number) => requests.find((request) => request.number === number),
    [requests],
  );

  /* Заявок может быть несколько: по одной на каждого поставщика из корзины. */
  const submit = useCallback((drafts: RequestDraft[]) => {
    const current = readRequests();
    const lastNumber = current.reduce(
      (max, request) => Math.max(max, request.number),
      0,
    );
    const createdAt = new Date().toISOString();

    const created: SubmittedRequest[] = drafts.map((draft, index) => ({
      id: createId(),
      number: lastNumber + index + 1,
      createdAt,
      supplierId: draft.supplierId,
      supplierName: draft.supplierName,
      supplierLogoUrl: draft.supplierLogoUrl,
      items: draft.items,
      preliminaryTotal: requestTotal(draft.items),
      currency: draft.items[0]?.currency || "RUB",
      contact: draft.contact,
      status: "sent",
    }));

    save([...current, ...created]);

    return created;
  }, []);

  const updateStatus = useCallback((id: string, status: RequestStatus) => {
    save(
      readRequests().map((request) =>
        request.id === id ? { ...request, status } : request,
      ),
    );
  }, []);

  return { requests, getById, getByNumber, submit, updateStatus };
}
