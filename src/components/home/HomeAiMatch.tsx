import { ArrowRight, Check, Package, Sparkles } from "lucide-react";
import { HomeHeading, HomeSection } from "./HomeSection";

const abilities = [
  "Понимает запрос в свободной форме",
  "Помнит уточнения по ходу диалога",
  "Объясняет совпадения и расхождения",
];

const filters = [
  "Гофрокороба",
  "Самосборный",
  "400×300×200 мм",
  "5 000 шт.",
  "Бурый",
  "Москва",
];

const prompts = ["Нужна печать логотипа", "Покажи дешевле", "Сравни топ-3"];

const offers = [
  {
    title: "Гофрокороб 400×300×200 четырёхклапанный Т-23",
    meta: "Поставщик · Гофрокороба · AI-BOX-0201-400",
    match: "87%",
    price: "28,5 ₽/шт.",
    stock: ["MOQ 100", "В наличии", "~ 5 дней"],
    reasons: [
      { ok: true, text: "Размер и цвет подходят" },
      { ok: true, text: "Доставка: Москва и МО" },
      { ok: false, text: "Тип: четырёхклапанный" },
    ],
  },
  {
    title: "Гофрокороб Т-23 400×300×200",
    meta: "Поставщик · Гофрокороба",
    match: "81%",
    price: "84,5 ₽/шт.",
    stock: ["MOQ 100", "В наличии"],
    reasons: [],
  },
];

export function HomeAiMatch() {
  return (
    <HomeSection tone="soft" className="flex flex-col gap-12">
      <HomeHeading
        eyebrow="03 / AI-подбор"
        lines={["Подбор начинается", "с обычного диалога"]}
        lead="Опишите задачу своими словами. AI удерживает контекст, уточняет требования и сразу показывает, почему конкретная позиция подходит или не подходит."
      />

      <ul className="flex flex-col gap-3 lg:-mt-6 lg:ml-auto lg:w-[380px]">
        {abilities.map((ability) => (
          <li
            key={ability}
            className="flex items-center gap-2 text-xs text-home-muted"
          >
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-home-accent-soft text-home-accent">
              <Check className="size-3" aria-hidden="true" />
            </span>
            {ability}
          </li>
        ))}
      </ul>

      <div className="grid overflow-hidden rounded-2xl border border-home-line bg-home-card lg:grid-cols-2">
        <div className="flex flex-col gap-4 border-home-line p-5 lg:border-r">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Диалог</h3>
            <span className="flex items-center gap-1.5 text-[11px] text-home-muted">
              <span
                className="size-1.5 rounded-full bg-home-accent"
                aria-hidden="true"
              />
              Agora AI онлайн
            </span>
          </div>

          <div className="ml-auto max-w-[220px] rounded-lg bg-home-panel px-4 py-3 text-home-panel-text">
            <p className="text-[10px] font-semibold tracking-[0.12em] text-home-panel-muted uppercase">
              Вы
            </p>
            <p className="mt-1 text-sm">Сравни топ-3 позиции</p>
          </div>

          <div className="rounded-lg border border-home-line bg-home-bg p-4">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.12em] text-home-accent uppercase">
              <Sparkles className="size-3" aria-hidden="true" />
              Agora AI
            </p>
            <p className="mt-2 text-sm leading-5 text-home-muted">
              Обновил подбор с учётом вашего запроса. Нашёл точные совпадения и
              несколько близких альтернатив. Справа можно сравнить условия и
              увидеть расхождения.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {prompts.map((prompt) => (
              <span
                key={prompt}
                className="rounded-lg border border-home-line px-3 py-1.5 text-xs text-home-muted"
              >
                {prompt}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <p className="flex-1 rounded-lg border border-home-line px-3 py-3 text-xs text-home-muted">
              Например: самосбор 400×300×200, бурый, 5000 шт., Москва…
            </p>
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-home-accent-fill text-white"
              aria-hidden="true"
            >
              <ArrowRight className="size-4" />
            </span>
          </div>

          <p className="text-[11px] text-home-muted">
            Демонстрация интерфейса — запрос не отправляется на сервер
          </p>
        </div>

        <div className="flex flex-col gap-3 bg-home-bg-soft p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Подборка · 7</h3>
            <span className="text-xs text-home-accent">Сбросить</span>
          </div>

          <div className="rounded-lg border border-home-accent/30 bg-home-accent-surface p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold tracking-[0.12em] text-home-accent uppercase">
                Ищу с учётом
              </p>
              <span className="text-[11px] text-home-muted">6 параметров</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {filters.map((filter) => (
                <span
                  key={filter}
                  className="rounded-md border border-home-line bg-home-card px-2 py-1 text-[11px]"
                >
                  {filter}
                </span>
              ))}
            </div>
          </div>

          {offers.map((offer) => (
            <article
              key={offer.title}
              className="flex flex-col gap-3 rounded-lg border border-home-line bg-home-card p-4"
            >
              <div className="flex gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-home-bg-soft text-home-muted">
                  <Package className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold">{offer.title}</h4>
                  <p className="mt-1 text-[11px] text-home-muted">
                    {offer.meta}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-sm font-semibold">{offer.match}</span>
                  <span className="rounded-md bg-home-accent-soft px-2 py-0.5 text-[10px] text-home-accent">
                    совпадение
                  </span>
                </div>
              </div>

              <p className="flex flex-wrap items-center gap-3 text-[11px] text-home-muted">
                <span className="text-sm font-semibold text-home-text">
                  {offer.price}
                </span>
                {offer.stock.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </p>

              {offer.reasons.length > 0 && (
                <ul className="flex flex-col gap-1 border-t border-home-line pt-3">
                  {offer.reasons.map((reason) => (
                    <li
                      key={reason.text}
                      className={`text-[11px] ${reason.ok ? "text-home-accent" : "text-warning"}`}
                    >
                      {reason.ok ? "✓" : "!"} {reason.text}
                    </li>
                  ))}
                </ul>
              )}

              {offer.reasons.length > 0 && (
                <div className="flex gap-2">
                  <span className="rounded-lg border border-home-line px-3 py-1.5 text-[11px]">
                    В сравнение
                  </span>
                  <span className="rounded-lg border border-home-line px-3 py-1.5 text-[11px]">
                    Похожие дешевле
                  </span>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </HomeSection>
  );
}
