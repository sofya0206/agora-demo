import { Check, ClipboardClock, Eye, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { REQUEST_STATUS_LABELS } from "@/lib/request";
import type { RequestStatus } from "@/types";
import { getRequestStepStates } from "./request-status";

const steps = [
  { status: "sent", label: "КП отправлено", icon: Check },
  { status: "viewed", label: "Просмотр", icon: Eye },
  { status: "discussion", label: "Обсуждение", icon: ClipboardClock },
  { status: "confirmed", label: "Подтверждено", icon: Check },
] as const;

export function RequestStatusProgress({ status }: { status: RequestStatus }) {
  const states = getRequestStepStates(status);

  return (
    <div className="relative w-[496px]" aria-label="Статус заявки">
      {["left-10", "left-[168px]", "left-[296px]"].map((left) => (
        <div
          key={left}
          className={cn("absolute top-5 h-0.5 w-[88px] bg-foreground", left)}
          aria-hidden="true"
        />
      ))}
      <ol className="relative grid grid-cols-4 gap-4">
        {steps.map((step, index) => {
          const state = states[index];
          const rejected = state === "rejected";
          const current =
            state === "active" ||
            (status === "sent" && index === 0) ||
            ((status === "confirmed" || status === "rejected") && index === 3);
          const Icon = rejected ? X : state === "done" ? Check : step.icon;

          return (
            <li
              key={step.status}
              className="flex w-28 flex-col gap-2"
              data-step-state={state}
              aria-current={current ? "step" : undefined}
            >
              <span
                className={cn(
                  "flex size-10 items-center justify-center rounded-full bg-muted text-foreground",
                  state === "done" && "bg-success text-background",
                  state === "active" &&
                    "ring-2 ring-warning ring-offset-2 ring-offset-popover",
                  rejected && "bg-destructive text-background",
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                {rejected ? "Отклонено" : step.label}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="sr-only">Текущий статус: {REQUEST_STATUS_LABELS[status]}</p>
    </div>
  );
}
