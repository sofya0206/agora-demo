import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HomeCta() {
  return (
    <section className="w-full snap-start scroll-mt-[90px] bg-home-panel">
      <div className="mx-auto flex w-full min-h-[calc(100svh-90px)] max-w-[1200px] flex-col justify-center px-5 py-20 sm:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-home-panel-line px-6 py-16 text-center">
          <span
            className="pointer-events-none absolute -top-10 -right-6 text-[220px] leading-none font-bold text-home-panel-text/5 select-none"
            aria-hidden="true"
          >
            A
          </span>

          <div className="relative flex flex-col items-center gap-5">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-home-panel-accent uppercase">
              Начните с задачи
            </p>

            <h2 className="text-3xl font-bold tracking-[-0.02em] text-home-panel-text sm:text-[44px] sm:leading-[1.15]">
              <span className="block">Опишите упаковку.</span>
              <span className="block text-home-panel-accent">
                Агора найдёт, кого спросить.
              </span>
            </h2>

            <p className="text-sm text-home-panel-muted">
              Один структурированный запрос вместо десятков одинаковых
              сообщений.
            </p>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/find-supplier"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-home-accent-fill px-6 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Подобрать поставщика
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/catalog"
                className="inline-flex h-11 items-center rounded-lg bg-white px-6 text-sm font-medium text-home-panel transition-opacity hover:opacity-90"
              >
                Я поставщик
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
