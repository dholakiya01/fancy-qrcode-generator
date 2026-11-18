"use client";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
export const inputCls =
  "w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";
export const Card = ({ icon: I, title, children }) => (
  <section className="rounded-2xl border border-black/[0.07] bg-white p-4 shadow-sm">
    <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
      {I && <I size={16} className="text-brand" />}
      {title}
    </h2>
    <div className="space-y-3">{children}</div>
  </section>
);
export const Lbl = ({ children }) => (
  <span className="mb-1 block text-xs font-medium text-muted">{children}</span>
);
export const Slider = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
}) => (
  <div>
    <div className="mb-1 flex justify-between text-xs">
      <span className="font-medium text-muted">{label}</span>
      <span>
        {value}
        {unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(+e.target.value)}
    />
  </div>
);
export const Toggle = ({ label, checked, onChange }) => (
  <label className="flex cursor-pointer items-center justify-between text-sm">
    <span>{label}</span>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 accent-brand"
    />
  </label>
);
export const Options = ({ value, onChange, items, cols = 3 }) => (
  <div
    className="grid gap-1.5"
    style={{ gridTemplateColumns: `repeat(${cols},minmax(0,1fr))` }}
  >
    {items.map(([id, l]) => (
      <button
        type="button"
        key={id}
        onClick={() => onChange(id)}
        className={`rounded-lg border px-2 py-1.5 text-xs transition ${value === id ? "border-brand bg-brand/10 font-semibold text-brand" : "border-black/10 hover:border-brand/50"}`}
      >
        {l}
      </button>
    ))}
  </div>
);
export function ColorField({ label, value, onChange }) {
  const [o, setO] = useState(false);
  return (
    <div className="relative">
      <Lbl>{label}</Lbl>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={label}
          onClick={() => setO(!o)}
          className="h-9 w-9 shrink-0 rounded-lg border border-black/10"
          style={{ background: value }}
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls + " font-mono"}
        />
      </div>
      {o && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setO(false)} />
          <div className="absolute left-0 top-full z-30 mt-2 rounded-xl border border-black/10 bg-white p-3 shadow-xl">
            <HexColorPicker
              color={/^#[0-9a-f]{6}$/i.test(value) ? value : "#000000"}
              onChange={onChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
