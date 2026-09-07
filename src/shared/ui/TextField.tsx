import type { InputHTMLAttributes } from 'react';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'id'> {
  id: string;
  label: string;
  /** Shown under the field once set. Presence of this is what turns the field red. */
  error?: string | null;
}

/**
 * One input, one label, one error slot.
 *
 * Two deliberate behaviours, both chosen over the alternatives:
 *
 * - Required is marked *upfront* with an asterisk, so nobody discovers a field
 *   was mandatory only by being told off after pressing submit.
 * - The red state appears only when `error` is passed, which the forms set on
 *   submit — not while someone is still halfway through typing their phone
 *   number, where live validation reads as nagging.
 *
 * `aria-invalid` and `aria-describedby` are wired up so a screen reader
 * announces the error rather than leaving the red border as the only signal.
 */
export function TextField({ id, label, error, required, ...inputProps }: TextFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="text-sm">
      <label htmlFor={id} className="text-muted block font-medium">
        {label}
        {required ? (
          <span className="text-gold-700 ml-1" aria-hidden>
            *
          </span>
        ) : null}
      </label>
      <input
        {...inputProps}
        id={id}
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`bg-elevated mt-1.5 w-full rounded-[var(--radius-sm)] border px-3.5 py-2.5 transition-colors ${
          error ? 'border-red-600 focus-visible:outline-red-600' : 'border-border'
        }`}
      />
      {error ? (
        <p id={errorId} className="mt-1.5 text-xs text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
