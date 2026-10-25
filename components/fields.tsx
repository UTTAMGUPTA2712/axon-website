/** The form controls both the sign-in and the sign-up page use, so they match. */

export function Field({
  id,
  label,
  type = "text",
  autoComplete,
  required,
  autoFocus,
  placeholder,
  hint,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-medium text-muted">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        autoFocus={autoFocus}
        placeholder={placeholder}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className="mt-1.5 h-10 w-full rounded-md border border-line-strong bg-plane px-3 text-[14px] text-ink outline-none placeholder:text-faint focus:border-signal"
      />
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-[12px] text-faint">
          {hint}
        </p>
      )}
    </div>
  );
}

export function SubmitButton({
  pending,
  children,
  pendingLabel,
  tone = "signal",
}: {
  pending: boolean;
  children: React.ReactNode;
  pendingLabel: string;
  tone?: "signal" | "quiet";
}) {
  const skin =
    tone === "signal"
      ? "bg-signal text-signal-ink hover:brightness-110"
      : "border border-line-strong bg-surface text-ink hover:bg-raised";

  return (
    <button
      type="submit"
      disabled={pending}
      className={`h-10 w-full rounded-md px-3 text-[14px] font-medium ${skin} transition-[filter,background-color] duration-150 disabled:opacity-60`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
