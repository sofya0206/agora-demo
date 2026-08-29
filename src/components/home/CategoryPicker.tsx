"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface CategoryPickerProps {
  categories: Category[];
}

export function CategoryPicker({ categories }: CategoryPickerProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(slug: string, checked: boolean) {
    setSelected((current) =>
      checked ? [...current, slug] : current.filter((item) => item !== slug),
    );
  }

  function goToFinder() {
    const query =
      selected.length > 0
        ? `?categories=${selected.map(encodeURIComponent).join(",")}`
        : "";
    router.push(`/find-supplier${query}`);
  }

  return (
    <div className="w-full max-w-[900px] rounded-xl border border-border bg-background shadow-sm">
      <div className="flex flex-col gap-1 px-5 py-7 sm:px-[30px]">
        <p className="text-xs font-semibold text-muted-foreground">
          Шаг 1 из 3
        </p>
        <h3 className="pt-1 text-[22px] leading-5 font-bold tracking-[-0.01em] text-foreground">
          Какая упаковка нужна?
        </h3>
        <p className="text-sm text-muted-foreground">
          Можно выбрать несколько категорий.
        </p>

        <div className="grid grid-cols-1 gap-3 pt-4 pb-[18px] sm:grid-cols-2">
          {categories.map((category) => {
            const checked = selected.includes(category.slug);
            return (
              <label
                key={category.slug}
                className={cn(
                  "flex cursor-pointer items-center gap-[11px] rounded-lg border border-border px-4 py-[13.5px] text-sm leading-5 text-foreground transition-colors",
                  checked
                    ? "border-primary bg-muted"
                    : "bg-background hover:bg-muted",
                )}
              >
                <Checkbox
                  className="rounded-full"
                  checked={checked}
                  onCheckedChange={(value) =>
                    toggle(category.slug, value === true)
                  }
                />
                {category.name}
              </label>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-5">
          <Button variant="outline" className="h-9 px-4" disabled>
            Назад
          </Button>
          <Button className="h-9 gap-2 px-4" onClick={goToFinder}>
            Продолжить
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
