"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Category, Supplier } from "@/types";
import { CatalogFilterFields, CatalogFiltersReset } from "./CatalogFilters";

interface FiltersSheetProps {
  categories: Category[];
  suppliers: Supplier[];
  activeCount: number;
}

export function FiltersSheet({ categories, suppliers, activeCount }: FiltersSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button type="button" variant="secondary" size="lg" className="lg:hidden">
          <SlidersHorizontal data-icon="inline-start" aria-hidden="true" />
          Фильтры
          {activeCount > 0 && <span aria-hidden="true">({activeCount})</span>}
          <span className="sr-only">, активных фильтров: {activeCount}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-[340px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">Фильтры</SheetTitle>
          <SheetDescription>Уточните выдачу каталога</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4 pb-4">
          <CatalogFilterFields categories={categories} suppliers={suppliers} />
          <CatalogFiltersReset className="w-full" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
