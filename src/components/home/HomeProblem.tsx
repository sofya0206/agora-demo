import { Check, Clock, Package, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { HomeHeading, HomeSection } from "./HomeSection";

const cards = [
  {
    number: "01",
    title: "Ручной поиск",
    text: "Сайты, каталоги, мессенджеры и рекомендации не дают единой картины рынка.",
    accent: false,
    illustration: <SearchIllustration />,
  },
  {
    number: "02",
    title: "Нечего сравнивать",
    text: "Минимальная партия, сроки и география часто становятся известны только после звонка.",
    accent: true,
    illustration: <CompareIllustration />,
  },
  {
    number: "03",
    title: "Потеря времени",
    text: "Общий запрос уходит не тем поставщикам и возвращается уточняющими вопросами.",
    accent: false,
    illustration: <TimeIllustration />,
  },
];

export function HomeProblem() {
  return (
    <HomeSection tone="light" className="flex flex-col gap-12">
      <HomeHeading
        eyebrow="01 / Проблема"
        lines={["Закупка упаковки", "не должна начинаться", "с 30 вкладок"]}
        lead="Параметры спрятаны, условия отличаются, а ответ поставщика приходится ждать после длинной переписки. Агора собирает главное до первого контакта."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.number}
            className={cn(
              "flex flex-col gap-6 rounded-2xl border p-6",
              card.accent
                ? "border-home-accent/40 bg-home-accent-surface"
                : "border-home-line bg-home-card",
            )}
          >
            <p className="text-[11px] font-semibold tracking-[0.12em] text-home-muted">
              {card.number}
            </p>
            <div className="flex h-[110px] items-center justify-center">
              {card.illustration}
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-base font-semibold">{card.title}</h3>
              <p className="text-sm leading-5 text-home-muted">{card.text}</p>
            </div>
          </article>
        ))}
      </div>
    </HomeSection>
  );
}

/* Иллюстрации собраны фигурами, чтобы перекрашиваться вместе с темой. */
function IllustrationFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex w-full max-w-[240px] items-center justify-center">
      {children}
    </div>
  );
}

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex w-[170px] flex-col gap-2 rounded-lg border border-home-line bg-home-card p-3",
        className,
      )}
    >
      <span className="h-2 w-20 rounded-full bg-home-line" />
      <span className="h-2 w-28 rounded-full bg-home-line" />
      <span className="h-2 w-16 rounded-full bg-home-accent-soft" />
    </div>
  );
}

function SearchIllustration() {
  return (
    <IllustrationFrame>
      <SkeletonCard />
      <span className="absolute top-0 right-2 flex size-14 items-center justify-center rounded-lg border border-home-line bg-home-accent-surface text-home-accent">
        <Package className="size-6" aria-hidden="true" />
      </span>
      <span className="absolute right-0 bottom-1 flex size-9 items-center justify-center rounded-full bg-home-panel text-home-panel-accent">
        <Search className="size-4" aria-hidden="true" />
      </span>
    </IllustrationFrame>
  );
}

function CompareIllustration() {
  return (
    <IllustrationFrame>
      <div className="flex w-[190px] flex-col gap-2 rounded-lg border border-home-line bg-home-card p-3">
        <span className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-home-accent" />
          <span className="h-2 w-24 rounded-full bg-home-line" />
        </span>
        <span className="flex gap-2">
          <span className="h-2 w-10 rounded-full bg-home-line" />
          <span className="h-2 w-16 rounded-full bg-home-accent-soft" />
        </span>
        <span className="h-2 w-28 rounded-full bg-home-line" />
      </div>
      <span className="absolute right-0 bottom-1 flex size-9 items-center justify-center rounded-full bg-home-accent-fill text-white">
        <Check className="size-4" aria-hidden="true" />
      </span>
    </IllustrationFrame>
  );
}

function TimeIllustration() {
  return (
    <IllustrationFrame>
      <div className="flex w-full flex-col gap-2">
        <span className="flex h-10 w-[120px] flex-col justify-center gap-1.5 rounded-lg rounded-bl-none border border-home-line bg-home-card px-3">
          <span className="h-1.5 w-14 rounded-full bg-home-line" />
          <span className="h-1.5 w-10 rounded-full bg-home-line" />
        </span>
        <span className="ml-auto flex h-10 w-[130px] flex-col justify-center gap-1.5 rounded-lg rounded-br-none bg-home-accent-soft px-3">
          <span className="h-1.5 w-16 rounded-full bg-home-accent/40" />
          <span className="h-1.5 w-10 rounded-full bg-home-accent/40" />
        </span>
      </div>
      <span className="absolute top-0 right-0 flex size-10 items-center justify-center rounded-full bg-home-panel text-home-panel-accent">
        <Clock className="size-5" aria-hidden="true" />
      </span>
    </IllustrationFrame>
  );
}
