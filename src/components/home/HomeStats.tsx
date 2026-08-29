export function HomeStats() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-2 pt-1.5 pb-0.5 text-sm text-muted-foreground">
      <p>
        Анализ{" "}
        <span className="font-mono font-bold text-foreground">1 247</span>{" "}
        поставщиков
      </p>
      <p>
        Более{" "}
        <span className="font-mono font-bold text-foreground">50 000</span>{" "}
        обработанных заявок
      </p>
    </div>
  );
}
