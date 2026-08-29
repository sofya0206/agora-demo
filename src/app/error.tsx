"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold text-foreground">
        Что-то пошло не так
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Не удалось загрузить страницу. Попробуйте ещё раз.
      </p>
      <Button type="button" onClick={() => unstable_retry()}>
        Повторить
      </Button>
    </div>
  );
}
