import Image from "next/image";
import { cn } from "@/lib/utils";

interface SupplierLogoProps {
  name: string;
  logoUrl: string | null;
  sizes: string;
  className?: string;
}

export function SupplierLogo({
  name,
  logoUrl,
  sizes,
  className = "size-12 rounded-2xl text-xl",
}: SupplierLogoProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden border border-border bg-muted font-semibold text-muted-foreground",
        className,
      )}
    >
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt=""
          fill
          sizes={sizes}
          className="object-contain p-1"
        />
      ) : (
        <span aria-hidden="true">{initial}</span>
      )}
    </span>
  );
}
