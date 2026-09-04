import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface RequestNoticeProps {
  children: React.ReactNode;
  className?: string;
}

/*
  Предупреждение из макета заявки: оранжевый текст и иконка на фоне карточки.
  Обёртка над Alert, потому что варианта warning в shadcn нет, а файлы
  src/components/ui руками не правим.
*/
export function RequestNotice({ children, className }: RequestNoticeProps) {
  return (
    <Alert className={cn("items-center text-warning", className)}>
      <Info aria-hidden="true" />
      <AlertDescription className="text-warning">{children}</AlertDescription>
    </Alert>
  );
}
