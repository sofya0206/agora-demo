import { Badge } from "@/components/ui/badge";
import { REQUEST_STATUS_LABELS } from "@/lib/request";
import { cn } from "@/lib/utils";
import type { RequestStatus } from "@/types";

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  return (
    <Badge
      variant={status === "rejected" ? "destructive" : "secondary"}
      className={cn(status === "confirmed" && "bg-success/10 text-success")}
    >
      {REQUEST_STATUS_LABELS[status]}
    </Badge>
  );
}
