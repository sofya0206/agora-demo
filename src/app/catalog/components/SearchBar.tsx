"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCatalogFilters } from "./use-catalog-url";

export function SearchBar() {
  const { filters, setFilters } = useCatalogFilters();
  const [committed, setCommitted] = useState(filters.search);
  const [value, setValue] = useState(filters.search);

  if (filters.search !== committed) {
    setCommitted(filters.search);
    setValue(filters.search);
  }

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        setFilters({ search: value.trim() });
      }}
    >
      <Label htmlFor="catalog-search" className="sr-only">
        Поиск по каталогу
      </Label>
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          id="catalog-search"
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Поиск"
          className="h-9 pl-8"
        />
      </div>
      <Button type="submit" size="lg">
        Поиск
      </Button>
    </form>
  );
}
