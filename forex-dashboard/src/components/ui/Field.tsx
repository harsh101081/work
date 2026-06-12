"use client";

import { ReactNode, useEffect, useState } from "react";

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  prefix?: string;
  suffix?: string;
  hint?: ReactNode;
  placeholder?: string;
}

/**
 * Controlled numeric input that keeps a local string buffer so users can type
 * intermediate values (e.g. "1." or "") without the field fighting them.
 */
export function NumberField({
  label,
  value,
  onChange,
  step = 0.01,
  min,
  max,
  prefix,
  suffix,
  hint,
  placeholder,
}: NumberFieldProps) {
  const [text, setText] = useState<string>(String(value ?? ""));

  useEffect(() => {
    // Sync from the outside only when the parsed values diverge.
    const parsed = parseFloat(text);
    if (!(isFinite(parsed) && parsed === value)) {
      setText(value === 0 && text === "" ? "" : String(value ?? ""));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <div className="relative flex items-center">
        {prefix && (
          <span className="pointer-events-none absolute left-3 text-sm text-muted">{prefix}</span>
        )}
        <input
          type="number"
          inputMode="decimal"
          className={`field-input tnum ${prefix ? "pl-7" : ""} ${suffix ? "pr-10" : ""}`}
          value={text}
          step={step}
          min={min}
          max={max}
          placeholder={placeholder}
          onChange={(e) => {
            setText(e.target.value);
            const parsed = parseFloat(e.target.value);
            onChange(isFinite(parsed) ? parsed : 0);
          }}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 text-sm text-muted">{suffix}</span>
        )}
      </div>
      {hint && <p className="mt-1 text-[11px] text-muted">{hint}</p>}
    </label>
  );
}

interface SelectFieldProps<T extends string | number> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  hint?: ReactNode;
}

export function SelectField<T extends string | number>({
  label,
  value,
  onChange,
  options,
  hint,
}: SelectFieldProps<T>) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <div className="relative">
        <select
          className="field-input appearance-none pr-9"
          value={value}
          onChange={(e) => {
            const raw = e.target.value;
            const sample = options[0]?.value;
            onChange((typeof sample === "number" ? Number(raw) : raw) as T);
          }}
        >
          {options.map((o) => (
            <option key={String(o.value)} value={o.value} className="bg-surface">
              {o.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      {hint && <p className="mt-1 text-[11px] text-muted">{hint}</p>}
    </label>
  );
}
