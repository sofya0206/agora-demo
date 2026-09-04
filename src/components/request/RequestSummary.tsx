import { formatMoney } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import type { Currency } from "@/types";
import { RequestNotice } from "./RequestNotice";

interface RequestSummaryProps {
  total: number;
  currency?: Currency;
  /* Когда поставщиков несколько, сумма своя у каждого, а оговорка одна на карточку. */
  showNote?: boolean;
  className?: string;
}

/* Предварительная сумма с оговоркой — одинаковая в оформлении и в карточке заявки. */
export function RequestSummary({
  total,
  currency = "RUB",
  showNote = true,
  className,
}: RequestSummaryProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 border-t border-border pt-6",
        className,
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-2xl font-medium tracking-[-0.04em] text-foreground sm:text-[26px]">
          Предварительная сумма
        </h3>
        <p className="text-2xl font-medium tracking-[-0.04em] text-foreground sm:text-[26px]">
          {formatMoney(total, currency)}
        </p>
      </div>

      {showNote && (
        <RequestNotice>
          Итоговая сумма предварительная. Финальную цену подтвердит поставщик
          после обработки заявки
        </RequestNotice>
      )}
    </div>
  );
}
