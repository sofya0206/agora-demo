import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const audience = ["К", "М", "О"];

export function HomeHero() {
  return (
    <section className="relative w-full overflow-hidden bg-home-bg text-home-text">
      <Image
        src="/home/hero-boxes.png"
        alt=""
        aria-hidden="true"
        width={1536}
        height={1024}
        priority
        className="pointer-events-none absolute inset-0 size-full object-cover"
      />

      <div className="relative mx-auto flex w-full max-w-[1200px] flex-col items-center gap-6 px-5 py-24 text-center sm:px-8 sm:py-40">
        <span className="inline-flex items-center gap-2 rounded-full bg-home-card px-4 py-2 text-[11px] font-semibold tracking-[0.12em] text-home-text uppercase shadow-xs">
          <span
            className="size-1.5 rounded-full bg-home-accent"
            aria-hidden="true"
          />
          B2B-платформа закупки упаковки
        </span>

        <h1 className="text-4xl font-bold tracking-[-0.03em] sm:text-[56px] sm:leading-[1.1]">
          <span className="block">Поставщик упаковки.</span>
          <span className="block text-home-accent">Точно под задачу.</span>
        </h1>

        <p className="max-w-[620px] text-sm leading-6 text-home-muted">
          Агора помогает бизнесу находить поставщиков транспортной и
          промышленной упаковки по понятным условиям — без десятков звонков и
          запросов «в пустоту».
        </p>

        <Link
          href="/find-supplier"
          className="mt-2 inline-flex h-11 items-center gap-2 rounded-lg bg-home-accent-fill px-6 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Подобрать поставщика
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>

        <div className="mt-2 flex items-center gap-3">
          <span className="flex -space-x-2" aria-hidden="true">
            {audience.map((letter) => (
              <span
                key={letter}
                className="flex size-8 items-center justify-center rounded-full border border-home-line bg-home-card text-xs font-semibold text-home-muted"
              >
                {letter}
              </span>
            ))}
          </span>
          <p className="text-left text-xs leading-4 text-home-muted">
            Для e-commerce, магазинов
            <br />и оптовых покупателей
          </p>
        </div>
      </div>
    </section>
  );
}
