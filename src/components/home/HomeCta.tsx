import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HomeCta() {
  return (
    <section className="mb-[176px] flex flex-col items-center gap-[13px] rounded-xl bg-primary px-8 py-14 text-center lg:px-[52px] lg:py-[60px]">
      <p className="text-xs leading-5 font-bold tracking-[0.14em] text-primary-foreground/70 uppercase">
        Готовы масштабировать закупки?
      </p>
      <h2 className="max-w-[620px] text-3xl font-extrabold tracking-[-0.028em] text-primary-foreground lg:text-4xl lg:leading-[1.1]">
        Начните поиск поставщиков за 5 минут
      </h2>
      <p className="max-w-[540px] leading-5 text-primary-foreground/80 lg:text-[17px]">
        Присоединяйтесь к 500+ компаниям, которые уже находят надёжных
        поставщиков упаковки через Агору.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-[17px]">
        <Button asChild variant="secondary" className="h-10 px-6">
          <Link href="/find-supplier">Начать бесплатно</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-10 border-primary-foreground/45 bg-transparent px-6 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground dark:border-primary-foreground/45 dark:bg-transparent dark:hover:bg-primary-foreground/10"
        >
          <Link href="/catalog">Смотреть каталог</Link>
        </Button>
      </div>
    </section>
  );
}
