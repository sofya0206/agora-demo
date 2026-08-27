import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { RequestCounter } from "./RequestCounter";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-4 px-7 py-3.5">
        <Link href="/" className="flex items-center gap-4">
          <span className="flex size-11 items-center justify-center rounded-[10px] bg-primary text-xl font-extrabold text-primary-foreground">
            А
          </span>
          <span className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-foreground">Агора</span>
            <span className="hidden text-xs text-muted-foreground sm:block">
              B2B-платформа упаковки
            </span>
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-2.5" aria-label="Основная навигация">
          <Link
            href="/catalog"
            className="inline-flex h-9 items-center gap-2 rounded-[10px] px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <LayoutGrid className="size-4" aria-hidden="true" />
            Каталог
          </Link>
          <RequestCounter />
        </nav>
      </div>
    </header>
  );
}
