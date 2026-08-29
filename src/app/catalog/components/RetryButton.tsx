"use client";

import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RetryButton() {
  const router = useRouter();

  return (
    <Button
      type="button"
      size="lg"
      className="mt-6"
      onClick={() => router.refresh()}
    >
      <RotateCcw data-icon="inline-start" aria-hidden="true" />
      Повторить
    </Button>
  );
}
