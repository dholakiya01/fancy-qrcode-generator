"use client";
import { Palette } from "lucide-react";
import { Card, Slider, Toggle, Options, ColorField, Lbl } from "./ui";
export default function QRDesignPanel({ d, setD, size, setSize }) {
  const s = (k) => (v) => setD((x) => ({ ...x, [k]: v })),
    sg = (k) => (v) =>
      setD((x) => ({ ...x, gradient: { ...x.gradient, [k]: v } }));
  return (
    <>
      <Card icon={Palette} title="Dot Style">
        <Options
          value={d.dots}
          onChange={s("dots")}
          items={[
            ["square", "Square"],
            ["rounded", "Rounded"],
            ["dots", "Dots"],
            ["classy", "Classy"],
            ["classy-rounded", "Classy Rounded"],
            ["extra-rounded", "Extra Rounded"],
          ]}
        />
      </Card>
      <Card title="Corners">
        <div>
          <Lbl>Corner square</Lbl>
          <Options
            value={d.cornerSquare}
            onChange={s("cornerSquare")}
            items={[
              ["square", "Square"],
              ["extra-rounded", "Extra Rounded"],
              ["dot", "Dot"],
            ]}
          />
        </div>
        <div>
          <Lbl>Corner dot</Lbl>
          <Options
            cols={2}
            value={d.cornerDot}
            onChange={s("cornerDot")}
            items={[
              ["square", "Square"],
              ["dot", "Dot"],
            ]}
          />
        </div>
      </Card>
      <Card title="Colors">
        <ColorField label="Foreground" value={d.fg} onChange={s("fg")} />
        <Toggle label="Gradient" checked={d.gradient.on} onChange={sg("on")} />
        {d.gradient.on && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <ColorField
                label="Start"
                value={d.gradient.start}
                onChange={sg("start")}
              />
              <ColorField
                label="End"
                value={d.gradient.end}
                onChange={sg("end")}
              />
            </div>
            <Slider
              label="Direction"
              value={d.gradient.dir}
              min={0}
              max={360}
              unit="°"
              onChange={sg("dir")}
            />
          </>
        )}
        <div>
          <Lbl>Background</Lbl>
          <Options
            cols={2}
            value={d.bgMode}
            onChange={s("bgMode")}
            items={[
              ["solid", "Solid"],
              ["transparent", "Transparent"],
            ]}
          />
        </div>
        {d.bgMode === "solid" && (
          <ColorField
            label="Background color"
            value={d.bg}
            onChange={s("bg")}
          />
        )}
      </Card>
      <Card title="QR Settings">
        <div>
          <Lbl>Error correction</Lbl>
          <Options
            cols={4}
            value={d.ec}
            onChange={s("ec")}
            items={[
              ["L", "L 7%"],
              ["M", "M 15%"],
              ["Q", "Q 25%"],
              ["H", "H 30%"],
            ]}
          />
        </div>
        <Slider
          label="Quiet zone / margin"
          value={d.margin}
          min={0}
          max={10}
          unit="%"
          onChange={s("margin")}
        />
        <div>
          <Lbl>Export dimensions</Lbl>
          <Options
            value={size}
            onChange={setSize}
            items={[
              [512, "512"],
              [1024, "1024"],
              [2048, "2048"],
            ]}
          />
        </div>
      </Card>
    </>
  );
}
