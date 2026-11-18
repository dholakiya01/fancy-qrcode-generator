"use client";
import { useEffect, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import Header from "@/components/Header";
import QRContentPanel from "@/components/QRContentPanel";
import LogoUploader from "@/components/LogoUploader";
import LogoIntegrationSelector from "@/components/LogoIntegrationSelector";
import QRPreview from "@/components/QRPreview";
import QRDesignPanel from "@/components/QRDesignPanel";
import QRTemplateGallery from "@/components/QRTemplateGallery";
import QRDownloadPanel from "@/components/QRDownloadPanel";
import { Card } from "@/components/ui";
import { ImageIcon } from "lucide-react";
import { buildData } from "@/lib/qr-validation";
import {
  DEFAULT_DESIGN,
  DEFAULT_MODE,
  applyTemplate,
} from "@/lib/qr-templates";
export default function Home() {
  const [type, setType] = useState("url"),
    [fields, setFields] = useState({ url: "https://example.com" }),
    [logo, setLogoState] = useState(null),
    [mode, setMode] = useState("center"),
    [design, setDesign] = useState(DEFAULT_DESIGN),
    [modeOpts, setModeOpts] = useState(DEFAULT_MODE),
    [size, setSize] = useState(1024);
  const setLogo = (f) =>
    setLogoState((old) => {
      if (old) URL.revokeObjectURL(old.url);
      return f ? { url: URL.createObjectURL(f), name: f.name } : null;
    });
  useEffect(
    () => () => {
      if (logo) URL.revokeObjectURL(logo.url);
    },
    [logo],
  );
  const { data, error } = useMemo(
    () => buildData(type, fields),
    [type, fields],
  );
  const cfg = useMemo(
    () => (data ? { data, logo, mode, design, modeOpts } : null),
    [data, logo, mode, design, modeOpts],
  );
  return (
    <>
      <Header />
      <main className="mx-auto grid max-w-[1500px] gap-4 p-4 lg:grid-cols-[340px_minmax(0,1fr)_340px]">
        <div className="order-2 space-y-4 lg:order-1">
          <QRContentPanel
            type={type}
            setType={setType}
            fields={fields}
            setFields={setFields}
            error={error}
          />
          <Card icon={ImageIcon} title="Logo">
            <LogoUploader logo={logo} setLogo={setLogo} />
          </Card>
          {logo && (
            <LogoIntegrationSelector
              mode={mode}
              setMode={setMode}
              d={design}
              setD={setDesign}
              m={modeOpts}
              setM={setModeOpts}
            />
          )}
        </div>
        <div className="order-1 space-y-4 lg:sticky lg:top-4 lg:order-2 lg:self-start">
          <QRPreview cfg={cfg} error={error} />
          <QRDownloadPanel cfg={cfg} size={size} />
        </div>
        <div className="order-3 space-y-4">
          <QRTemplateGallery
            onPick={(t) => setDesign((d) => applyTemplate(d, t))}
          />
          <QRDesignPanel
            d={design}
            setD={setDesign}
            size={size}
            setSize={setSize}
          />
          <button
            type="button"
            onClick={() => {
              setDesign(DEFAULT_DESIGN);
              setModeOpts(DEFAULT_MODE);
              setMode("center");
              setSize(1024);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-white py-2.5 text-sm transition hover:border-brand hover:text-brand"
          >
            <RotateCcw size={15} />
            Reset customization
          </button>
        </div>
      </main>
    </>
  );
}
