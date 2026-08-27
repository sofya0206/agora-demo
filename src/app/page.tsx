import type { Metadata } from "next";
import { HomeCta } from "@/components/home/HomeCta";
import { HomeFeatures } from "@/components/home/HomeFeatures";
import { HomeFinder } from "@/components/home/HomeFinder";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeStats } from "@/components/home/HomeStats";

export const metadata: Metadata = {
  title: "Агора — B2B-платформа упаковки",
  description:
    "Найдите поставщиков транспортной упаковки: подбор по ассортименту, единая заявка и ответы за часы.",
};

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-7">
      <HomeHero />
      <HomeFinder />
      <HomeStats />
      <HomeFeatures />
      <HomeCta />
    </div>
  );
}
