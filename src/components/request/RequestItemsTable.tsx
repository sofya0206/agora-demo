"use client";

import Image from "next/image";
import { Minus, Package, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatMoney } from "@/lib/catalog";
import { isPriceOnRequest, itemTotal, splitByPrice } from "@/lib/request";
import { cn } from "@/lib/utils";
import type { RequestItem } from "@/types";

interface RequestItemsTableProps {
  items: RequestItem[];
  /* В карточке отправленной заявки состав только читают. */
  readOnly?: boolean;
  onQuantityChange?: (offerId: number, quantity: number) => void;
  onRemove?: (offerId: number) => void;
}

/* Пятая колонка — кнопка удаления, в режиме чтения её нет. */
const editableColumns = "lg:grid-cols-[minmax(0,1fr)_165px_116px_116px_36px]";
const readOnlyColumns = "lg:grid-cols-[minmax(0,1fr)_165px_116px_116px]";

export function RequestItemsTable({
  items,
  readOnly = false,
  onQuantityChange,
  onRemove,
}: RequestItemsTableProps) {
  const { priced, onRequest } = splitByPrice(items);
  const columns = readOnly ? readOnlyColumns : editableColumns;

  const renderGroup = (groupItems: RequestItem[]) => (
    <div>
      {groupItems.map((item, index) => (
        <div
          key={item.offerId}
          className={cn(
            "grid gap-3 border-border py-6 lg:items-start lg:gap-4",
            columns,
            index === 0 ? "pt-2" : "border-t",
            index === groupItems.length - 1 && "pb-2",
          )}
        >
          <div className="flex min-w-0 gap-3">
            <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground">
              {item.photoUrl ? (
                <Image
                  src={item.photoUrl}
                  alt=""
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              ) : (
                <Package className="size-4" aria-hidden="true" />
              )}
            </span>
            <div className="flex min-w-0 flex-col items-start gap-2">
              <p className="text-sm font-medium text-foreground">
                {item.title}
              </p>
              <Badge variant="secondary">MOQ {item.moq}</Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {readOnly ? (
              <p className="text-sm text-foreground">
                {item.quantity} {item.priceBasis || "шт"}
              </p>
            ) : (
              <>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    size="icon-lg"
                    onClick={() =>
                      onQuantityChange?.(item.offerId, item.quantity - item.moq)
                    }
                    disabled={item.quantity - item.moq < item.moq}
                    aria-label={`Уменьшить количество: ${item.title}`}
                  >
                    <Minus aria-hidden="true" />
                  </Button>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={item.moq}
                    step={item.moq}
                    value={item.quantity}
                    onChange={(event) => {
                      const next = Number(event.target.value);
                      if (Number.isFinite(next)) {
                        onQuantityChange?.(item.offerId, Math.round(next));
                      }
                    }}
                    aria-label={`Количество: ${item.title}`}
                    className="h-9 w-[45px] px-1 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <Button
                    type="button"
                    size="icon-lg"
                    onClick={() =>
                      onQuantityChange?.(item.offerId, item.quantity + item.moq)
                    }
                    aria-label={`Увеличить количество: ${item.title}`}
                  >
                    <Plus aria-hidden="true" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {item.priceBasis || "шт"}
                </span>
              </>
            )}
          </div>

          <p className="flex items-center gap-2 text-sm text-foreground lg:pt-2">
            <span className="text-muted-foreground lg:hidden">Цена за ед.</span>
            {isPriceOnRequest(item)
              ? ""
              : formatMoney(item.price, item.currency)}
          </p>

          <p className="flex items-center gap-2 text-sm font-semibold text-foreground lg:pt-2">
            <span className="font-normal text-muted-foreground lg:hidden">
              Сумма
            </span>
            {isPriceOnRequest(item)
              ? "По запросу"
              : formatMoney(itemTotal(item), item.currency)}
          </p>

          {!readOnly && (
            <Button
              type="button"
              variant="outline"
              size="icon-lg"
              className="justify-self-end lg:justify-self-auto"
              onClick={() => onRemove?.(item.offerId)}
              aria-label={`Удалить из заявки: ${item.title}`}
            >
              <Trash2 aria-hidden="true" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div
        className={cn(
          "hidden gap-4 border-b border-border pb-4 lg:grid",
          columns,
        )}
      >
        <span className="text-base text-muted-foreground">Товар</span>
        <span className="text-base text-muted-foreground">Количество</span>
        <span className="text-base text-muted-foreground">Цена за ед.</span>
        <span className="text-base text-muted-foreground">Сумма</span>
        {!readOnly && <span className="sr-only">Действия</span>}
      </div>

      {priced.length > 0 && renderGroup(priced)}

      {onRequest.length > 0 && (
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-sm font-medium text-foreground">
              Товары с ценой по запросу
            </p>
            <p className="text-sm text-muted-foreground">
              Цену уточнит поставщик после получения заявки
            </p>
          </div>
          {renderGroup(onRequest)}
        </div>
      )}
    </div>
  );
}
