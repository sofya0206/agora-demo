import { cn } from "@/lib/utils";

type Tone = "light" | "soft" | "panel" | "mint";

const toneClass: Record<Tone, string> = {
  light: "bg-home-bg text-home-text",
  soft: "bg-home-bg-soft text-home-text",
  panel: "bg-home-panel text-home-panel-text",
  mint: "bg-home-accent-surface text-home-text",
};

interface HomeSectionProps {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}

/* Секции лендинга идут во всю ширину, содержимое держим на сетке 1200.
   Каждая секция занимает экран под шапкой, содержимое стоит по центру —
   внешняя обёртка центрирует, а раскладку задаёт внутренняя. */
export function HomeSection({
  tone = "light",
  className,
  children,
}: HomeSectionProps) {
  return (
    <section
      className={cn("w-full snap-start scroll-mt-[90px]", toneClass[tone])}
    >
      <div className="mx-auto flex min-h-[calc(100svh-90px)] w-full max-w-[1200px] items-center px-5 py-20 sm:px-8 sm:py-26">
        <div className={cn("w-full", className)}>{children}</div>
      </div>
    </section>
  );
}

interface HomeHeadingProps {
  /* Надзаголовок вида «01 / ПРОБЛЕМА». */
  eyebrow: string;
  /* Строки заголовка; последняя набрана акцентом. */
  lines: string[];
  lead?: string;
  /* Дополнение под абзацем в правой колонке, например список с галочками. */
  aside?: React.ReactNode;
  tone?: Tone;
  align?: "start" | "center";
  className?: string;
}

export function HomeHeading({
  eyebrow,
  lines,
  lead,
  aside,
  tone = "light",
  align = "start",
  className,
}: HomeHeadingProps) {
  const onPanel = tone === "panel";
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        centered
          ? "items-center text-center"
          : "lg:flex-row lg:justify-between",
        /* Абзац стоит по низу заголовка; если под ним есть ещё список, колонки ровняем по верху. */
        !centered && (aside ? "lg:items-start" : "lg:items-end"),
        className,
      )}
    >
      <div
        className={cn("flex flex-col gap-4", !centered && "lg:max-w-[620px]")}
      >
        <p
          className={cn(
            "text-xs font-semibold tracking-[0.12em] uppercase",
            onPanel ? "text-home-panel-muted" : "text-home-muted",
          )}
        >
          {eyebrow}
        </p>
        <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-[40px] sm:leading-[1.15]">
          {lines.map((line, index) => (
            <span
              key={line}
              className={cn(
                "block",
                index === lines.length - 1 &&
                  (onPanel ? "text-home-panel-accent" : "text-home-accent"),
              )}
            >
              {line}
            </span>
          ))}
        </h2>
      </div>

      {(lead || aside) && (
        <div
          className={cn(
            "flex flex-col gap-5",
            centered ? "max-w-[640px]" : "lg:max-w-[380px]",
            /* При выравнивании по верху абзац начинается на уровне заголовка, не надзаголовка. */
            !centered && aside && "lg:pt-8",
          )}
        >
          {lead && (
            <p
              className={cn(
                "text-sm leading-6",
                onPanel ? "text-home-panel-muted" : "text-home-muted",
              )}
            >
              {lead}
            </p>
          )}
          {aside}
        </div>
      )}
    </div>
  );
}
