"use client";

import { useState } from "react";
import { ru } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateFieldProps {
  id: string;
  /* Дата в формате YYYY-MM-DD, пустая строка — не выбрана. */
  value: string;
  invalid?: boolean;
  describedBy?: string;
  onChange: (value: string) => void;
}

function toDate(value: string) {
  if (!value) return undefined;
  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime()) ? undefined : date;
}

/* Складываем дату руками, чтобы не сдвинуть день часовым поясом. */
function toValue(date: Date) {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
}

export function DateField({
  id,
  value,
  invalid,
  describedBy,
  onChange,
}: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const selected = toDate(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          size="lg"
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={cn(
            "w-full justify-start gap-2 border-input font-normal",
            !selected && "text-muted-foreground",
          )}
        >
          <CalendarIcon aria-hidden="true" />
          {selected ? selected.toLocaleDateString("ru-RU") : "Выберите дату"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          locale={ru}
          autoFocus
          selected={selected}
          defaultMonth={selected}
          disabled={{ before: today }}
          onSelect={(date) => {
            if (!date) return;
            onChange(toValue(date));
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
