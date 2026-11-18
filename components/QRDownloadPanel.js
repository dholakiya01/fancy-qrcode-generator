"use client";
import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { exportQR } from "@/lib/qr-generator";
import { Card, Options } from "./ui";
export default function QRDownloadPanel({ cfg, size }) {
  const [fmt, setFmt] = useState("png"),
    [busy, setBusy] = useState(false),
    [msg, setMsg] = useState(null);
  const go = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const { blob, note } = await exportQR(cfg, fmt, size),
        u = URL.createObjectURL(blob),
        a = document.createElement("a");
      a.href = u;
      a.download = `fancy-qr-${size}.${fmt}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(u), 2000);
      if (note) setMsg({ ok: 1, t: note });
    } catch (e) {
      setMsg({ t: e.message || "Export failed. Please try again." });
    } finally {
      setBusy(false);
    }
  };
  return (
    <Card icon={Download} title="Download">
      <Options
        cols={3}
        value={fmt}
        onChange={setFmt}
        items={[
          ["png", "PNG"],
          ["jpg", "JPG"],
          ["svg", "SVG"],
        ]}
      />
      <p className="text-xs text-muted">
        Size: {size} × {size}px (change under QR Settings)
      </p>
      <button
        type="button"
        disabled={!cfg || busy}
        onClick={go}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Download size={16} />
        )}
        Download QR Code
      </button>
      {msg && (
        <p
          className={`text-xs ${msg.ok ? "text-muted" : "text-red-600"}`}
          role="alert"
        >
          {msg.t}
        </p>
      )}
    </Card>
  );
}
