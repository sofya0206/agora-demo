"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SupportCard } from "@/components/request/SupportCard";
import { useSubmittedRequests } from "@/hooks/use-submitted-requests";
import {
  buildRequestsHref,
  readRequestFilter,
  readRequestNumber,
} from "./request-url";
import { RequestDetailsSheet } from "./RequestDetailsSheet";
import { RequestFilters } from "./RequestFilters";
import { RequestsTable } from "./RequestsTable";
import { readRequests } from "./request-data";

export function MyRequestsView() {
  const searchParams = useSearchParams();
  const filter = readRequestFilter(searchParams.get("status"));
  const requestNumber = readRequestNumber(searchParams.get("request"));
  const { requests: storedRequests } = useSubmittedRequests();
  const requests = useMemo(
    () => readRequests(storedRequests),
    [storedRequests],
  );

  const visibleRequests = useMemo(
    () =>
      filter === "all"
        ? requests
        : requests.filter((request) => request.status === filter),
    [filter, requests],
  );

  const selectedRequest =
    requestNumber !== null
      ? requests.find((request) => request.number === requestNumber)
      : undefined;

  return (
    <>
      <section className="rounded-2xl border border-border bg-background p-6 shadow-xs">
        <RequestFilters value={filter} searchParams={searchParams} />
        <div className="mt-6">
          <RequestsTable
            requests={visibleRequests}
            searchParams={searchParams}
          />
        </div>
      </section>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <section className="min-h-[277px] rounded-2xl border border-border bg-background p-6 shadow-xs">
          <h2 className="text-[26px] font-medium tracking-[-0.04em] text-foreground">
            Как это работает?
          </h2>
          <p className="mt-6 text-lg font-medium text-muted-foreground">
            Мы передаём вашу заявку поставщику. После проверки поставщик или
            менеджер свяжется с вами напрямую для уточнения деталей и выставит
            коммерческое предложение.
          </p>
        </section>
        <SupportCard className="min-h-[277px] shadow-xs [&>div]:grid-cols-1 [&>div]:gap-2" />
      </div>

      <RequestDetailsSheet
        request={selectedRequest}
        closeHref={buildRequestsHref(searchParams, { requestNumber: null })}
      />
    </>
  );
}
