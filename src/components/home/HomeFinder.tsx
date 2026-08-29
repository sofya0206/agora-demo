import { Fragment } from "react";
import { PILOT_CATEGORIES } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { CategoryPicker } from "./CategoryPicker";
import { HomeEyebrow } from "./HomeEyebrow";

const STEPS = [1, 2, 3];

export function HomeFinder() {
  return (
    <section className="flex flex-col items-center gap-[26px] pt-4 pb-24 lg:pb-[168px]">
      <div className="flex max-w-[680px] flex-col items-center gap-3.5 text-center">
        <HomeEyebrow>Подбор по ассортименту</HomeEyebrow>
        <h2 className="text-3xl font-extrabold tracking-[-0.026em] text-foreground lg:text-[38px] lg:leading-[1.1]">
          Найдём поставщиков под вашу задачу
        </h2>
        <p className="max-w-[560px] text-base leading-5 text-muted-foreground">
          Результат рассчитывается по активным офферам: категориям, регионам
          доставки и минимальной партии.
        </p>
      </div>

      <ol className="flex w-full max-w-[520px] items-center pt-2">
        {STEPS.map((step, index) => (
          <Fragment key={step}>
            {index > 0 && (
              <li aria-hidden="true" className="h-0.5 flex-1 bg-border" />
            )}
            <li
              aria-current={step === 1 ? "step" : undefined}
              className={cn(
                "flex size-[34px] items-center justify-center rounded-full font-mono text-sm font-bold",
                step === 1
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-background text-muted-foreground",
              )}
            >
              {step}
            </li>
          </Fragment>
        ))}
      </ol>

      <CategoryPicker categories={PILOT_CATEGORIES} />
    </section>
  );
}
