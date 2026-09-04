import type { RequestStatus } from "@/types";

export type StepState = "done" | "active" | "pending" | "rejected";

const statusIndex: Record<RequestStatus, number> = {
  sent: 0,
  viewed: 1,
  discussion: 2,
  confirmed: 3,
  rejected: 3,
};

/* Только отображение состояний из Figma, не правила переходов на бэкенде. */
export function getRequestStepStates(status: RequestStatus): StepState[] {
  const currentIndex = statusIndex[status];

  return Array.from({ length: 4 }, (_, index) => {
    if (status === "rejected" && index === 3) return "rejected";
    if (index < currentIndex || status === "confirmed") return "done";
    if (index > currentIndex) return "pending";
    return status === "sent" ? "done" : "active";
  });
}
