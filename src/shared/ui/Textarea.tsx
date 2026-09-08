import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className' | 'id'> {
  id: string;
  label: string;
  /** Sits under the control, above any error — the plain-language "what do I put here". */
  hint?: string;
  error?: string | null;
}

/** TextField's multi-line sibling. Same anatomy, same 16px-base iOS zoom fix. */
export function Textarea({ id, label, hint, error, required, ...textareaProps }: TextareaProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ');

  return (
    <div className="text-base sm:text-sm">
      <label htmlFor={id} className="text-muted block font-medium">
        {label}
        {required ? (
          <span className="text-gold-700 ml-1" aria-hidden>
            *
          </span>
        ) : null}
      </label>
      <textarea
        {...textareaProps}
        id={id}
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={`bg-elevated mt-1.5 w-full rounded-[var(--radius-sm)] border px-3.5 py-2.5 transition-colors ${
          error ? 'border-red-600 focus-visible:outline-red-600' : 'border-border'
        }`}
      />
      {hint ? (
        <p id={hintId} className="text-muted mt-1.5 text-xs">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-1.5 text-xs text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
