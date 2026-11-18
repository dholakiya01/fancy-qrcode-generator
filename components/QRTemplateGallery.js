"use client";
import { Sparkles } from "lucide-react";
import { TEMPLATES } from "@/lib/qr-templates";
import { Card } from "./ui";
export default function QRTemplateGallery({ onPick }) {
  return (
    <Card icon={Sparkles} title="Templates">
      <div className="grid grid-cols-2 gap-2">
        {TEMPLATES.map((t) => (
          <button
            type="button"
            key={t.id}
            onClick={() => onPick(t)}
            className="flex items-center gap-2 rounded-xl border border-black/10 p-2 text-left text-xs transition hover:border-brand hover:shadow-sm"
          >
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-black/5"
              style={{ background: t.bg }}
            >
              <span
                className="h-5 w-5"
                style={{
                  background: t.gradient.on
                    ? `linear-gradient(${t.gradient.dir}deg,${t.gradient.start},${t.gradient.end})`
                    : t.fg,
                  borderRadius:
                    t.dots === "square" || t.dots === "classy" ? 2 : 8,
                }}
              />
            </span>
            <b className="leading-tight">{t.name}</b>
          </button>
        ))}
      </div>
    </Card>
  );
}
