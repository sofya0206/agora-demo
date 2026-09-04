"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, ShoppingCart, Store, User } from "lucide-react";
import { toast } from "sonner";
import { useRequest } from "@/hooks/use-request";
import { AUTH_STUB_MESSAGE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const itemClassName =
  "inline-flex h-8 items-center gap-2 rounded-lg px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted";

const links = [
  { href: "/catalog", label: "Каталог", icon: Store },
  { href: "/request", label: "Заявки", icon: ShoppingCart },
  { href: "/my-requests", label: "Мои заявки", icon: ClipboardList },
];

export function MainNav() {
  const pathname = usePathname();
  const { items } = useRequest();

  return (
    <nav
      className="ml-auto flex items-center gap-2"
      aria-label="Основная навигация"
    >
      <div className="flex items-center gap-2">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                itemClassName,
                "relative",
                isActive && "bg-secondary",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">{label}</span>
              {href === "/request" && items.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                  {items.length}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Авторизации пока нет ни в коде, ни в макетах — пункт есть, но ведёт в заглушку. */}
      <button
        type="button"
        className={cn(itemClassName, "sm:ml-4 lg:ml-8")}
        onClick={() => toast(AUTH_STUB_MESSAGE)}
      >
        <User className="size-4" aria-hidden="true" />
        {/* Самая длинная подпись — прячем раньше остальных, чтобы шапка не переносилась. */}
        <span className="hidden lg:inline">Вход и регистрация</span>
      </button>

      <ThemeToggle className="sm:ml-4 lg:ml-8" />
    </nav>
  );
}
