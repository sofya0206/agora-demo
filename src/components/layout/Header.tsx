import Link from "next/link";
import { MainNav } from "./MainNav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex min-h-[90px] w-full max-w-[1440px] flex-wrap items-center gap-4 px-5 py-4 sm:px-8 xl:px-20">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-10 items-center justify-center rounded-[10px] bg-primary text-lg font-extrabold text-primary-foreground">
            А
          </span>
          <span className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-foreground">
              Агора
            </span>
            <span className="hidden text-sm text-muted-foreground sm:block">
              B2B-платформа упаковки
            </span>
          </span>
        </Link>

        <MainNav />
      </div>
    </header>
  );
}
