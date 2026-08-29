import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HomeEyebrow } from "./HomeEyebrow";

const HIGHLIGHTS = ["Быстро", "Бесплатно", "И много коробочек"];

export function HomeHero() {
  return (
    <section className="flex min-h-[calc(100svh-73px)] flex-col items-center justify-center py-20 text-center">
      <HomeEyebrow>Поиск на основе ИИ</HomeEyebrow>

      <h1 className="mt-5 max-w-[900px] text-4xl font-extrabold tracking-[-0.033em] text-foreground sm:text-5xl lg:text-[60px] lg:leading-[1.04]">
        Ваши коробочки уже ждут вас
      </h1>

      <p className="mt-[22px] mb-8 max-w-[520px] text-lg leading-5 text-muted-foreground lg:text-[19px]">
        B2B-сервис, соединяющий вас с проверенными производителями транспортной
        упаковки.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild className="h-10 gap-2 px-6">
          <Link href="/catalog">
            Начать поиск
            <ArrowRight className="size-[17px]" aria-hidden="true" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-10 px-6">
          <Link href="/find-supplier">Найти поставщика</Link>
        </Button>
      </div>

      <ul className="mt-[34px] flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {HIGHLIGHTS.map((item) => (
          <li
            key={item}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
          >
            <Check className="size-[17px] text-foreground" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
