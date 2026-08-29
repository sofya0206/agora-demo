"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getCategories } from "@/lib/api";
import {
  FINDER_STORAGE_KEY,
  PILOT_CATEGORIES,
  PILOT_REGIONS,
} from "@/lib/catalog";
import type { Category, SupplierFinderSelection } from "@/types";

export default function FindSupplierPage() {
  return (
    <Suspense fallback={null}>
      <SupplierFinder />
    </Suspense>
  );
}

function SupplierFinder() {
  const router = useRouter();
  const preselected = (useSearchParams().get("categories") ?? "")
    .split(",")
    .filter(Boolean);
  const [step, setStep] = useState(preselected.length > 0 ? 2 : 1);
  const [categories, setCategories] = useState<Category[]>(PILOT_CATEGORIES);
  const [usingFallback, setUsingFallback] = useState(false);
  const [categorySlugs, setCategorySlugs] = useState<Set<string>>(
    new Set(preselected),
  );
  const [regions, setRegions] = useState<Set<string>>(new Set());
  const [maxMoq, setMaxMoq] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    getCategories(controller.signal)
      .then(({ data }) => {
        if (data.length > 0) setCategories(data);
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException)) setUsingFallback(true);
      });
    return () => controller.abort();
  }, []);

  function toggleValue(
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    value: string,
  ) {
    setter((current) => {
      const next = new Set(current);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  function showResults() {
    const selection: SupplierFinderSelection = {
      categorySlugs: Array.from(categorySlugs),
      regions: Array.from(regions),
      maxMoq: maxMoq && Number(maxMoq) > 0 ? Number(maxMoq) : null,
    };

    try {
      window.sessionStorage.setItem(
        FINDER_STORAGE_KEY,
        JSON.stringify(selection),
      );
    } catch {
      // Переход сработает и без sessionStorage; результаты покажут пустое состояние.
    }
    router.push("/find-supplier/results");
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,var(--muted),transparent_34%),radial-gradient(circle_at_85%_45%,var(--muted),transparent_35%)]" />
      <div className="relative z-10">
        <section className="mx-auto max-w-4xl px-5 pb-24 pt-12 sm:px-8">
          <div className="text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Подбор по ассортименту
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-[-0.055em] sm:text-5xl">
              Найдём поставщиков под вашу задачу
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
              Результат рассчитывается по активным офферам: категориям, регионам
              доставки и минимальной партии.
            </p>
          </div>

          <div className="mx-auto mt-10 flex max-w-xl items-center gap-3">
            {[1, 2, 3].map((number) => (
              <div
                key={number}
                className="flex flex-1 items-center gap-3 last:flex-none"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${
                    step >= number
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-muted text-muted-foreground"
                  }`}
                >
                  {number}
                </div>
                {number < 3 && (
                  <div
                    className={`h-px flex-1 ${step > number ? "bg-primary" : "bg-border"}`}
                  />
                )}
              </div>
            ))}
          </div>

          <section className="mt-10 rounded-[36px] border border-border bg-background p-6 backdrop-blur-xl sm:p-10">
            {usingFallback && (
              <div className="mb-6 rounded-2xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
                Категории показаны из актуального контракта: production-маршрут
                `/categories` пока не развернут.
              </div>
            )}

            {step === 1 && (
              <div>
                <div className="text-sm text-muted-foreground">Шаг 1 из 3</div>
                <h2 className="mt-2 text-2xl font-black">
                  Какая упаковка нужна?
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Можно выбрать несколько категорий.
                </p>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {categories.map((category) => {
                    const selected = categorySlugs.has(category.slug);
                    return (
                      <button
                        type="button"
                        key={category.slug}
                        onClick={() =>
                          toggleValue(setCategorySlugs, category.slug)
                        }
                        className={`rounded-2xl border p-4 text-left text-sm font-medium transition ${
                          selected
                            ? "border-primary bg-muted text-foreground"
                            : "border-border bg-background text-foreground hover:bg-muted"
                        }`}
                      >
                        <span className="mr-3 text-muted-foreground">
                          {selected ? "✓" : "○"}
                        </span>
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="text-sm text-muted-foreground">Шаг 2 из 3</div>
                <h2 className="mt-2 text-2xl font-black">
                  Куда нужна поставка?
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Без выбора региона покажем все предложения.
                </p>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {PILOT_REGIONS.map((region) => {
                    const selected = regions.has(region);
                    return (
                      <button
                        type="button"
                        key={region}
                        onClick={() => toggleValue(setRegions, region)}
                        className={`rounded-2xl border p-5 text-left font-medium transition ${
                          selected
                            ? "border-primary bg-muted text-foreground"
                            : "border-border bg-background text-foreground hover:bg-muted"
                        }`}
                      >
                        <span className="mr-3 text-muted-foreground">
                          {selected ? "✓" : "○"}
                        </span>
                        {region}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <div className="text-sm text-muted-foreground">Шаг 3 из 3</div>
                <h2 className="mt-2 text-2xl font-black">
                  Ограничить минимальную партию?
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Укажем поставщиков, у которых есть хотя бы один оффер с
                  подходящим MOQ.
                </p>
                <label className="mt-8 block">
                  <span className="mb-3 block text-sm font-medium text-foreground">
                    MOQ не более
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={maxMoq}
                    onChange={(event) => setMaxMoq(event.target.value)}
                    placeholder="Например, 100"
                    className="w-full rounded-2xl border border-input bg-background px-5 py-4 text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                  />
                </label>
                <div className="mt-6 rounded-2xl border border-border bg-muted p-5 text-sm text-muted-foreground">
                  Выбрано категорий:{" "}
                  <strong className="text-foreground">
                    {categorySlugs.size}
                  </strong>{" "}
                  · регионов:{" "}
                  <strong className="text-foreground">
                    {regions.size || "все"}
                  </strong>
                </div>
              </div>
            )}

            <div className="mt-10 flex items-center justify-between gap-4 border-t border-border pt-6">
              <button
                type="button"
                onClick={() => setStep((current) => Math.max(1, current - 1))}
                disabled={step === 1}
                className="rounded-full border border-border px-5 py-3 text-sm text-foreground disabled:opacity-30"
              >
                Назад
              </button>
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep((current) => Math.min(3, current + 1))}
                  disabled={step === 1 && categorySlugs.size === 0}
                  className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Продолжить
                </button>
              ) : (
                <button
                  type="button"
                  onClick={showResults}
                  disabled={categorySlugs.size === 0}
                  className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Показать поставщиков
                </button>
              )}
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}
