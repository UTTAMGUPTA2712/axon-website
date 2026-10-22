/**
 * The wordmark: a signal bar and a name. The bar is the only place the accent
 * appears unprompted, which is what keeps it meaning something everywhere else.
 */
export function Brand({ title, lede }: { title: string; lede?: string }) {
  return (
    <>
      <div className="flex items-baseline gap-2.5">
        <span aria-hidden className="h-5 w-[3px] bg-signal" />
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
          {title}
        </h1>
      </div>
      {lede && (
        <p className="mt-2 max-w-[42ch] text-[13px] text-muted">{lede}</p>
      )}
    </>
  );
}

/** A message the reader has to act on. Border plus words, never colour alone. */
export function Notice({
  tone = "crit",
  children,
}: {
  tone?: "crit" | "warn" | "good";
  children: React.ReactNode;
}) {
  const skin =
    tone === "crit"
      ? "border-crit bg-crit-wash"
      : tone === "warn"
        ? "border-warn bg-warn-wash"
        : "border-good bg-good-wash";

  return (
    <p
      role={tone === "crit" ? "alert" : undefined}
      className={`border-l-2 ${skin} px-3 py-2 text-[13px] text-ink`}
    >
      {children}
    </p>
  );
}
