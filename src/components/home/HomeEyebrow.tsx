import { cn } from "@/lib/utils";

export function HomeEyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-xs leading-5 font-bold tracking-[0.14em] uppercase text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}
