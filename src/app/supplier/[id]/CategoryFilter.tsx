"use client";

import { useId } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OfferCategory } from "@/types";

const ANY = "all";

interface CategoryFilterProps {
  categories: OfferCategory[];
  value: string;
}

export function CategoryFilter({ categories, value }: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fieldId = useId();

  function handleChange(next: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (next === ANY) {
      params.delete("category");
    } else {
      params.set("category", next);
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <div className="flex w-full max-w-[300px] flex-col gap-2">
      <Label htmlFor={fieldId}>Категория</Label>
      <Select value={value || ANY} onValueChange={handleChange}>
        <SelectTrigger id={fieldId} className="min-h-9 w-full">
          <SelectValue placeholder="Все" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>Все</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.slug} value={category.slug}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
