import { HomeHeading, HomeSection } from "./HomeSection";

const points = [
  {
    number: "01",
    title: "Условия до контакта",
    text: "Ключевые параметры видны в карточке поставщика, а не выясняются по цепочке писем.",
  },
  {
    number: "02",
    title: "Релевантность вместо охвата",
    text: "Запрос получают поставщики, для которых ваш объём, категория и регион действительно подходят.",
  },
  {
    number: "03",
    title: "Единая логика сравнения",
    text: "Структура карточек и заявок помогает принимать решение по сопоставимым данным.",
  },
];

export function HomeBuyer() {
  return (
    <HomeSection
      tone="panel"
      className="grid gap-12 lg:grid-cols-2 lg:items-start"
    >
      <HomeHeading
        tone="panel"
        eyebrow="04 / Для покупателя"
        lines={[
          "Не «ещё один список компаний», а",
          "короткий путь к тем, кто подходит.",
        ]}
      />

      <ul className="flex flex-col">
        {points.map((point) => (
          <li
            key={point.number}
            className="flex gap-6 border-t border-home-panel-line py-6 first:border-t-0 first:pt-0"
          >
            <span className="text-[11px] font-semibold tracking-[0.12em] text-home-panel-muted">
              {point.number}
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="text-base font-semibold">{point.title}</h3>
              <p className="text-sm leading-5 text-home-panel-muted">
                {point.text}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </HomeSection>
  );
}
