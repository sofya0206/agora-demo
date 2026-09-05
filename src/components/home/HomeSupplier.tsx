import Link from "next/link";
import { ArrowRight, Layers, MessageSquare, TrendingUp } from "lucide-react";
import { HomeSection } from "./HomeSection";

const benefits = [
  {
    icon: TrendingUp,
    title: "Приоритет в выдаче",
    text: "Больше видимости в релевантных категориях и результатах подбора.",
  },
  {
    icon: MessageSquare,
    title: "Доступ к заявкам",
    text: "Получайте структурированные запросы покупателей и отвечайте по существу.",
  },
  {
    icon: Layers,
    title: "Расширенная аналитика",
    text: "Понимайте интерес к профилю и спрос со стороны покупателей.",
  },
];

export function HomeSupplier() {
  return (
    <HomeSection
      tone="mint"
      className="grid gap-12 lg:grid-cols-2 lg:items-center"
    >
      <div className="flex flex-col gap-6">
        <span className="w-fit rounded-md bg-home-accent-soft px-3 py-1.5 text-[11px] font-semibold tracking-[0.12em] text-home-accent uppercase">
          Поставщикам
        </span>

        <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-[40px] sm:leading-[1.15]">
          <span className="block">Получайте не «лиды»,</span>
          <span className="block">
            а <span className="text-home-accent">понятные заявки</span>
          </span>
        </h2>

        <p className="max-w-[440px] text-sm leading-6 text-home-muted">
          Покажите условия заранее и подключайтесь к запросам, которые совпадают
          с вашими возможностями.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/catalog"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-home-panel px-6 text-sm font-medium text-home-panel-text transition-opacity hover:opacity-90"
          >
            Разместить компанию
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <p className="text-xs text-home-muted">
            Тарифы от{" "}
            <span className="font-semibold text-home-text">0 до 6 990 ₽</span> /
            месяц
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-home-line bg-home-card">
        {benefits.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="flex gap-4 border-t border-home-line p-6 first:border-t-0"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-home-accent-soft text-home-accent">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold">{title}</h3>
              <p className="text-sm leading-5 text-home-muted">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </HomeSection>
  );
}
