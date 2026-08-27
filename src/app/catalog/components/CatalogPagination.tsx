import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import type { CatalogFilters } from "@/types";
import { applyFilterPatch, writeCatalogFilters } from "../catalog-params";

interface CatalogPaginationProps {
  filters: CatalogFilters;
  currentPage: number;
  totalPages: number;
}

type PageSlot = { kind: "page"; page: number } | { kind: "gap"; page: number };

function pageSlots(currentPage: number, totalPages: number): PageSlot[] {
  const shown = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  if (currentPage <= 3) [2, 3].forEach((page) => shown.add(page));
  if (currentPage >= totalPages - 2)
    [totalPages - 1, totalPages - 2].forEach((page) => shown.add(page));

  const pages = [...shown]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((first, second) => first - second);

  return pages.flatMap<PageSlot>((page, index) =>
    index > 0 && page - pages[index - 1] > 1
      ? [
          { kind: "gap", page },
          { kind: "page", page },
        ]
      : [{ kind: "page", page }],
  );
}

export function CatalogPagination({ filters, currentPage, totalPages }: CatalogPaginationProps) {
  if (totalPages <= 1) return null;

  const hrefFor = (page: number) => {
    const query = writeCatalogFilters(applyFilterPatch(filters, { page }));
    return query ? `/catalog?${query}` : "/catalog";
  };

  return (
    <Pagination className="w-full justify-end">
      <PaginationContent className="flex-wrap gap-2">
        <PaginationItem>
          {currentPage > 1 ? (
            <Button asChild variant="secondary">
              <Link href={hrefFor(currentPage - 1)} scroll={false} aria-label="Предыдущая страница">
                Назад
              </Link>
            </Button>
          ) : (
            <Button variant="secondary" disabled aria-label="Предыдущая страница">
              Назад
            </Button>
          )}
        </PaginationItem>

        {pageSlots(currentPage, totalPages).map((slot) =>
          slot.kind === "gap" ? (
            <PaginationItem key={`gap-${slot.page}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={slot.page}>
              <Button
                asChild
                variant={slot.page === currentPage ? "outline" : "ghost"}
                size="icon"
                className="min-w-8"
              >
                <Link
                  href={hrefFor(slot.page)}
                  scroll={false}
                  aria-current={slot.page === currentPage ? "page" : undefined}
                  aria-label={`Страница ${slot.page}`}
                >
                  {slot.page}
                </Link>
              </Button>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          {currentPage < totalPages ? (
            <Button asChild variant="secondary">
              <Link href={hrefFor(currentPage + 1)} scroll={false} aria-label="Следующая страница">
                Вперёд
              </Link>
            </Button>
          ) : (
            <Button variant="secondary" disabled aria-label="Следующая страница">
              Вперёд
            </Button>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
