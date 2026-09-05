"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RequestItemsTable } from "@/components/request/RequestItemsTable";
import { RequestSummary } from "@/components/request/RequestSummary";
import { RequestSupplierHeading } from "@/components/request/RequestSupplierHeading";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { formatPositions } from "@/lib/request";
import type { RequestView } from "./request-data";
import { RequestStatusProgress } from "./RequestStatusProgress";
import { SupplierContacts } from "./SupplierContacts";

export function RequestDetailsSheet({
  request,
  closeHref,
}: {
  request: RequestView | undefined;
  closeHref: string;
}) {
  const router = useRouter();
  const returnFocus = useRef<HTMLElement | null>(null);

  return (
    <Sheet
      open={Boolean(request)}
      onOpenChange={(open) => {
        if (!open) router.replace(closeHref, { scroll: false });
      }}
    >
      <SheetContent
        className="w-[800px]! max-w-[800px]! gap-0 overflow-hidden rounded-l-2xl border-l border-border"
        aria-describedby={undefined}
        showCloseButton={false}
        onOpenAutoFocus={() => {
          returnFocus.current =
            document.activeElement instanceof HTMLElement
              ? document.activeElement
              : null;
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          if (returnFocus.current?.isConnected) returnFocus.current.focus();
        }}
      >
        {request && (
          <>
            <SheetHeader className="flex-row items-center justify-between">
              <SheetTitle className="text-lg">
                Заявка №{request.number}
              </SheetTitle>
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Закрыть заявку"
                >
                  <X aria-hidden="true" />
                </Button>
              </SheetClose>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-4">
              <RequestStatusProgress status={request.status} />

              <section className="mt-8 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-[26px] font-medium tracking-[-0.04em] text-foreground">
                    Состав заявки
                  </h2>
                  <Badge variant="secondary">
                    {formatPositions(request.items.length)}
                  </Badge>
                </div>

                <RequestSupplierHeading
                  supplierId={request.supplierId}
                  name={request.supplierName}
                  logoUrl={request.supplierLogoUrl}
                  asLink={false}
                />

                <RequestItemsTable items={request.items} readOnly />
                <SupplierContacts
                  key={request.supplierId}
                  supplierId={request.supplierId}
                />
              </section>
            </div>

            <SheetFooter className="border-t border-border bg-muted p-4">
              <RequestSummary
                total={request.preliminaryTotal}
                currency={request.currency}
                className="border-t-0 pt-0"
              />
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
