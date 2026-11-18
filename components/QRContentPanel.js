"use client";
import {
  Globe,
  Type,
  Mail,
  Phone,
  MessageCircle,
  Wifi,
  Contact,
  MapPin,
  IndianRupee,
  FileText,
} from "lucide-react";
import { QR_TYPES } from "@/lib/qr-validation";
import { Card, inputCls, Lbl } from "./ui";
const ICONS = {
  url: Globe,
  text: Type,
  email: Mail,
  phone: Phone,
  whatsapp: MessageCircle,
  wifi: Wifi,
  vcard: Contact,
  location: MapPin,
  upi: IndianRupee,
};
export default function QRContentPanel({
  type,
  setType,
  fields,
  setFields,
  error,
}) {
  const t = QR_TYPES.find((x) => x.id === type),
    set = (k, v) => setFields((f) => ({ ...f, [k]: v }));
  return (
    <Card icon={FileText} title="QR Content">
      <div className="grid grid-cols-3 gap-1.5">
        {QR_TYPES.map((q) => {
          const I = ICONS[q.id];
          return (
            <button
              type="button"
              key={q.id}
              onClick={() => setType(q.id)}
              className={`flex flex-col items-center gap-1 rounded-xl border p-2 text-center text-[11px] leading-tight transition ${type === q.id ? "border-brand bg-brand/10 font-semibold text-brand" : "border-black/10 hover:border-brand/50"}`}
            >
              <I size={16} />
              {q.label}
            </button>
          );
        })}
      </div>
      {t.f.map((f) => (
        <div key={f.k}>
          <Lbl>{f.l}</Lbl>
          {f.opts ? (
            <select
              className={inputCls}
              value={fields[f.k] || f.opts[0]}
              onChange={(e) => set(f.k, e.target.value)}
            >
              {f.opts.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          ) : f.area ? (
            <textarea
              rows={3}
              className={inputCls}
              placeholder={f.p}
              value={fields[f.k] || ""}
              onChange={(e) => set(f.k, e.target.value)}
            />
          ) : (
            <input
              className={inputCls}
              placeholder={f.p}
              value={fields[f.k] || ""}
              onChange={(e) => set(f.k, e.target.value)}
            />
          )}
        </div>
      ))}
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700"
        >
          {error}
        </p>
      )}
    </Card>
  );
}
