import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 xl:px-20">
        <Link href="/" className="flex items-center gap-4">
          <span className="flex size-11 items-center justify-center rounded-[10px] bg-primary text-xl font-extrabold text-primary-foreground">
            А
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-muted-foreground">
              Агора
            </span>
            <span className="text-sm text-muted-foreground">
              B2B-платформа упаковки
            </span>
          </span>
        </Link>

        <p className="text-sm text-muted-foreground">
          Доверяют командам закупок по всему миру
        </p>
      </div>

      <div className="border-t border-border px-7 py-4 text-center text-xs text-muted-foreground">
        © 2026 Агора. Все права защищены.
      </div>
    </footer>
  );
}
