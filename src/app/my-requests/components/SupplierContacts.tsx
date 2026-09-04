"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError, getSupplier } from "@/lib/api";
import type { Supplier } from "@/types";
import { RequestSupplierHeading } from "@/components/request/RequestSupplierHeading";

export function SupplierContacts({ supplierId }: { supplierId: number }) {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    getSupplier(supplierId, controller.signal)
      .then(({ data }) => {
        if (!controller.signal.aborted) setSupplier(data);
      })
      .catch((fetchError: unknown) => {
        if (controller.signal.aborted) return;

        setError(
          fetchError instanceof ApiError
            ? fetchError.message
            : "Не удалось загрузить поставщика.",
        );
      });

    return () => controller.abort();
  }, [attempt, supplierId]);

  if (error) {
    return (
      <div className="flex items-center justify-between gap-4 border-t border-border pt-6">
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setError("");
            setAttempt((value) => value + 1);
          }}
        >
          Повторить
        </Button>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div
        className="grid grid-cols-2 gap-4 border-t border-border pt-6"
        aria-label="Загрузка контактов поставщика"
      >
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-11" />
        ))}
      </div>
    );
  }

  return (
    <section className="border-t border-border pt-6">
      <RequestSupplierHeading
        supplierId={supplier.id}
        name={supplier.commercial_name}
        logoUrl={supplier.logo_url}
        asLink={false}
      />
      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
        <Contact label="Контактное лицо" value={supplier.contact.person} />
        <Contact
          label="Телефон"
          value={supplier.contact.phone}
          href={
            supplier.contact.phone ? `tel:${supplier.contact.phone}` : undefined
          }
        />
        <Contact
          label="Email"
          value={supplier.contact.email}
          href={
            supplier.contact.email
              ? `mailto:${supplier.contact.email}`
              : undefined
          }
        />
        <Contact label="Telegram" value={supplier.contact.telegram} />
        <Contact label="Юридический адрес" value={supplier.legal_address} />
        <Contact
          label="Сайт"
          value={supplier.contact.website}
          href={supplier.contact.website || undefined}
          external
        />
      </dl>
    </section>
  );
}

function Contact({
  label,
  value,
  href,
  external = false,
}: {
  label: string;
  value: string | null;
  href?: string;
  external?: boolean;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium break-words text-foreground">
        {value && href ? (
          <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            className="underline-offset-4 hover:underline"
          >
            {value}
          </a>
        ) : (
          value || "Не указано"
        )}
      </dd>
    </div>
  );
}
