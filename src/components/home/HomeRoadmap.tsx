import { Check, Layers, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { HomeHeading, HomeSection } from "./HomeSection";

const stages = [
  {
    badge: "Сейчас",
    icon: Sparkles,
    title: "AI-подбор поставщика",
    text: "Узкий MVP-клин: каталог → условия → заявка → ответ.",
    current: true,
  },
  {
    badge: "Дальше",
    icon: Check,
    title: "Верификация",
    text: "Дополнительные сигналы доверия и качества поставщиков.",
    current: false,
  },
  {
    badge: "Видение",
    icon: Layers,
    title: "Коллективные лоты",
    text: "Объединение спроса и новые условия закупки для участников.",
    current: false,
  },
];

export function HomeRoadmap() {
  return (
    <HomeSection tone="soft" className="flex flex-col gap-12">
      <HomeHeading
        align="center"
        eyebrow="05 / Развитие"
        lines={["Сегодня — точный подбор.", "Завтра — инфраструктура рынка."]}
      />

      <div className="grid overflow-hidden rounded-2xl border border-home-line bg-home-card md:grid-cols-3">
        {stages.map(({ badge, icon: Icon, title, text, current }) => (
          <article
            key={badge}
            className={cn(
              "flex min-h-[200px] flex-col gap-6 border-t border-home-line p-6 md:border-t-0 md:border-l md:first:border-l-0",
              current && "border-home-panel bg-home-panel text-home-panel-text",
            )}
          >
            <span
              className={cn(
                "w-fit rounded-full border px-3 py-1 text-[10px] font-semibold tracking-[0.12em] uppercase",
                current
                  ? "border-home-panel-accent/40 text-home-panel-accent"
                  : "border-home-line text-home-muted",
              )}
            >
              {badge}
            </span>

            <Icon
              className={cn(
                "size-5",
                current ? "text-home-panel-accent" : "text-home-text",
              )}
              aria-hidden="true"
            />

            <div className="mt-auto flex flex-col gap-2">
              <h3 className="text-base font-semibold">{title}</h3>
              <p
                className={cn(
                  "text-sm leading-5",
                  current ? "text-home-panel-muted" : "text-home-muted",
                )}
              >
                {text}
              </p>
            </div>
          </article>
        ))}
      </div>
    </HomeSection>
  );
}
