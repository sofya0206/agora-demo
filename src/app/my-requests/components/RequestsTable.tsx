import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMoney } from "@/lib/catalog";
import { formatRequestDate } from "@/lib/request";
import type { RequestView } from "./request-data";
import { buildRequestsHref } from "./request-url";
import { RequestStatusBadge } from "./RequestStatusBadge";

export function RequestsTable({
  requests,
  searchParams,
}: {
  requests: RequestView[];
  searchParams: URLSearchParams;
}) {
  return (
    <Table className="table-fixed">
      <colgroup>
        <col className="w-[120px]" />
        <col className="w-[416px]" />
        <col className="w-[216px]" />
        <col className="w-[236px]" />
        <col />
        <col />
      </colgroup>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="px-0 text-muted-foreground">№ Заявки</TableHead>
          <TableHead className="text-muted-foreground">Поставщик</TableHead>
          <TableHead className="text-muted-foreground">Дата создания</TableHead>
          <TableHead className="text-muted-foreground">Статус</TableHead>
          <TableHead className="text-muted-foreground">Сумма</TableHead>
          <TableHead>
            <span className="sr-only">Действия</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id} className="h-[84px] hover:bg-transparent">
            <TableCell className="px-0 font-semibold">
              № {request.number}
            </TableCell>
            <TableCell className="overflow-hidden font-semibold text-ellipsis">
              {request.supplierName}
            </TableCell>
            <TableCell>{formatRequestDate(request.createdAt)}</TableCell>
            <TableCell>
              <RequestStatusBadge status={request.status} />
            </TableCell>
            <TableCell className="font-semibold">
              {formatMoney(request.preliminaryTotal, request.currency)}
            </TableCell>
            <TableCell className="text-right">
              <Button asChild size="icon-lg">
                <Link
                  href={buildRequestsHref(searchParams, {
                    requestNumber: request.number,
                  })}
                  aria-label={`Открыть заявку №${request.number}`}
                  scroll={false}
                  data-request-number={request.number}
                >
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
