/** The brand mark: the same artwork as the favicon and the extension's toolbar icon. */
export function Mark({ size = 24 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- a fixed, local, tiny asset
    <img src="/icon-192.png" alt="" aria-hidden width={size} height={size} className="rounded-full" />
  );
}

/**
 * The masthead of every public page: mark and name, then the page's own title in the
 * display serif. The serif is the one place this surface speaks in a different voice
 * from the extension; everything else is Geist.
 */
export function Brand({ title, lede }: { title: string; lede?: string }) {
  return (
    <>
      <div className="flex items-center gap-2.5">
        <Mark />
        <span className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
          Axon
        </span>
      </div>
      <h1 className="mt-8 font-serif text-[34px] font-medium leading-[1.1] tracking-[-0.01em] text-ink">
        {title}
      </h1>
      {lede && (
        <p className="mt-3 max-w-[44ch] text-[15px] leading-relaxed text-muted">
          {lede}
        </p>
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
      className={`rounded-md border ${skin} px-3 py-2.5 text-[13px] text-ink`}
    >
      {children}
    </p>
  );
}
