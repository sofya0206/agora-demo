import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HomeSection } from "./HomeSection";

const questions = [
  {
    number: "01",
    question: "Что именно делает AI-подбор?",
    answer:
      "Он переводит вашу задачу в структурированные параметры — тип упаковки, тираж, сроки, географию и особые требования — и находит поставщиков, чьи условия подходят под запрос.",
  },
  {
    number: "02",
    question: "Агора продаёт упаковку сама?",
    answer:
      "Нет. Агора сводит покупателя с поставщиками: показывает условия, передаёт заявку и помогает сравнить предложения. Договор и поставка остаются между вами и поставщиком.",
  },
  {
    number: "03",
    question: "Можно ли просто посмотреть каталог?",
    answer:
      "Да. Каталог открыт: можно смотреть предложения, фильтровать по категории, региону и наличию, заходить в карточки поставщиков — заявку оставлять необязательно.",
  },
  {
    number: "04",
    question: "Сколько стоит размещение для поставщика?",
    answer:
      "Тарифы от 0 до 6 990 ₽ в месяц. Бесплатный вариант даёт профиль в каталоге, платные — приоритет в выдаче, доступ к заявкам и расширенную аналитику.",
  },
];

export function HomeFaq() {
  return (
    <HomeSection
      tone="light"
      className="grid gap-12 lg:grid-cols-[380px_minmax(0,1fr)]"
    >
      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold tracking-[0.12em] text-home-muted uppercase">
          06 / Вопросы
        </p>
        <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-[40px] sm:leading-[1.15]">
          <span className="block">Всё важное</span>
          <span className="block text-home-accent">до старта</span>
        </h2>
        <p className="text-sm leading-6 text-home-muted">
          Не нашли ответ? Оставьте заявку — команда Агоры уточнит детали.
        </p>
      </div>

      <Accordion type="single" collapsible defaultValue="01" className="w-full">
        {questions.map(({ number, question, answer }) => (
          <AccordionItem
            key={number}
            value={number}
            className="border-home-line"
          >
            <AccordionTrigger className="gap-4 text-left">
              <span className="text-[11px] font-semibold tracking-[0.12em] text-home-muted">
                {number}
              </span>
              <span className="flex-1 text-base font-semibold">{question}</span>
            </AccordionTrigger>
            <AccordionContent className="pl-10 text-sm leading-5 text-home-muted">
              {answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </HomeSection>
  );
}
