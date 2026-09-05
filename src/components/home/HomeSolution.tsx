import { Check, Layers, MessageSquare, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { HomeHeading, HomeSection } from "./HomeSection";

const steps = [
  {
    number: "01",
    icon: Sparkles,
    title: "Опишите задачу",
    text: "В свободной форме: что нужно, сколько, куда и к какому сроку.",
    badge: "AI-точка входа",
  },
  {
    number: "02",
    icon: Layers,
    title: "Сравните условия",
    text: "Откройте карточки и проверьте MOQ, сроки, географию и возможности.",
  },
  {
    number: "03",
    icon: MessageSquare,
    title: "Отправьте заявку",
    text: "Поставщик получает уже квалифицированный запрос с нужными параметрами.",
  },
  {
    number: "04",
    icon: Check,
    title: "Получите ответ",
    text: "Обсудите детали с теми, кто действительно может выполнить заказ.",
  },
];

export function HomeSolution() {
  return (
    <HomeSection tone="panel" className="flex flex-col gap-12">
      <HomeHeading
        tone="panel"
        eyebrow="02 / Решение"
        lines={["От задачи", "до ответа —", "по шагам"]}
        lead="AI помогает начать, а структурированный каталог даёт проверить детали. Вы контролируете выбор на каждом этапе."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(({ number, icon: Icon, title, text, badge }) => (
          <article
            key={number}
            className={cn(
              "flex min-h-[230px] flex-col rounded-2xl border p-5",
              badge
                ? "border-home-accent bg-home-accent-fill text-white"
                : "border-home-panel-line bg-home-panel-card text-home-panel-text",
            )}
          >
            <div className="flex items-start justify-between">
              <span
                className={cn(
                  "text-[11px] font-semibold tracking-[0.12em]",
                  badge ? "text-white/70" : "text-home-panel-muted",
                )}
              >
                {number}
              </span>
              <Icon className="size-4" aria-hidden="true" />
            </div>

            <div className="mt-auto flex flex-col gap-2">
              <h3 className="text-base font-semibold">{title}</h3>
              <p
                className={cn(
                  "text-sm leading-5",
                  badge ? "text-white/80" : "text-home-panel-muted",
                )}
              >
                {text}
              </p>
              {badge && (
                <span className="mt-2 w-fit rounded-md bg-white/15 px-2 py-1 text-[10px] font-semibold tracking-[0.12em] text-white uppercase">
                  {badge}
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </HomeSection>
  );
}
