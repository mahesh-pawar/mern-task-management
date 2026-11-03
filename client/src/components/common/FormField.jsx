import { useId } from 'react';

// Shared styles for text inputs, textareas and selects (red border when invalid)
function controlClass(error) {
  const base =
    'block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-xs placeholder:text-slate-400 focus:outline-none focus:ring-2';
  const state = error
    ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200';
  return `${base} ${state}`;
}

function Label({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
      {children}
    </label>
  );
}

function HelpText({ error, hint }) {
  if (error) return <p className="text-xs text-red-600">{error}</p>;
  if (hint) return <p className="text-xs text-slate-500">{hint}</p>;
  return null;
}

export function Input({ label, error, hint, ...props }) {
  const id = useId();

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <input id={id} className={controlClass(error)} aria-invalid={Boolean(error)} {...props} />
      <HelpText error={error} hint={hint} />
    </div>
  );
}

export function Textarea({ label, error, ...props }) {
  const id = useId();

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <textarea id={id} className={`${controlClass(error)} resize-y`} aria-invalid={Boolean(error)} {...props} />
      <HelpText error={error} />
    </div>
  );
}

// options: [{ value, label }]
export function Select({ label, error, options, ...props }) {
  const id = useId();

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <select id={id} className={`${controlClass(error)} pr-8`} aria-invalid={Boolean(error)} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <HelpText error={error} />
    </div>
  );
}
