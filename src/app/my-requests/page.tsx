import type { Metadata } from "next";
import { Suspense } from "react";
import { MyRequestsView } from "./components/MyRequestsView";

export const metadata: Metadata = {
  title: "Мои заявки — Агора",
  description: "История заявок и их текущие статусы.",
  robots: { index: false },
};

export default function MyRequestsPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-20 pb-20">
      <section className="flex flex-col gap-4 py-4">
        <p className="text-lg font-medium text-muted-foreground">Мои заявки</p>
        <h1 className="text-[26px] font-medium tracking-[-0.04em] text-foreground">
          Заявки и их статусы
        </h1>
      </section>

      <Suspense>
        <MyRequestsView />
      </Suspense>
    </div>
  );
}
