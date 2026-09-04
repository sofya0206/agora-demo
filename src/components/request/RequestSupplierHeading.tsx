import Link from "next/link";
import { SupplierLogo } from "@/components/SupplierLogo";

interface RequestSupplierHeadingProps {
  supplierId: number;
  name: string;
  logoUrl?: string | null;
  /* В диалоге заявки шапка поставщика не ведёт на его страницу. */
  asLink?: boolean;
}

export function RequestSupplierHeading({
  supplierId,
  name,
  logoUrl = null,
  asLink = true,
}: RequestSupplierHeadingProps) {
  return (
    <div className="flex items-center gap-3">
      <SupplierLogo
        name={name}
        logoUrl={logoUrl}
        sizes="40px"
        className="size-10 rounded-lg text-base"
      />
      <div className="flex min-w-0 flex-col">
        <span className="text-sm text-muted-foreground">Поставщик</span>
        {asLink ? (
          <Link
            href={`/supplier/${supplierId}`}
            className="truncate text-lg font-semibold text-foreground hover:underline"
          >
            {name}
          </Link>
        ) : (
          <span className="truncate text-lg font-semibold text-foreground">
            {name}
          </span>
        )}
      </div>
    </div>
  );
}
