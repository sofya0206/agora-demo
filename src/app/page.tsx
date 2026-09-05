import type { Metadata } from "next";
import { HomeAiMatch } from "@/components/home/HomeAiMatch";
import { HomeBuyer } from "@/components/home/HomeBuyer";
import { HomeCta } from "@/components/home/HomeCta";
import { HomeFaq } from "@/components/home/HomeFaq";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeProblem } from "@/components/home/HomeProblem";
import { HomeRoadmap } from "@/components/home/HomeRoadmap";
import { HomeSolution } from "@/components/home/HomeSolution";
import { HomeSupplier } from "@/components/home/HomeSupplier";

export const metadata: Metadata = {
  title: "Агора — поставщики упаковки под вашу задачу",
  description:
    "Агора помогает бизнесу находить поставщиков транспортной и промышленной упаковки по понятным условиям: AI-подбор, сравнение условий и единая заявка.",
};

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeProblem />
      <HomeSolution />
      <HomeAiMatch />
      <HomeBuyer />
      <HomeSupplier />
      <HomeRoadmap />
      <HomeFaq />
      <HomeCta />
    </>
  );
}
