"use client";
import { useRef, useState } from "react";
import { Upload, Trash2, RefreshCw, ImageIcon } from "lucide-react";
import { LOGO_TYPES } from "@/lib/qr-validation";
export default function LogoUploader({ logo, setLogo }) {
    const ref = useRef(),
        [err, setErr] = useState(null);
    const pick = (e) => {
        const f = e.target.files?.[0];
        e.target.value = "";
        if (!f) return;
        if (!LOGO_TYPES.includes(f.type))
            return setErr("Unsupported file. Use PNG, JPG, SVG or WebP.");
        if (f.size > 5 * 1024 * 1024)
            return setErr("File is too large (max 5 MB).");
        setErr(null);
        setLogo(f);
    };
    return (
        <div className="space-y-2">
            <input
                ref={ref}
                type="file"
                hidden
                accept=".png,.jpg,.jpeg,.svg,.webp,image/png,image/jpeg,image/svg+xml,image/webp"
                onChange={pick}
            />
            {logo ? (
                <div className="flex items-center gap-3 rounded-xl border border-black/10 p-2">
                    <img
                        src={logo.url}
                        alt="Logo preview"
                        className="h-14 w-14 rounded-lg border border-black/5 bg-[repeating-conic-gradient(#eee_0_25%,#fff_0_50%)] bg-[length:12px_12px] object-contain"
                    />
                    <p className="min-w-0 flex-1 truncate text-xs">{logo.name}</p>
                    <button
                        type="button"
                        onClick={() => ref.current.click()}
                        className="rounded-lg border border-black/10 p-2 hover:border-brand hover:text-brand"
                        title="Replace"
                    >
                        <RefreshCw size={15} />
                    </button>
                    <button
                        type="button"
                        onClick={() => setLogo(null)}
                        className="rounded-lg border border-black/10 p-2 hover:border-red-400 hover:text-red-600"
                        title="Remove"
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => ref.current.click()}
                    className="flex w-full flex-col items-center gap-1 rounded-xl border-2 border-dashed border-brand/40 bg-brand/5 py-6 text-sm text-brand transition hover:bg-brand/10"
                >
                    <Upload size={22} />
                    <b>Upload your logo</b>
                    <span className="text-xs text-muted">
                        PNG, JPG, SVG or WebP · stays in your browser
                    </span>
                </button>
            )}
            {err && (
                <p role="alert" className="text-xs text-red-600">
                    {err}
                </p>
            )}
        </div>
    );
}
