import { ClipboardCheck, Search, Zap } from "lucide-react";
import { HomeEyebrow } from "./HomeEyebrow";

const FEATURES = [
  {
    icon: Search,
    title: "Умный поиск",
    text: "Алгоритм на основе ИИ подбирает оптимальных поставщиков с учётом MOQ, локации и цены.",
  },
  {
    icon: ClipboardCheck,
    title: "Единая заявка",
    text: "Создавайте один запрос, который увидят сотни поставщиков. Сравнивайте предложения и условия.",
  },
  {
    icon: Zap,
    title: "Мгновенные ответы",
    text: "Получайте коммерческие предложения за часы, а не дни. Среднее время ответа — менее 2 часов.",
  },
];

const NUMBERS = [
  {
    value: "99.9%",
    label: "Время работы",
    caption: "Корпоративная надёжность",
  },
  { value: "< 2 ч", label: "Среднее время ответа", caption: "От поставщиков" },
  {
    value: "50 000+",
    label: "Обработанных заявок",
    caption: "И это только начало",
  },
];

export function HomeFeatures() {
  return (
    <section className="flex flex-col items-center gap-3.5 py-24 lg:py-[176px]">
      <HomeEyebrow>Почему Агора</HomeEyebrow>
      <h2 className="max-w-[720px] text-center text-3xl font-extrabold tracking-[-0.026em] text-foreground lg:text-[38px] lg:leading-[1.1]">
        Доверьтесь нам — мы всё сделаем за вас
      </h2>
      <p className="max-w-[540px] text-center leading-5 text-muted-foreground lg:text-[17px]">
        Всё необходимое для быстрого поиска поставщиков упаковки.
      </p>

      <div className="grid w-full gap-5 pt-[34px] md:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <article
            key={title}
            className="flex flex-col rounded-xl border border-border bg-background px-[26px] pt-[28px] pb-[27px] shadow-sm"
          >
            <span className="flex size-[50px] items-center justify-center rounded-lg border border-border bg-muted">
              <Icon
                className="size-[22px] text-foreground"
                aria-hidden="true"
              />
            </span>
            <h3 className="mt-[18px] text-[19px] leading-5 font-bold text-foreground">
              {title}
            </h3>
            <p className="mt-[9px] text-sm leading-[22.48px] text-muted-foreground">
              {text}
            </p>
          </article>
        ))}
      </div>

      <div className="grid w-full gap-5 pt-[38px] md:grid-cols-3">
        {NUMBERS.map(({ value, label, caption }) => (
          <div
            key={label}
            className="flex flex-col items-center rounded-xl border border-border bg-background px-7 py-[30px] text-center shadow-sm"
          >
            <p className="font-mono text-[34px] leading-[1.05] font-extrabold lg:text-[42px] tracking-[-0.036em] text-foreground">
              {value}
            </p>
            <p className="pt-1.5 text-sm font-semibold text-foreground">
              {label}
            </p>
            <p className="pt-1 text-[13px] text-muted-foreground">{caption}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
