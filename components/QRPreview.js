"use client";
import { useEffect, useRef, useState } from "react";
import { Loader2, AlertTriangle, CheckCircle2, QrCode } from "lucide-react";
import { renderQR, assessRisk, selfCheck } from "@/lib/qr-generator";
export default function QRPreview({ cfg, error }) {
  const [url, setUrl] = useState(null),
    [ar, setAr] = useState(1),
    [busy, setBusy] = useState(false),
    [err, setErr] = useState(null),
    [ok, setOk] = useState(null),
    seq = useRef(0);
  useEffect(() => {
    const id = ++seq.current;
    if (!cfg) {
      setUrl(null);
      setOk(null);
      setBusy(false);
      return;
    }
    setBusy(true);
    const t = setTimeout(async () => {
      try {
        const c = await renderQR(cfg, 640),
          good = await selfCheck(c, cfg.data);
        if (id !== seq.current) return;
        setUrl(c.toDataURL());
        setAr(c.width / c.height);
        setOk(good);
        setErr(null);
      } catch (e) {
        if (id === seq.current) {
          setErr(e.message || "Could not generate QR code");
          setOk(null);
        }
      } finally {
        if (id === seq.current) setBusy(false);
      }
    }, 150);
    return () => clearTimeout(t);
  }, [cfg]);
  const warns = cfg ? assessRisk(cfg) : [];
  return (
    <div className="rounded-2xl border border-black/[0.07] bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between text-sm font-semibold">
        <span className="flex items-center gap-2">
          <QrCode size={16} className="text-brand" />
          Live Preview
        </span>
        {busy && <Loader2 size={16} className="animate-spin text-brand" />}
      </div>
      <div
        className="mx-auto grid max-w-[420px] place-items-center rounded-xl bg-[repeating-conic-gradient(#f1f1f4_0_25%,#fff_0_50%)] bg-[length:16px_16px] p-3"
        style={{ minHeight: 240 }}
      >
        {url && cfg ? (
          <img
            src={url}
            alt="QR code preview"
            style={{ aspectRatio: ar }}
            className={`w-full rounded-lg transition-opacity ${busy ? "opacity-50" : "opacity-100"}`}
          />
        ) : (
          <p className="px-6 py-16 text-center text-sm text-muted">
            {error || "Generating…"}
          </p>
        )}
      </div>
      {err && (
        <p
          role="alert"
          className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700"
        >
          {err}
        </p>
      )}
      {cfg && ok !== null && !busy && (
        <p
          className={`mt-3 flex items-start gap-2 rounded-lg px-3 py-2 text-xs ${ok ? "bg-accent/10 text-[#00705c]" : "bg-amber-50 text-amber-800"}`}
        >
          {ok ? (
            <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
          ) : (
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          )}
          {ok
            ? "A test decoder read this preview correctly. Still test with your phone before printing; this is not a guarantee."
            : "A test decoder could not read this design. Increase contrast, reduce logo size or simplify the style."}
        </p>
      )}
      {warns.map((w) => (
        <p
          key={w}
          className="mt-2 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800"
        >
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          {w}
        </p>
      ))}
    </div>
  );
}
