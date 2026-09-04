"use client";

import Link from "next/link";
import {
  ClipboardCheck,
  FileText,
  PackageCheck,
  PhoneCall,
} from "lucide-react";
import { SupportCard } from "@/components/request/SupportCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useSubmittedRequests } from "@/hooks/use-submitted-requests";
import { formatRequestNumbers } from "@/lib/request";

interface RequestSentViewProps {
  numbers: number[];
}

const steps = [
  {
    icon: ClipboardCheck,
    title: "1. Проверка заявки",
    text: "Мы проверим состав и передадим её поставщику",
  },
  {
    icon: PhoneCall,
    title: "2. Связь с вами",
    text: "Поставщик или менеджер свяжется с вами для уточнения деталей",
  },
  {
    icon: FileText,
    title: "3. Коммерческое предложение",
    text: "Вы получите коммерческое предложение или звонок от менеджера",
  },
];

export function RequestSentView({ numbers }: RequestSentViewProps) {
  const { requests } = useSubmittedRequests();
  const sent = numbers
    .map((number) => requests.find((request) => request.number === number))
    .filter((request) => request !== undefined);

  const single = sent.length === 1 ? sent[0] : undefined;
  const heading = numbers.length
    ? `${numbers.length > 1 ? "Заявки" : "Заявка"} ${formatRequestNumbers(numbers)} ${
        numbers.length > 1 ? "отправлены" : "отправлена"
      }`
    : "Заявка отправлена";

  return (
    <div className="mx-auto w-full max-w-[1440px] px-5 pb-20 sm:px-8 xl:px-20">
      <Breadcrumb className="py-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/catalog">Каталог</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {single
                ? `Поставщик ${single.supplierName}`
                : "Заявка отправлена"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-6 rounded-2xl border border-border bg-background p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-start gap-4">
            <h1 className="text-2xl font-medium tracking-[-0.04em] text-success sm:text-[26px]">
              {heading}
            </h1>
            <p className="max-w-[970px] text-sm font-medium text-muted-foreground">
              Мы проверим заявку и скоро свяжемся с вами. Пока заявка
              обрабатывается, вы можете посмотреть других поставщиков и
              сформировать ещё одну заявку
            </p>
            <Button asChild size="lg" className="mt-4">
              <Link href="/catalog">Перейти в Каталог</Link>
            </Button>
          </div>

          {/* Слот под иллюстрацию: Екатерина отдаст картинку, пока заглушка. */}
          <span
            className="hidden size-[180px] shrink-0 items-center justify-center rounded-2xl bg-muted text-muted-foreground sm:flex"
            aria-hidden="true"
          >
            <PackageCheck className="size-16" />
          </span>
        </section>

        <section className="rounded-2xl border border-border bg-background p-6">
          <h2 className="text-2xl font-medium tracking-[-0.04em] text-foreground sm:text-[26px]">
            Что дальше?
          </h2>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-2">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="flex min-w-0 flex-col gap-2">
                  <p className="text-base font-medium text-foreground">
                    {title}
                  </p>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <SupportCard />
      </div>
    </div>
  );
}
