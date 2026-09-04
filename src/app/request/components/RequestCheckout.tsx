"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { RequestItemsTable } from "@/components/request/RequestItemsTable";
import { RequestNotice } from "@/components/request/RequestNotice";
import { RequestSummary } from "@/components/request/RequestSummary";
import { RequestSupplierHeading } from "@/components/request/RequestSupplierHeading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequest } from "@/hooks/use-request";
import { useSubmittedRequests } from "@/hooks/use-submitted-requests";
import { formatPositions, groupBySupplier, requestTotal } from "@/lib/request";
import { AUTH_STUB_MESSAGE } from "@/lib/site";
import type { RequestContact } from "@/types";
import { ContactForm } from "./ContactForm";

export function RequestCheckout() {
  const router = useRouter();
  const { items, setQuantity, remove, clear } = useRequest();
  const { submit } = useSubmittedRequests();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  /* Заявка лежит в localStorage, до гидратации её состав неизвестен. */
  if (!mounted) {
    return (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_411px] lg:items-start">
        <Skeleton className="h-[520px] rounded-2xl" />
        <Skeleton className="h-[520px] rounded-2xl" />
      </div>
    );
  }

  if (items.length === 0) {
    return <EmptyRequest />;
  }

  const groups = groupBySupplier(items);

  const handleSubmit = (contact: RequestContact) => {
    const created = submit(
      groups.map((group) => ({
        supplierId: group.supplierId,
        supplierName: group.supplierName,
        supplierLogoUrl: group.supplierLogoUrl,
        items: group.items,
        contact,
      })),
    );

    clear();
    router.push(
      `/request/sent?numbers=${created.map((request) => request.number).join(",")}`,
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_411px] lg:items-start">
      <section className="flex flex-col gap-6 rounded-2xl border border-border bg-background p-6">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-2xl font-medium tracking-[-0.04em] text-foreground sm:text-[26px]">
            Ваша заявка
          </h2>
          <Badge variant="secondary">{formatPositions(items.length)}</Badge>
        </div>

        <RequestNotice>
          Мы передаём заявку поставщику. После проверки поставщик или менеджер
          свяжется с вами напрямую для уточнений
        </RequestNotice>

        {groups.length > 1 && (
          <RequestNotice>
            В заявке позиции {groups.length} поставщиков. Каждый получит свою
            заявку — со своим номером и своей предварительной суммой
          </RequestNotice>
        )}

        {groups.map((group, index) => (
          <div key={group.supplierId} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <RequestSupplierHeading
                  supplierId={group.supplierId}
                  name={group.supplierName}
                  logoUrl={group.supplierLogoUrl}
                />
                <Badge variant="secondary">
                  {groups.length > 1
                    ? `Заявка ${index + 1} из ${groups.length}`
                    : "Одна заявка — один поставщик"}
                </Badge>
              </div>
              <RequestItemsTable
                items={group.items}
                onQuantityChange={setQuantity}
                onRemove={remove}
              />
            </div>

            <RequestSummary
              total={requestTotal(group.items)}
              currency={group.items[0]?.currency}
              showNote={false}
            />
          </div>
        ))}

        {/* Оговорка одна на всю карточку, даже когда сумм несколько. */}
        <RequestNotice>
          Итоговая сумма предварительная. Финальную цену подтвердит поставщик
          после обработки заявки
        </RequestNotice>
      </section>

      <aside className="flex flex-col gap-6 rounded-2xl border border-border bg-background p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-medium tracking-[-0.04em] text-foreground sm:text-[26px]">
            Контактные данные
          </h2>
          <p className="text-sm text-muted-foreground">
            Обязательные поля отмечены{" "}
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
          </p>
        </div>

        {/* Регистрация обязательна по продукту, но экрана ещё нет — пока только вход в него. */}
        <RequestNotice>
          Чтобы следить за статусом заявки, нужен аккаунт.{" "}
          <button
            type="button"
            className="font-semibold underline underline-offset-4"
            onClick={() => toast(AUTH_STUB_MESSAGE)}
          >
            Зарегистрироваться
          </button>
        </RequestNotice>

        <ContactForm
          submitLabel={
            groups.length > 1
              ? "Отправить заявки поставщикам"
              : "Отправить заявку поставщику"
          }
          onSubmit={handleSubmit}
        />
      </aside>
    </div>
  );
}

function EmptyRequest() {
  return (
    <section className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-background px-6 py-20 text-center">
      <span className="flex size-14 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <ShoppingCart className="size-5" aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-medium tracking-[-0.04em] text-foreground sm:text-[26px]">
          В заявке пока пусто
        </h2>
        <p className="text-sm font-medium text-muted-foreground">
          Добавьте предложения из каталога — потом отправите их поставщику одной
          заявкой
        </p>
      </div>
      <Button asChild size="lg" className="mt-4">
        <Link href="/catalog">Перейти в каталог</Link>
      </Button>
    </section>
  );
}
