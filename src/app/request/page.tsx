import type { Metadata } from "next";
import { RequestCheckout } from "./components/RequestCheckout";

export const metadata: Metadata = {
  title: "Оформление заявки — Агора",
  description:
    "Проверьте состав заявки, укажите контактные данные и отправьте заявку поставщику упаковки.",
  robots: { index: false },
};

export default function RequestPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-5 pb-20 sm:px-8 xl:px-20">
      <section className="flex flex-col gap-4 py-4">
        <p className="text-lg font-medium text-muted-foreground">Заявки</p>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-medium tracking-[-0.04em] text-foreground sm:text-[26px]">
            Оформление заявки
          </h1>
          <p className="text-sm font-medium text-muted-foreground">
            Проверьте состав и отправьте заявку поставщику — цены подтвердит
            менеджер
          </p>
        </div>
      </section>

      <RequestCheckout />
    </div>
  );
}
