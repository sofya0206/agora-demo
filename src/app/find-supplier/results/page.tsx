"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { SupplierLogo } from "@/components/SupplierLogo";
import { ApiError, getOffers, getSuppliers } from "@/lib/api";
import { FINDER_STORAGE_KEY, formatMoney, PILOT_CATEGORIES } from "@/lib/catalog";
import type { Offer, Supplier, SupplierFinderSelection } from "@/types";

interface Match {
  supplier: Supplier;
  offers: Offer[];
  matchedCategorySlugs: string[];
  fullMatch: boolean;
}

function subscribeToSelection() {
  return () => {};
}

function getSelectionSnapshot() {
  try {
    return window.sessionStorage.getItem(FINDER_STORAGE_KEY);
  } catch {
    return null;
  }
}

export default function SupplierResultsPage() {
  const selectionSnapshot = useSyncExternalStore(
    subscribeToSelection,
    getSelectionSnapshot,
    () => null,
  );
  const selection = useMemo<SupplierFinderSelection | null>(() => {
    if (!selectionSnapshot) return null;
    try {
      return JSON.parse(selectionSnapshot) as SupplierFinderSelection;
    } catch {
      return { categorySlugs: [], regions: [], maxMoq: null };
    }
  }, [selectionSnapshot]);
  const queryKey = selection ? JSON.stringify(selection) : "";
  const [resultState, setResultState] = useState<{
    key: string;
    suppliers: Supplier[];
    offers: Offer[];
    error: string | null;
  }>({ key: "", suppliers: [], offers: [], error: null });
  const suppliers = resultState.suppliers;
  const offers = resultState.offers;
  const error = resultState.error;
  const noCategories = selection !== null && selection.categorySlugs.length === 0;
  const loading = selection === null || (!noCategories && resultState.key !== queryKey);

  useEffect(() => {
    if (!selection) return;
    if (selection.categorySlugs.length === 0) return;

    const controller = new AbortController();

    Promise.all([
      getSuppliers({ per_page: 100 }, controller.signal),
      Promise.all(
        selection.categorySlugs.map((category) =>
          getOffers({ category, per_page: 100 }, controller.signal),
        ),
      ),
    ])
      .then(([supplierPage, offerPages]) => {
        const uniqueOffers = Array.from(
          new Map(offerPages.flatMap((page) => page.data).map((offer) => [offer.id, offer])).values(),
        );
        setResultState({
          key: queryKey,
          suppliers: supplierPage.data,
          offers: uniqueOffers,
          error: null,
        });
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setResultState({
          key: queryKey,
          suppliers: [],
          offers: [],
          error:
            requestError instanceof ApiError
              ? requestError.message
              : "Не удалось рассчитать подбор.",
        });
      });

    return () => controller.abort();
  }, [queryKey, selection]);

  const matches = useMemo<Match[]>(() => {
    if (!selection) return [];

    return suppliers
      .map((supplier) => {
        const supplierOffers = offers.filter((offer) => {
          if (offer.supplier.id !== supplier.id) return false;
          if (selection.maxMoq !== null && offer.moq_value > selection.maxMoq) return false;
          if (
            selection.regions.length > 0 &&
            !selection.regions.some((region) => offer.delivery_regions.includes(region))
          ) return false;
          return true;
        });
        const matchedCategorySlugs = Array.from(
          new Set(supplierOffers.map((offer) => offer.category.slug)),
        );
        return {
          supplier,
          offers: supplierOffers,
          matchedCategorySlugs,
          fullMatch: selection.categorySlugs.every((slug) => matchedCategorySlugs.includes(slug)),
        };
      })
      .filter((match) => match.offers.length > 0)
      .sort((a, b) => {
        if (a.fullMatch !== b.fullMatch) return a.fullMatch ? -1 : 1;
        if (a.matchedCategorySlugs.length !== b.matchedCategorySlugs.length) {
          return b.matchedCategorySlugs.length - a.matchedCategorySlugs.length;
        }
        return Math.min(...a.offers.map((offer) => offer.price_value)) - Math.min(...b.offers.map((offer) => offer.price_value));
      });
  }, [offers, selection, suppliers]);

  const selectedNames = (selection?.categorySlugs || []).map(
    (slug) => PILOT_CATEGORIES.find((category) => category.slug === slug)?.name || slug,
  );

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.15),transparent_35%)]" />
      <div className="relative z-10">
        <section className="mx-auto max-w-6xl px-5 pb-24 pt-12 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Результаты подбора</div>
            <Link href="/find-supplier" className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-white/70 hover:bg-white/10">
              Изменить параметры
            </Link>
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
            Подходящие поставщики
          </h1>
          <p className="mt-5 max-w-3xl text-white/50">
            {selectedNames.length > 0
              ? `Ищем предложения в категориях: ${selectedNames.join(", ")}.`
              : "Сначала выберите хотя бы одну категорию."}
          </p>

          {selection && (
            <div className="mt-7 flex flex-wrap gap-2 text-xs">
              {selection.regions.map((region) => (
                <span key={region} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-white/60">{region}</span>
              ))}
              {selection.maxMoq !== null && (
                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-cyan-200">MOQ ≤ {selection.maxMoq}</span>
              )}
            </div>
          )}

          <div className="mt-10">
            {loading ? (
              <div className="grid gap-5 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-64 animate-pulse rounded-[30px] border border-white/10 bg-white/[0.04]" />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-[30px] border border-rose-400/20 bg-rose-400/10 p-10 text-center">
                <h2 className="text-xl font-semibold">Подбор не загрузился</h2>
                <p className="mt-2 text-white/55">{error}</p>
              </div>
            ) : matches.length === 0 ? (
              <div className="rounded-[30px] border border-dashed border-white/15 bg-white/[0.03] p-12 text-center">
                <div className="text-5xl text-white/25">◎</div>
                <h2 className="mt-5 text-2xl font-black">Совпадений пока нет</h2>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/45">
                  Ослабьте ограничения или добавьте активных поставщиков и офферы через админ-панель.
                </p>
                <Link href="/find-supplier" className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black">
                  Изменить параметры
                </Link>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {matches.map((match) => {
                  const minimum = match.offers.reduce((current, offer) =>
                    offer.price_value < current.price_value ? offer : current,
                  );
                  return (
                    <article key={match.supplier.id} className="rounded-[30px] border border-white/10 bg-white/[0.04] p-7 transition hover:border-cyan-400/20 hover:bg-white/[0.06]">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className={`rounded-full border px-3 py-1 text-xs ${
                            match.fullMatch
                              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                              : "border-amber-400/20 bg-amber-400/10 text-amber-200"
                          }`}>
                            {match.fullMatch ? "Полное совпадение" : "Частичное совпадение"}
                          </span>
                          <h2 className="mt-4 text-2xl font-black">{match.supplier.commercial_name}</h2>
                          <p className="mt-2 text-sm text-white/45">
                            {match.supplier.shipping_cities.join(", ") || "Город отгрузки не указан"}
                          </p>
                        </div>
                        <SupplierLogo
                          name={match.supplier.commercial_name}
                          logoUrl={match.supplier.logo_url}
                          sizes="48px"
                        />
                      </div>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {match.matchedCategorySlugs.map((slug) => (
                          <span key={slug} className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/55">
                            {PILOT_CATEGORIES.find((category) => category.slug === slug)?.name || slug}
                          </span>
                        ))}
                      </div>

                      <div className="mt-7 grid grid-cols-2 gap-3 border-t border-white/10 pt-5 text-sm">
                        <div>
                          <div className="text-white/35">Подходящих офферов</div>
                          <div className="mt-1 text-lg font-bold">{match.offers.length}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white/35">Цена от</div>
                          <div className="mt-1 text-lg font-bold">{formatMoney(minimum.price_value, minimum.currency)}</div>
                        </div>
                      </div>

                      <Link href={`/supplier/${match.supplier.id}`} className="mt-6 flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-cyan-100">
                        Открыть поставщика
                      </Link>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
