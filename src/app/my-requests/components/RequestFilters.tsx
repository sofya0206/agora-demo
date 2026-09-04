import Link from "next/link";
import { cn } from "@/lib/utils";
import { buildRequestsHref, type RequestFilter } from "./request-url";

const filters: { value: RequestFilter; label: string }[] = [
  { value: "all", label: "Все заявки" },
  { value: "sent", label: "КП отправлено" },
  { value: "viewed", label: "Просмотр" },
  { value: "discussion", label: "Обсуждение" },
  { value: "confirmed", label: "Подтверждено" },
  { value: "rejected", label: "Отклонено" },
];

export function RequestFilters({
  value,
  searchParams,
}: {
  value: RequestFilter;
  searchParams: URLSearchParams;
}) {
  return (
    <nav
      aria-label="Фильтр заявок по статусу"
      className="inline-flex w-fit items-center rounded-xl bg-muted p-1"
    >
      {filters.map((filter) => (
        <Link
          key={filter.value}
          href={buildRequestsHref(searchParams, { filter: filter.value })}
          scroll={false}
          aria-current={filter.value === value ? "page" : undefined}
          className={cn(
            "flex min-h-8 items-center rounded-lg px-2.5 text-sm font-medium whitespace-nowrap text-foreground transition-colors hover:bg-background/60",
            filter.value === value && "bg-background shadow-sm",
          )}
        >
          {filter.label}
        </Link>
      ))}
    </nav>
  );
}
