import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold text-foreground">Страница не найдена</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Такой страницы нет. Возможно, она была перемещена или удалена.
      </p>
      <Button asChild>
        <Link href="/catalog">Перейти в каталог</Link>
      </Button>
    </div>
  );
}
