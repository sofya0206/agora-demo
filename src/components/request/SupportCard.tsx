import { Mail, Phone } from "lucide-react";
import {
  SUPPORT_EMAIL,
  SUPPORT_EMAIL_NOTE,
  SUPPORT_PHONE,
  SUPPORT_PHONE_NOTE,
} from "@/lib/site";
import { cn } from "@/lib/utils";

interface SupportCardProps {
  className?: string;
}

/* «Нужна помощь?» — общий блок для экрана успеха и списка заявок. */
export function SupportCard({ className }: SupportCardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-background p-6",
        className,
      )}
    >
      <h2 className="text-2xl font-medium tracking-[-0.04em] text-foreground sm:text-[26px]">
        Нужна помощь?
      </h2>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
            <Phone className="size-5" aria-hidden="true" />
          </span>
          <div className="flex min-w-0 flex-col">
            <a
              href={`tel:${SUPPORT_PHONE.replace(/[^\d+]/g, "")}`}
              className="text-lg font-semibold text-foreground hover:underline"
            >
              {SUPPORT_PHONE}
            </a>
            <span className="text-sm text-muted-foreground">
              {SUPPORT_PHONE_NOTE}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
            <Mail className="size-5" aria-hidden="true" />
          </span>
          <div className="flex min-w-0 flex-col">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="truncate text-lg font-semibold text-foreground hover:underline"
            >
              {SUPPORT_EMAIL}
            </a>
            <span className="text-sm text-muted-foreground">
              {SUPPORT_EMAIL_NOTE}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
