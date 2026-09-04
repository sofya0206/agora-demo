import type { Metadata } from "next";
import { RequestSentView } from "./RequestSentView";

export const metadata: Metadata = {
  title: "Заявка отправлена — Агора",
  description:
    "Заявка передана поставщику, менеджер свяжется с вами для уточнения деталей.",
  robots: { index: false },
};

interface RequestSentPageProps {
  searchParams: Promise<{ numbers?: string | string[] }>;
}

export default async function RequestSentPage({
  searchParams,
}: RequestSentPageProps) {
  const { numbers } = await searchParams;
  const raw = typeof numbers === "string" ? numbers : "";

  /* Номера отправленных заявок держим в адресе, чтобы ссылка открывалась напрямую. */
  const parsed = raw
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isInteger(value) && value > 0);

  return <RequestSentView numbers={parsed} />;
}
