"use client";
import { Card, Slider, Toggle, Options, ColorField, Lbl, inputCls } from "./ui";
import { Layers } from "lucide-react";
const Grid = ({ fill = "#202124", o = 1 }) =>
  [...Array(36)].map((_, i) =>
    (i * 7 + (i % 5)) % 3 ? (
      <rect
        key={i}
        x={6 + (i % 6) * 6}
        y={6 + Math.floor(i / 6) * 6}
        width="4.5"
        height="4.5"
        rx="1"
        fill={fill}
        opacity={o}
      />
    ) : null,
  );
const S = ({ children }) => (
  <svg viewBox="0 0 48 48" className="h-14 w-14">
    {children}
  </svg>
);
const MODES = [
  [
    "center",
    "Center Logo",
    "Logo in the middle",
    () => (
      <S>
        <Grid />
        <rect
          x="16"
          y="16"
          width="16"
          height="16"
          rx="4"
          fill="#fff"
          stroke="#845ec2"
          strokeWidth="2"
        />
        <circle cx="24" cy="24" r="3.5" fill="#845ec2" />
      </S>
    ),
  ],
  [
    "watermark",
    "Background Watermark",
    "Logo behind the code",
    () => (
      <S>
        <circle cx="24" cy="24" r="19" fill="#845ec2" opacity=".22" />
        <Grid />
      </S>
    ),
  ],
  [
    "integrated",
    "Integrated Pattern",
    "Logo blended into dots",
    () => (
      <S>
        <defs>
          <linearGradient id="mg">
            <stop offset="0" stopColor="#845ec2" />
            <stop offset="1" stopColor="#00c9a7" />
          </linearGradient>
        </defs>
        <Grid fill="url(#mg)" />
      </S>
    ),
  ],
  [
    "frame",
    "Frame / Badge",
    "Logo + call-to-action",
    () => (
      <S>
        <rect x="3" y="2" width="42" height="44" rx="6" fill="#845ec2" />
        <circle cx="24" cy="9" r="4" fill="#fff" />
        <rect x="10" y="15" width="28" height="22" rx="3" fill="#fff" />
        <rect x="15" y="40" width="18" height="4" rx="2" fill="#fff" />
      </S>
    ),
  ],
];
export default function LogoIntegrationSelector({
  mode,
  setMode,
  d,
  setD,
  m,
  setM,
}) {
  const sd = (k) => (v) => setD((x) => ({ ...x, [k]: v })),
    sm = (k) => (v) => setM((x) => ({ ...x, [k]: v }));
  return (
    <Card
      icon={Layers}
      title="How would you like to integrate your logo into the QR code?"
    >
      <div className="grid grid-cols-2 gap-2">
        {MODES.map(([id, t, s, Ic]) => (
          <button
            type="button"
            key={id}
            onClick={() => setMode(id)}
            className={`flex flex-col items-center rounded-xl border p-2 text-center transition ${mode === id ? "border-brand bg-brand/10 ring-2 ring-brand/20" : "border-black/10 hover:border-brand/50"}`}
          >
            <Ic />
            <b className="mt-1 text-xs">{t}</b>
            <span className="text-[10px] text-muted">{s}</span>
          </button>
        ))}
      </div>
      <div className="space-y-3 border-t border-black/5 pt-3">
        {mode === "center" && (
          <>
            <Slider
              label="Logo size"
              value={d.logoSize}
              min={10}
              max={40}
              unit="%"
              onChange={sd("logoSize")}
            />
            <Slider
              label="Logo margin"
              value={d.logoMargin}
              min={0}
              max={20}
              unit="px"
              onChange={sd("logoMargin")}
            />
            <div>
              <Lbl>Logo shape</Lbl>
              <Options
                value={d.logoShape}
                onChange={sd("logoShape")}
                items={[
                  ["square", "Square"],
                  ["rounded", "Rounded"],
                  ["circle", "Circle"],
                ]}
              />
            </div>
            <Toggle
              label="Background behind logo"
              checked={d.logoBg}
              onChange={sd("logoBg")}
            />
            {d.logoBg && (
              <ColorField
                label="Logo background"
                value={d.logoBgColor}
                onChange={sd("logoBgColor")}
              />
            )}
            <Slider
              label="Border thickness"
              value={d.logoBorder}
              min={0}
              max={8}
              unit="px"
              onChange={sd("logoBorder")}
            />
            {d.logoBorder > 0 && (
              <ColorField
                label="Border color"
                value={d.logoBorderColor}
                onChange={sd("logoBorderColor")}
              />
            )}
            <Slider
              label="Logo opacity"
              value={d.logoOpacity}
              min={30}
              max={100}
              unit="%"
              onChange={sd("logoOpacity")}
            />
          </>
        )}
        {mode === "watermark" && (
          <>
            <Slider
              label="Watermark opacity"
              value={m.wmOpacity}
              min={5}
              max={40}
              unit="%"
              onChange={sm("wmOpacity")}
            />
            <Slider
              label="Logo size"
              value={m.wmSize}
              min={30}
              max={100}
              unit="%"
              onChange={sm("wmSize")}
            />
            <Slider
              label="Position X"
              value={m.wmX}
              min={-40}
              max={40}
              onChange={sm("wmX")}
            />
            <Slider
              label="Position Y"
              value={m.wmY}
              min={-40}
              max={40}
              onChange={sm("wmY")}
            />
            <ColorField
              label="Background color"
              value={d.bg}
              onChange={sd("bg")}
            />
          </>
        )}
        {mode === "integrated" && (
          <>
            <p className="text-xs text-muted">
              QR dots are filled with your logo's colors (scaled without
              distortion), darkened to keep contrast.
            </p>
            <Slider
              label="Logo size"
              value={m.intScale}
              min={60}
              max={250}
              unit="%"
              onChange={sm("intScale")}
            />
            <Slider
              label="Position X"
              value={m.intX}
              min={-50}
              max={50}
              onChange={sm("intX")}
            />
            <Slider
              label="Position Y"
              value={m.intY}
              min={-50}
              max={50}
              onChange={sm("intY")}
            />
          </>
        )}
        {mode === "frame" && (
          <>
            <div>
              <Lbl>Logo position</Lbl>
              <Options
                cols={2}
                value={m.framePos}
                onChange={sm("framePos")}
                items={[
                  ["top", "Above QR"],
                  ["bottom", "Below QR"],
                ]}
              />
            </div>
            <ColorField
              label="Frame color"
              value={m.frameColor}
              onChange={sm("frameColor")}
            />
            <div>
              <Lbl>Business name (optional)</Lbl>
              <input
                className={inputCls}
                maxLength={30}
                value={m.bizName}
                onChange={(e) => sm("bizName")(e.target.value)}
              />
            </div>
            <div>
              <Lbl>Call-to-action</Lbl>
              <input
                className={inputCls}
                maxLength={30}
                value={m.cta}
                onChange={(e) => sm("cta")(e.target.value)}
              />
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
