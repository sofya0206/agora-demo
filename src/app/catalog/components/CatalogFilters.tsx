"use client";

import { useId } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PILOT_REGIONS, STOCK_STATUSES } from "@/lib/catalog";
import type { Category, Supplier } from "@/types";
import { EMPTY_FILTERS } from "../catalog-params";
import { useCatalogFilters } from "./use-catalog-url";

interface CatalogFiltersProps {
  categories: Category[];
  suppliers: Supplier[];
}

const ANY = "all";

export function CatalogFilterFields({
  categories,
  suppliers,
}: CatalogFiltersProps) {
  const { filters, setFilters } = useCatalogFilters();
  const fieldId = useId();

  const fields = [
    {
      key: "category",
      label: "Категория",
      placeholder: "Все",
      value: filters.category,
      onChange: (value: string) => setFilters({ category: value }),
      options: categories.map((category) => ({
        value: category.slug,
        label: category.name,
      })),
    },
    {
      key: "supplier",
      label: "Поставщик",
      placeholder: "Все",
      value: filters.supplierId,
      onChange: (value: string) => setFilters({ supplierId: value }),
      options: suppliers.map((supplier) => ({
        value: String(supplier.id),
        label: supplier.commercial_name,
      })),
    },
    {
      key: "region",
      label: "Регион доставки",
      placeholder: "Все",
      value: filters.region,
      onChange: (value: string) => setFilters({ region: value }),
      options: PILOT_REGIONS.map((region) => ({
        value: region,
        label: region,
      })),
    },
    {
      key: "stock",
      label: "Наличие",
      placeholder: "Любой статус",
      value: filters.stockStatus,
      onChange: (value: string) => setFilters({ stockStatus: value }),
      options: STOCK_STATUSES.map((status) => ({
        value: status,
        label: status,
      })),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {fields.map((field) => (
        <div key={field.key} className="flex flex-col gap-2">
          <Label htmlFor={`${fieldId}-${field.key}`}>{field.label}</Label>
          <Select
            value={field.value || ANY}
            onValueChange={(value) =>
              field.onChange(value === ANY ? "" : value)
            }
          >
            <SelectTrigger
              id={`${fieldId}-${field.key}`}
              className="min-h-9 w-full"
            >
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>{field.placeholder}</SelectItem>
              {field.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}

export function CatalogFiltersReset({ className }: { className?: string }) {
  const { setFilters } = useCatalogFilters();

  return (
    <Button
      type="button"
      variant="secondary"
      className={className}
      onClick={() => setFilters({ ...EMPTY_FILTERS })}
    >
      <RotateCcw data-icon="inline-start" aria-hidden="true" />
      Сбросить
    </Button>
  );
}

export function CatalogFiltersSidebar({
  categories,
  suppliers,
}: CatalogFiltersProps) {
  return (
    <aside className="hidden h-fit w-[302px] shrink-0 lg:sticky lg:top-24 lg:block">
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-4 shadow-xs">
        <div className="flex items-center gap-4">
          <h2 className="flex-1 text-lg font-semibold text-foreground">
            Фильтры
          </h2>
          <CatalogFiltersReset />
        </div>
        <CatalogFilterFields categories={categories} suppliers={suppliers} />
      </div>
    </aside>
  );
}
