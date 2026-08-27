"use client";

import { ArrowDownNarrowWide } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CatalogSort } from "@/types";
import { SORT_OPTIONS } from "../catalog-params";
import { useCatalogFilters } from "./use-catalog-url";

export function SortMenu() {
  const { filters, setFilters } = useCatalogFilters();
  const current = SORT_OPTIONS.find((option) => option.value === filters.sort) ?? SORT_OPTIONS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="secondary" size="sm" className="text-sm">
          <ArrowDownNarrowWide data-icon="inline-start" aria-hidden="true" />
          {current.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={filters.sort}
          onValueChange={(value) => setFilters({ sort: value as CatalogSort })}
        >
          {SORT_OPTIONS.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
