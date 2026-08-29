"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { CatalogFilters } from "@/types";
import {
  applyFilterPatch,
  readCatalogFilters,
  writeCatalogFilters,
} from "../catalog-params";

export function useCatalogFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => readCatalogFilters(Object.fromEntries(searchParams.entries())),
    [searchParams],
  );

  const buildHref = useCallback(
    (patch: Partial<CatalogFilters>) => {
      const query = writeCatalogFilters(applyFilterPatch(filters, patch));
      return query ? `${pathname}?${query}` : pathname;
    },
    [filters, pathname],
  );

  const setFilters = useCallback(
    (patch: Partial<CatalogFilters>) => {
      router.push(buildHref(patch), { scroll: false });
    },
    [buildHref, router],
  );

  return { filters, setFilters, buildHref };
}
